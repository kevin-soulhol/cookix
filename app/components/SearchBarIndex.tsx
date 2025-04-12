/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-unescaped-entities */

import { MealAndCategoryTypeOption } from "./FilterPanel";

// Composant de la barre de recherche
type SearchBarProps = {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClear: () => void;
    onFilterClick: () => void;
    totalRecipes: number;
};

export default function SearchBar({ value, onChange, onClear, onFilterClick, totalRecipes }: SearchBarProps) {
    return (
        <div className="searchbar sticky top-[4rem] z-20 pb-1 pt-4">
            <div className="relative">
                <input
                    type="text"
                    name="search"
                    id="search"
                    placeholder="Rechercher une recette..."
                    value={value}
                    onChange={onChange}
                    className="block w-full pl-10 pr-16 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500 text-base"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    {value ? (
                        <button
                            type="button"
                            className="pr-3 flex items-center"
                            onClick={onClear}
                        >
                            <svg
                                className="h-5 w-5 text-gray-400 hover:text-gray-500"
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
                    ) : (
                        <svg
                            className="h-5 w-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    )}
                </div>

                {/* Badge de nombre de recettes */}
                <div className="recipe-number absolute inset-y-0 right-7 pr-3 flex items-center text-xs text-gray-500">
                    {totalRecipes} recettes
                </div>

                {/* Bouton pour afficher les filtres */}
                <button
                    type="button"
                    onClick={onFilterClick}
                    className="display-filter absolute inset-y-0 right-0 px-3 flex items-center"
                    aria-label="Filtrer les recettes"
                >
                    <svg
                        className="w-5 h-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
}

// Composant pour les badges de filtres actifs
type ActiveFiltersProps = {
    category: string;
    mealType: string;
    maxPreparationTime: number | null;
    categoryOptions: MealAndCategoryTypeOption[];
    onyVegeEnabled: boolean;
    onCategoryRemove: () => void;
    onMealTypeRemove: () => void;
    onPrepTimeRemove: () => void;
    onOnlyVegeRemove: () => void;
    onResetAll: () => void;
};

export function ActiveFilters({
    category,
    mealType,
    maxPreparationTime,
    categoryOptions,
    onyVegeEnabled,
    onCategoryRemove,
    onMealTypeRemove,
    onPrepTimeRemove,
    onOnlyVegeRemove,
    onResetAll
}: ActiveFiltersProps) {
    // Si aucun filtre actif, ne pas afficher ce composant
    if (!category && !mealType && !maxPreparationTime && !onyVegeEnabled) return null;

    return (
        <div className="flex flex-wrap gap-2 mt-2 mb-2">
            {category && (
                <span className="category-tag inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {categoryOptions.find(c => c.id.toString() === category)?.title || 'Catégorie'}
                    <button
                        type="button"
                        onClick={onCategoryRemove}
                        className="ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-indigo-400 hover:bg-indigo-200 hover:text-indigo-600"
                    >
                        <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" stroke="currentColor">
                            <path d="M8 4l-4 4M4 4l4 4" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                </span>
            )}

            {mealType && (
                <span className="meal-tag inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {mealType}
                    <button
                        type="button"
                        onClick={onMealTypeRemove}
                        className="ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-green-400 hover:bg-green-200 hover:text-green-600"
                    >
                        <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" stroke="currentColor">
                            <path d="M8 4l-4 4M4 4l4 4" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                </span>
            )}

            {maxPreparationTime && (
                <span className="preparationtime-tag inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    Max {maxPreparationTime} min
                    <button
                        type="button"
                        onClick={onPrepTimeRemove}
                        className="ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-amber-400 hover:bg-amber-200 hover:text-amber-600"
                    >
                        <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" stroke="currentColor">
                            <path d="M8 4l-4 4M4 4l4 4" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                </span>
            )}

            {onyVegeEnabled && (
                <span className="onlyvege-tag inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Végé uniquement
                    <button
                        type="button"
                        onClick={onOnlyVegeRemove}
                        className="ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-green-400 hover:bg-green-200 hover:text-amber-600"
                    >
                        <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" stroke="currentColor">
                            <path d="M8 4l-4 4M4 4l4 4" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                </span>
            )}

            <button
                type="button"
                onClick={onResetAll}
                className="text-xs text-gray-500 hover:text-gray-700 underline"
            >
                Tout effacer
            </button>
        </div>
    );
}

// Composant pour l'état vide (aucune recette trouvée)
export function EmptyState({ onReset }: { onReset: () => void }) {
    return (
        <div className="container-result-empty text-center py-12 bg-white rounded-lg shadow-md">
            <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Aucune recette trouvée</h3>
            <p className="mt-1 text-sm text-gray-500">
                Essayez de modifier vos filtres pour voir plus de résultats.
            </p>
            <div className="mt-6">
                <button
                    onClick={onReset}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                >
                    Réinitialiser les filtres
                </button>
            </div>
        </div>
    );
}

// Composant pour l'indicateur de chargement infini
export function LoadingIndicator() {
    return (
        <div className="loader flex flex-col items-center">
            <svg
                className="animate-spin h-8 w-8 text-rose-500 mb-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                />
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
            </svg>
            <span className="text-sm text-gray-500">Chargement d'autres recettes...</span>
        </div>
    );
}