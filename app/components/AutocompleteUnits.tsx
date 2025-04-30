import { useFetcher } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";



// Composant AutocompleteUnits avec données dynamiques
export default function AutocompleteUnits({ value, onChange }) {
    const [units, setUnits] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState('bottom'); // 'bottom' ou 'top'
    const containerRef = useRef(null);
    const dropdownRef = useRef(null);
    const unitsFetcher = useFetcher();

    // Charger les unités au montage du composant
    useEffect(() => {
        if (unitsFetcher.state === "idle" && !unitsFetcher.data) {
            unitsFetcher.load("/api/units");
        }
    }, [unitsFetcher]);

    // Mettre à jour les unités quand les données sont chargées
    useEffect(() => {
        if (unitsFetcher.data?.units) {
            setUnits(unitsFetcher.data.units);
        }
    }, [unitsFetcher.data]);

    // Détecter la position optimale du dropdown
    useEffect(() => {
        if (showDropdown && containerRef.current) {
            const updatePosition = () => {
                const containerRect = containerRef.current.getBoundingClientRect();
                const viewportHeight = window.innerHeight;
                const spaceBelow = viewportHeight - containerRect.bottom;
                const requiredSpace = 200; // Hauteur approximative du dropdown

                if (spaceBelow < requiredSpace && containerRect.top > requiredSpace) {
                    setDropdownPosition('top');
                } else {
                    setDropdownPosition('bottom');
                }
            };

            updatePosition();
            window.addEventListener('resize', updatePosition);
            window.addEventListener('scroll', updatePosition);

            return () => {
                window.removeEventListener('resize', updatePosition);
                window.removeEventListener('scroll', updatePosition);
            };
        }
    }, [showDropdown]);

    // Fermer le dropdown si on clique en dehors
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Filtrer les unités basées sur la saisie
    const filteredUnits = units.filter(unit =>
        !value || unit.toLowerCase().includes(value.toLowerCase())
    );

    return (
        <div className="autocomplete-units relative" ref={containerRef}>
            <div className="flex items-center border border-gray-300 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => setShowDropdown(true)}
                    className="block w-full px-3 py-2 border-0 focus:outline-none bg-transparent"
                    placeholder="Unité"
                />
                <button
                    type="button"
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="px-2 py-1 text-gray-500 hover:text-gray-700"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d={showDropdown ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                    </svg>
                </button>
            </div>

            {showDropdown && (
                <div
                    ref={dropdownRef}
                    className={`absolute left-0 right-0 bg-white shadow-lg rounded-md max-h-44 overflow-y-auto z-20 ${dropdownPosition === 'top'
                        ? 'bottom-full mb-1' // Positionné au-dessus
                        : 'top-full mt-1'    // Positionné en-dessous
                        }`}
                >
                    {unitsFetcher.state === "loading" ? (
                        <div className="p-3 text-center text-gray-500">
                            Chargement...
                        </div>
                    ) : filteredUnits.length > 0 ? (
                        <div className="grid grid-cols-2 gap-1 p-2">
                            {filteredUnits.map((unit, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => {
                                        onChange(unit);
                                        setShowDropdown(false);
                                    }}
                                    className="text-left px-3 py-2 hover:bg-gray-100 rounded-md text-sm"
                                >
                                    {unit}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="p-3 text-center text-gray-500">
                            {units.length === 0 ? "Aucune unité disponible" : "Aucun résultat"}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};