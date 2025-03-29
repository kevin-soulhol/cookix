import { useEffect, useRef, useState } from "react";
import { Link, useFetcher } from "@remix-run/react";

type RecipeModalProps = {
    recipeId: number;
    basicRecipe: any; // Données basiques de la recette
    isOpen: boolean;
    onClose: () => void;
    isAuthenticated?: boolean;
};

export default function RecipeModal({ recipeId, basicRecipe, isOpen, onClose, isAuthenticated = false }: RecipeModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const [selectedTab, setSelectedTab] = useState<'ingredients' | 'instructions' | 'description'>('ingredients');

    // Fetchers pour les différentes actions
    const recipeDetailsFetcher = useFetcher();
    const favoriteFetcher = useFetcher();
    const menuFetcher = useFetcher();

    // États dérivés
    const recipe = recipeDetailsFetcher.data?.recipe || basicRecipe;
    const isLoading = recipeDetailsFetcher.state === "loading";
    const inFavorites = recipe?.isFavorite || false;
    const isAdded = recipe?.isInMenu || false;

    // Charger les détails complets de la recette quand le modal s'ouvre
    useEffect(() => {
        if (isOpen && recipeId) {
            recipeDetailsFetcher.load(`/api/recipes?id=${recipeId}`);
        }
    }, [isOpen, recipeId]);

    // Gestion des touches du clavier (Échap pour fermer)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
            document.addEventListener("mousedown", handleClickOutside);
            // Empêcher le défilement de la page en arrière-plan
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("mousedown", handleClickOutside);
            document.body.style.overflow = "auto";
        };
    }, [isOpen, onClose]);

    // Gestion de l'ajout au menu
    const handleAddToMenu = () => {
        menuFetcher.submit(
            { recipeId: recipeId.toString() },
            { method: "post", action: "/api/menu" }
        );
    };

    // Gestion du basculement des favoris
    const handleToggleFavorite = () => {
        favoriteFetcher.submit(
            { recipeId: recipeId.toString(), action: inFavorites ? "remove" : "add" },
            { method: "post", action: "/api/favorites" }
        );
    };

    if (!isOpen || !recipe) return null;

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 z-50 flex items-center justify-center">
            <div
                className="bg-white w-full h-full md:h-screen max-h-screen rounded-none shadow-xl overflow-hidden flex flex-col"
                ref={modalRef}
            >
                {/* En-tête avec image et titre */}
                <div className="relative">
                    {recipe.imageUrl ? (
                        <div
                            className="h-48 sm:h-64 w-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${recipe.imageUrl})` }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black opacity-60"></div>
                        </div>
                    ) : (
                        <div className="h-48 sm:h-64 w-full bg-gray-200 flex items-center justify-center">
                            <svg
                                className="w-16 h-16 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                    )}

                    {/* Titre en superposition sur l'image */}
                    <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                        <h1 className="text-2xl font-bold mb-2 text-shadow">{recipe.title}</h1>
                    </div>

                    {/* Bouton de fermeture */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 bg-white bg-opacity-80 p-2 rounded-full shadow-md hover:bg-opacity-100 transition-all"
                        aria-label="Fermer"
                    >
                        <svg
                            className="w-5 h-5 text-gray-800"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>

                    {/* Bouton Favori */}
                    {isAuthenticated && (
                        <button
                            onClick={handleToggleFavorite}
                            disabled={favoriteFetcher.state !== "idle"}
                            className="absolute top-4 left-4 bg-white bg-opacity-80 p-2 rounded-full shadow-md hover:bg-opacity-100 transition-all"
                            aria-label={inFavorites ? "Retirer des favoris" : "Ajouter aux favoris"}
                        >
                            {favoriteFetcher.state !== "idle" ? (
                                <svg className="w-5 h-5 animate-spin text-rose-500" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <svg
                                    className={`w-5 h-5 ${inFavorites ? 'text-rose-500 fill-current' : 'text-gray-500'}`}
                                    fill={inFavorites ? "currentColor" : "none"}
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    />
                                </svg>
                            )}
                        </button>
                    )}

                    {/* Bouton Ajouter au menu - Petit et discret */}
                    {isAuthenticated && (
                        <button
                            onClick={handleAddToMenu}
                            disabled={menuFetcher.state !== "idle" || isAdded}
                            className={`absolute top-4 left-16 bg-white bg-opacity-80 p-2 rounded-full shadow-md hover:bg-opacity-100 transition-all ${isAdded ? 'border border-green-400 text-green-600' : 'text-gray-700'
                                }`}
                            aria-label={isAdded ? "Déjà dans le menu" : "Ajouter au menu"}
                        >
                            {menuFetcher.state !== "idle" ? (
                                <svg className="w-5 h-5 animate-spin text-rose-500" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : isAdded ? (
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 14l2 2 4-4"></path>
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                            )}
                        </button>
                    )}
                </div>

                {/* Metadata - version compacte */}
                <div className="border-b border-gray-200 px-2 py-2">
                    <div className="flex flex-wrap justify-around text-xs">
                        {recipe.preparationTime && (
                            <div className="px-2 py-1 flex items-center">
                                <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span>
                                    <span className="font-medium">{recipe.preparationTime} min</span>
                                </span>
                            </div>
                        )}

                        {recipe.cookingTime && (
                            <div className="px-2 py-1 flex items-center">
                                <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"></path>
                                </svg>
                                <span>
                                    <span className="font-medium">{recipe.cookingTime}</span>
                                </span>
                            </div>
                        )}

                        {recipe.difficulty && (
                            <div className="px-2 py-1 flex items-center">
                                <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                </svg>
                                <span>
                                    <span className="font-medium">{recipe.difficulty}</span>
                                </span>
                            </div>
                        )}

                        {recipe.servings && (
                            <div className="px-2 py-1 flex items-center">
                                <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                </svg>
                                <span>
                                    <span className="font-medium">{recipe.servings}</span>
                                    <span className="text-gray-500 ml-1">portion{recipe.servings > 1 ? 's' : ''}</span>
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Tabs pour les différentes sections */}
                <div className="flex-1 overflow-hidden flex flex-col">
                    <div className="border-b border-gray-200">
                        <nav className="flex justify-between items-center">
                            <div className="flex">
                                <button
                                    onClick={() => setSelectedTab('ingredients')}
                                    className={`py-4 px-4 font-medium text-sm focus:outline-none ${selectedTab === 'ingredients'
                                        ? 'border-b-2 border-rose-500 text-rose-500'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    Ingrédients
                                </button>
                                <button
                                    onClick={() => setSelectedTab('instructions')}
                                    className={`py-4 px-4 font-medium text-sm focus:outline-none ${selectedTab === 'instructions'
                                        ? 'border-b-2 border-rose-500 text-rose-500'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    Instructions
                                </button>
                                <button
                                    onClick={() => setSelectedTab('description')}
                                    className={`py-4 px-4 font-medium text-sm focus:outline-none ${selectedTab === 'description'
                                        ? 'border-b-2 border-rose-500 text-rose-500'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    Description
                                </button>
                            </div>
                        </nav>
                    </div>

                    {/* Contenu des onglets */}
                    <div className="p-6 flex-1 overflow-y-auto">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-40">
                                <svg className="animate-spin h-10 w-10 text-rose-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </div>
                        ) : (
                            <>
                                {selectedTab === 'ingredients' && (
                                    <div>
                                        <h2 className="text-xl font-semibold mb-4">Ingrédients</h2>
                                        {recipe.ingredients && recipe.ingredients.length > 0 ? (
                                            <ul className="space-y-2">
                                                {recipe.ingredients.map((item, index) => (
                                                    <li key={index} className="flex items-center p-2 border-b border-gray-100 last:border-0">
                                                        <svg
                                                            className="w-5 h-5 text-rose-500 mr-3 flex-shrink-0"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M5 13l4 4L19 7"
                                                            />
                                                        </svg>
                                                        <span>
                                                            {item.quantity && <span className="font-medium">{item.quantity} </span>}
                                                            {item.unit && <span>{item.unit} de </span>}
                                                            {item.ingredient.name}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-gray-500 italic">Aucun ingrédient n'est spécifié pour cette recette.</p>
                                        )}
                                    </div>
                                )}

                                {selectedTab === 'instructions' && (
                                    <div>
                                        <h2 className="text-xl font-semibold mb-4">Instructions</h2>
                                        {recipe.steps && recipe.steps.length > 0 ? (
                                            <ol className="space-y-6">
                                                {recipe.steps.map((step) => (
                                                    <li key={step.id} className="flex">
                                                        <span className="flex-shrink-0 w-8 h-8 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center font-bold mr-4">
                                                            {step.stepNumber}
                                                        </span>
                                                        <div className="pt-1">
                                                            <p className="text-gray-700">{step.instruction}</p>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ol>
                                        ) : (
                                            <p className="text-gray-500 italic">Aucune instruction n'est spécifiée pour cette recette.</p>
                                        )}
                                    </div>
                                )}

                                {selectedTab === 'description' && (
                                    <div>
                                        <h2 className="text-xl font-semibold mb-4">Description</h2>
                                        {recipe.description ? (
                                            <p className="text-m mb-3">{recipe.description}</p>
                                        ) : (
                                            <p className="text-gray-500 italic">Aucune description n'est spécifiée pour cette recette.</p>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}