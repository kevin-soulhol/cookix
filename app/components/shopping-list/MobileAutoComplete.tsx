/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useEffect, useRef } from "react";
import { IngredientSuggestion } from "~/types/shopping-list.types";

interface MobileAutoCompleteProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    suggestions: Array<IngredientSuggestion>;
    onSelectSuggestion: (suggestion: { id: number | null; name: string }) => void;
    setShowSuggestions: React.Dispatch<React.SetStateAction<boolean>>;
    placeholder?: string;
    classes?: string;
}

// Composant d'autocomplétion optimisé pour mobile avec création d'éléments
export const MobileAutoComplete = ({
    value,
    onChange,
    suggestions,
    setShowSuggestions,
    onSelectSuggestion,
    placeholder,
    classes
}: MobileAutoCompleteProps) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && event.target instanceof Node && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [setShowSuggestions]);

    // Fonction pour créer un nouvel élément avec la valeur actuelle
    const createNewItem = () => {
        if (value.trim()) {
            onSelectSuggestion({ id: null, name: value.trim() });
            setShowSuggestions(false);
        }
    };

    return (
        <div className={'relative ' + classes} ref={wrapperRef}>
            <div className="flex items-center border border-gray-300 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500">
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={onChange}
                    className="block w-full px-3 py-2 border-0 focus:outline-none bg-transparent"
                    placeholder={placeholder}
                    autoComplete="off"
                />
                {value.trim() && (
                    <button
                        type="button"
                        onClick={createNewItem}
                        className="p-2 text-teal-500 hover:text-teal-700 focus:outline-none"
                        aria-label="Valider cette entrée"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </button>
                )}
            </div>

            {suggestions.length > 0 && (
                <div className="absolute left-0 right-0 bg-white shadow-lg rounded-md mt-1 overflow-auto max-h-44 z-20">
                    {/* Option pour créer un nouvel élément si la valeur ne correspond à aucune suggestion */}
                    {value.trim() && !suggestions.some(s => s.name.toLowerCase() === value.toLowerCase()) && (
                        <div
                            className="create-item p-3 border-b border-gray-100 bg-teal-50 hover:bg-teal-100 active:bg-teal-200 cursor-pointer flex items-center"
                            onClick={createNewItem}
                        >
                            <span className="font-medium flex-1">{`Ajouter "${value}"`}</span>
                            <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </div>
                    )}

                    {/* Suggestions existantes */}
                    {suggestions.map((suggestion) => (
                        <div
                            key={suggestion.id}
                            className="p-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 active:bg-gray-100 cursor-pointer"
                            onClick={() => {
                                onSelectSuggestion(suggestion);
                                setShowSuggestions(false);
                            }}
                        >
                            <div className="font-medium">{suggestion.name}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};