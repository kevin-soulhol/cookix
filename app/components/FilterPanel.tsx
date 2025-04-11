/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-unescaped-entities */

// Types pour les filtres
export type SortOption = 'title' | 'preparationTime' | 'note';
export type SortDirection = 'asc' | 'desc';

export type MealAndCategoryTypeOption = {
    id: number;
    title: string;
    sourceUrl: string;
}

export type FilterPanelType = {
    categoryOptions: MealAndCategoryTypeOption[];
    mealTypeOptions: MealAndCategoryTypeOption[];
    preparationTimeMax: number;
    onlyVege: boolean;

}

// Composant pour le panneau de filtres
type FilterPanelProps = {
    isVisible: boolean;
    onClose: () => void;
    filters: FilterPanelType;
    filterValues: {
        category: string;
        mealType: string;
        maxPreparationTime: number | null;
        sortBy: SortOption;
        sortDirection: SortDirection;
        randomEnabled: boolean;
        onlyVege: boolean;
    };
    onUpdateFilter: (key: string, value: string | null) => void;
    onReset: () => void;
    formRef: React.RefObject<HTMLFormElement>;
    onSubmit: (form: HTMLFormElement) => void;
    setCategory: (value: string) => void;
    setMealType: (value: string) => void;
    setMaxPreparationTime: (value: number | null) => void;
    setSortBy: (value: SortOption) => void;
    setSortDirection: (value: SortDirection) => void;
    setRandomEnabled: (value: boolean) => void;
    setOnlyVege: (value: boolean) => void;
};

export default function FilterPanel({
    isVisible,
    onClose,
    filters,
    filterValues,
    onUpdateFilter,
    onReset,
    formRef,
    onSubmit,
    setCategory,
    setMealType,
    setMaxPreparationTime,
    setRandomEnabled,
    setOnlyVege
}: FilterPanelProps) {
    if (!isVisible) return null;

    const { category, mealType, maxPreparationTime, randomEnabled, onlyVege } = filterValues;

    return (
        <div className="filter-panel fixed inset-0 bg-gray-500 bg-opacity-75 z-50 flex items-end"
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-full rounded-t-xl p-5 transform transition-transform max-h-[90vh] overflow-auto"
            >
                {/* En-tête du panneau de filtres */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Filtres</h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Contenu des filtres */}
                <div className="space-y-5">
                    {/* Filtre de catégories */}
                    <CategoryFilter
                        value={category}
                        options={filters.categoryOptions}
                        onChange={(value) => {
                            setCategory(value);
                            onUpdateFilter("categoryId", value);
                        }}
                    />

                    {/* Filtre de type de repas */}
                    <MealTypeFilter
                        value={mealType}
                        options={filters.mealTypeOptions}
                        onChange={(value) => {
                            setMealType(value);
                            onUpdateFilter("mealType", value);
                        }}
                    />

                    {/* Temps de préparation */}
                    <PreparationTimeFilter
                        value={maxPreparationTime}
                        max={filters.preparationTimeMax}
                        onChange={(value) => {
                            setMaxPreparationTime(value);
                            onUpdateFilter("maxPreparationTime", value?.toString() || null);
                            if (formRef.current) onSubmit(formRef.current);
                        }}
                    />

                    {/* Option de tri aléatoire */}
                    <Toggle
                        label="Affichage aléatoire"
                        text="Activer l'affichage aléatoire"
                        enabled={randomEnabled}
                        onChange={() => {
                            setRandomEnabled(!randomEnabled);
                            const form = formRef.current;
                            if (form !== null && form) {
                                setTimeout(() => onSubmit(form), 0);
                            }
                        }}
                    />

                    {/* Option de végétarien */}
                    <Toggle
                        label="Seulement les plats végé"
                        text="Activer l'affichage des plats végétariens uniquement"
                        enabled={onlyVege}
                        classes="isVegeOption"
                        onChange={() => {
                            setOnlyVege(!onlyVege);
                            const form = formRef.current;
                            if (form !== null && form) {
                                setTimeout(() => onSubmit(form), 0);
                            }
                        }}
                    />

                    {/* Tri */}
                    {/* <SortingOptions
                        value={`${sortBy}-${sortDirection}`}
                        onChange={(value) => {
                            const [newSortBy, newSortDirection] = value.split("-") as [SortOption, SortDirection];
                            setSortBy(newSortBy);
                            setSortDirection(newSortDirection);
                            if (formRef.current) onSubmit(formRef.current);
                        }}
                    /> */}

                    {/* Boutons d'action */}
                    <div className="flex space-x-3 pt-3">
                        <button
                            type="button"
                            onClick={onReset}
                            className="cancel-panel flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Réinitialiser
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="valid-panel flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700"
                        >
                            Appliquer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Filtre de catégories
function CategoryFilter({
    value,
    options,
    onChange
}: {
    value: string,
    options: MealAndCategoryTypeOption[],
    onChange: (value: string) => void
}) {
    return (
        <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie
            </label>
            <select
                id="categoryId"
                name="categoryId"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
            >
                <option value="">Toutes les catégories</option>
                {options.map((option) => (
                    <option key={option.id} value={option.id.toString()}>
                        {option.title}
                    </option>
                ))}
            </select>
        </div>
    );
}

// Filtre de type de repas
function MealTypeFilter({
    value,
    options,
    onChange
}: {
    value: string,
    options: MealAndCategoryTypeOption[],
    onChange: (value: string) => void
}) {
    return (
        <div>
            <label htmlFor="mealType" className="block text-sm font-medium text-gray-700 mb-1">
                Type de repas
            </label>
            <select
                id="mealType"
                name="mealType"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
            >
                <option value="">Tous les types</option>
                {options.map((option) => (
                    <option key={option.title} value={option.title}>
                        {option.title}
                    </option>
                ))}
            </select>
        </div>
    );
}

// Filtre de temps de préparation
function PreparationTimeFilter({
    value,
    max,
    onChange
}: {
    value: number | null,
    max: number,
    onChange: (value: number | null) => void
}) {
    return (
        <div>
            <label htmlFor="maxPreparationTime" className="block text-sm font-medium text-gray-700 mb-1">
                Temps de préparation (max {value || max} min)
            </label>
            <input
                type="range"
                id="maxPreparationTime"
                name="maxPreparationTime"
                min="0"
                max={max}
                step="10"
                value={value || max}
                onChange={(e) => onChange(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0 min</span>
                <span>{max} min</span>
            </div>
        </div>
    );
}

// Interrupteur pour le tri aléatoire
function Toggle({
    label,
    text,
    enabled,
    classes,
    onChange
}: {
    label: string,
    text: string,
    enabled: boolean,
    classes?: string,
    onChange: () => void
}) {
    return (
        <div>
            <div className="flex items-center justify-between">
                <label htmlFor="random" className="text-sm font-medium text-gray-700">
                    {label}
                </label>
                <button
                    type="button"
                    onClick={onChange}
                    className={`${classes} relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none ${enabled ? 'bg-rose-500' : 'bg-gray-200'
                        }`}
                    role="switch"
                    aria-checked={enabled}
                >
                    <span className="sr-only">{text}</span>
                    <span
                        aria-hidden="true"
                        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${enabled ? 'translate-x-5' : 'translate-x-0'
                            }`}
                    />
                </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
                {text}
            </p>
        </div>
    );
}

// Options de tri
function SortingOptions({
    value,
    onChange
}: {
    value: string,
    onChange: (value: string) => void
}) {
    return (
        <div>
            <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
                Trier par
            </label>
            <select
                id="sort"
                name="sort"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
            >
                <option value="title-asc">Titre (A-Z)</option>
                <option value="title-desc">Titre (Z-A)</option>
                <option value="preparationTime-asc">Temps de préparation (croissant)</option>
                <option value="preparationTime-desc">Temps de préparation (décroissant)</option>
                <option value="note-desc">Note (décroissant)</option>
                <option value="note-asc">Note (croissant)</option>
            </select>
        </div>
    );
}