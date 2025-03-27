import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { Form, Link, useLoaderData, useNavigate, useNavigation, useSubmit } from "@remix-run/react";
import { useEffect, useState, useRef, useCallback } from "react";
import BoxRecipe, { RecipeType } from "~/components/BoxRecipe";
import Layout from "~/components/Layout";

// Types pour nos filtres
type SortOption = 'title' | 'preparationTime' | 'note';
type SortDirection = 'asc' | 'desc';

export const meta: MetaFunction = () => {
  return [
    { title: "Toutes les recettes - Cookix" },
    { name: "description", content: "Découvrez et filtrez toutes nos recettes pour Monsieur Cuisine Smart" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  // Récupérer les paramètres de filtrage depuis l'URL
  const url = new URL(request.url);
  const categoryId = url.searchParams.get("categoryId") || "";
  const mealType = url.searchParams.get("mealType") || "";
  const searchQuery = url.searchParams.get("search") || "";
  const maxPreparationTime = url.searchParams.get("maxPreparationTime") || null;
  const sortBy = url.searchParams.get("sortBy") || "title";
  const sortDirection = url.searchParams.get("sortDirection") || "asc";
  const page = url.searchParams.get("page") || "1";
  const perPage = "300"; // nombre de recettes par page

  // Construire l'URL de l'API recipes avec tous les paramètres
  const apiUrl = new URL(`${request.url.split('/').slice(0, 3).join('/')}/api/recipes`);

  // Ajouter les paramètres de filtrage à l'URL de l'API
  if (searchQuery) apiUrl.searchParams.append("search", searchQuery);
  if (categoryId) apiUrl.searchParams.append("categoryId", categoryId);
  if (mealType) apiUrl.searchParams.append("mealType", mealType);
  if (maxPreparationTime) apiUrl.searchParams.append("maxPreparationTime", maxPreparationTime.toString());

  // Ajouter les paramètres de tri
  apiUrl.searchParams.append("sort", sortBy);
  apiUrl.searchParams.append("dir", sortDirection);

  // Ajouter les paramètres de pagination
  apiUrl.searchParams.append("limit", perPage);
  apiUrl.searchParams.append("offset", ((parseInt(page) - 1) * parseInt(perPage)).toString());
  apiUrl.searchParams.append("random", "true");

  // Envoyer la requête à l'API
  const cookies = request.headers.get("Cookie");
  try {
    const response = await fetch(apiUrl.toString(), {
      method: "GET",
      headers: {
        Cookie: cookies || "", // Transmettre les cookies pour l'authentification
      },
    });

    const apiResponse = await response.json();

    if (!apiResponse.success) {
      throw new Error(apiResponse.message || "Erreur lors du chargement des recettes");
    }

    //Récupérer les différentes catégories
    const apiUrlForCategories = new URL(`${request.url.split('/').slice(0, 3).join('/')}/api/categories`);
    const categoriesResponse = await fetch(apiUrlForCategories.toString(), {
      headers: {
        Cookie: cookies || "",
      },
    });

    let categoryOptions = [];
    if (categoriesResponse.ok) {
      const categoriesData = await categoriesResponse.json();
      categoryOptions = categoriesData.categories || [];
    }

    //Récupérer les différents types de repas
    const apiUrlForMealTypes = new URL(`${request.url.split('/').slice(0, 3).join('/')}/api/mealtypes`);
    const mealTypesResponse = await fetch(apiUrlForMealTypes.toString(), {
      headers: {
        Cookie: cookies || "",
      },
    });

    let mealTypeOptions = [];
    const mealTypesData = await mealTypesResponse.json();
    mealTypeOptions = mealTypesData.mealTypes || [];


    return json({
      recipes: apiResponse.recipes,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(apiResponse.pagination.total / parseInt(perPage)),
        totalRecipes: apiResponse.pagination.total
      },
      filters: {
        categoryOptions,
        mealTypeOptions,
        preparationTimeMax: 120 // valeur arbitraire, peut être ajustée
      },
      appliedFilters: {
        search: searchQuery,
        maxPreparationTime: maxPreparationTime ? parseInt(maxPreparationTime) : null,
        categoryId: categoryId ? parseInt(categoryId) : null,
        mealType,
        sortBy,
        sortDirection
      },
      error: false
    });

  } catch (error) {
    console.error("Erreur lors du chargement des recettes:", error);
    return json({
      recipes: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalRecipes: 0
      },
      filters: {
        categoryOptions: [],
        mealTypeOptions: [],
        preparationTimeMax: 120
      },
      appliedFilters: {
        search: searchQuery,
        mealType,
        categoryId: null,
        maxPreparationTime: maxPreparationTime ? parseInt(maxPreparationTime) : null,
        sortBy: "title",
        sortDirection: "asc"
      },
      error: error instanceof Error ? error.message : "Impossible de charger les recettes."
    });
  }
}

// Hook personnalisé pour le debounce
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}



export default function RecipesIndex() {
  const {
    recipes,
    pagination,
    filters,
    appliedFilters,
    error
  } = useLoaderData<typeof loader>();

  const navigation = useNavigation();
  const submit = useSubmit();

  const navigate = useNavigate();

  // State pour les filtres
  const [search, setSearch] = useState(appliedFilters.search);
  const [maxPreparationTime, setMaxPreparationTime] = useState<number | null>(appliedFilters.maxPreparationTime);
  const [category, setCategory] = useState(appliedFilters.categoryId?.toString() || "");
  const [mealType, setMealType] = useState(appliedFilters.mealType);
  const [sortBy, setSortBy] = useState<SortOption>(appliedFilters.sortBy as SortOption);
  const [sortDirection, setSortDirection] = useState<SortDirection>(appliedFilters.sortDirection as SortDirection);

  // État pour savoir si les filtres sont visibles sur mobile
  const [filtersVisible, setFiltersVisible] = useState(false);

  // Formulaire de référence
  const formRef = useRef<HTMLFormElement>(null);

  // Debounce la recherche
  const debouncedSearch = useDebounce(search, 600);

  // Effet pour soumettre le formulaire lorsque la recherche debouncée change
  useEffect(() => {
    // Ne faire l'action que si la valeur a réellement changé
    if (debouncedSearch !== appliedFilters.search && formRef.current) {
      // Créer un objet URLSearchParams pour construire la nouvelle URL
      const searchParams = new URLSearchParams();

      // Ajouter uniquement les paramètres non vides
      if (debouncedSearch) searchParams.set("search", debouncedSearch);
      if (category) searchParams.set("categoryId", category);
      if (mealType) searchParams.set("mealType", mealType);
      if (maxPreparationTime) searchParams.set("maxPreparationTime", maxPreparationTime.toString());
      searchParams.set("sortBy", sortBy);
      searchParams.set("sortDirection", sortDirection);
      searchParams.set("page", "1"); // Remettre à la première page lors d'une recherche

      // Construire l'URL avec les nouveaux paramètres de recherche
      const newUrl = `/recettes?${searchParams.toString()}`;

      // Utiliser la navigation de Remix pour changer l'URL sans recharger la page
      navigate(newUrl, { replace: true });
    }
  }, [debouncedSearch, appliedFilters.search, category, mealType, maxPreparationTime, sortBy, sortDirection]);

  // Effets pour gestion des filtres
  useEffect(() => {
    setSearch(appliedFilters.search);
    setMaxPreparationTime(appliedFilters.maxPreparationTime);
    setCategory(appliedFilters.categoryId?.toString() || "");
    setMealType(appliedFilters.mealType);
    setSortBy(appliedFilters.sortBy as SortOption);
    setSortDirection(appliedFilters.sortDirection as SortDirection);
  }, [appliedFilters]);

  // Gestion des changements de recherche
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    // La soumission est gérée par l'effet du debounce
  };

  // Mettre à jour le tri
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const [newSortBy, newSortDirection] = value.split("-") as [SortOption, SortDirection];
    setSortBy(newSortBy);
    setSortDirection(newSortDirection);

    if (formRef.current) {
      submit(formRef.current);
    }
  };

  // Réinitialiser les filtres
  const resetFilters = useCallback(() => {
    setSearch("");
    setMaxPreparationTime(null);
    setSortBy("title");
    setSortDirection("asc");
  }, []);

  // État de chargement
  const isLoading = navigation.state === "loading" || navigation.state === "submitting";

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistiques des recettes */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {pagination.totalRecipes} recettes à découvrir
          </h2>
          <p className="text-gray-600">
            Trouvez la recette parfaite pour votre Monsieur Cuisine Smart
          </p>
        </div>

        {/* Bouton Filtres Mobile */}
        <div className="md:hidden mb-4">
          <button
            type="button"
            onClick={() => setFiltersVisible(true)}
            className="w-full py-3 flex items-center justify-center bg-white rounded-lg shadow-md text-rose-500 font-medium"
          >
            <svg
              className="w-5 h-5 mr-2"
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
            Filtrer les recettes
          </button>
        </div>

        {/* Section principale avec filtres et recettes */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filtres */}
          <div
            className={`${filtersVisible ? 'fixed inset-0 z-50 bg-white md:bg-transparent md:relative md:inset-auto md:z-auto' : 'hidden'
              } md:block md:col-span-1 bg-white rounded-lg shadow-md p-6 self-start sticky top-24 overflow-auto max-h-screen md:max-h-[calc(100vh-120px)]`}
          >
            <Form ref={formRef} method="get" id="filter-form" onChange={e => submit(e.currentTarget)}>
              <h3 className="font-semibold text-lg mb-4 flex items-center justify-between">
                Filtres
                <button
                  type="button"
                  onClick={() => setFiltersVisible(false)}
                  className="md:hidden text-gray-400 hover:text-gray-500"
                >
                  <svg
                    className="w-5 h-5"
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
              </h3>

              {/* Recherche */}
              <div className="mb-6">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                  Rechercher
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="search"
                    id="search"
                    placeholder="Nom de recette..."
                    value={search}
                    onChange={handleSearchChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                  </div>
                </div>
              </div>

              {/* Filtre de categories */}
              <div className="mb-6">
                <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
                >
                  <option value="">Toutes les catégories</option>
                  {filters.categoryOptions?.map((option) => (
                    <option key={option.id} value={option.id.toString()}>
                      {option.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtre de type de repas */}
              <div className="mb-6">
                <label htmlFor="mealType" className="block text-sm font-medium text-gray-700 mb-1">
                  Type de repas
                </label>
                <select
                  id="mealType"
                  name="mealType"
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
                >
                  <option value="">Tous les types</option>
                  {filters.mealTypeOptions?.map((option) => (
                    <option key={option.title} value={option.title}>
                      {option.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Temps de préparation */}
              <div className="mb-6">
                <label htmlFor="maxPreparationTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Temps de préparation (max {maxPreparationTime || filters.preparationTimeMax} min)
                </label>
                <input
                  type="range"
                  id="maxPreparationTime"
                  name="maxPreparationTime"
                  min="0"
                  max={filters.preparationTimeMax}
                  step="10"
                  value={maxPreparationTime || filters.preparationTimeMax}
                  onChange={(e) => setMaxPreparationTime(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0 min</span>
                  <span>{filters.preparationTimeMax} min</span>
                </div>
              </div>

              {/* Tri */}
              <div className="mb-6">
                <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
                  Trier par
                </label>
                <select
                  id="sort"
                  name="sort"
                  value={`${sortBy}-${sortDirection}`}
                  onChange={handleSortChange}
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

              {/* Champs cachés pour la pagination et le tri */}
              <input type="hidden" name="page" value="1" />
              <input type="hidden" name="sortBy" value={sortBy} />
              <input type="hidden" name="sortDirection" value={sortDirection} />

              {/* Bouton réinitialiser */}
              <button
                type="submit"
                onClick={resetFilters}
                className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
              >
                Réinitialiser les filtres
              </button>
            </Form>
          </div>

          {/* Grille des recettes */}
          <div className="md:col-span-3">
            {error && (
              <div className="mb-8 bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-center">
                {error}
              </div>
            )}

            {/* Indicateur de chargement */}
            {isLoading && (
              <div className="flex justify-center my-8">
                <svg
                  className="animate-spin h-8 w-8 text-rose-500"
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
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            )}

            {!isLoading && recipes.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
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
                  Essayez d'ajuster vos filtres pour voir plus de résultats.
                </p>
                <div className="mt-6">
                  <Link
                    to="/recettes"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                  >
                    Voir toutes les recettes
                  </Link>
                </div>
              </div>
            ) : (
              <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 ${isLoading ? 'opacity-50' : ''}`}>
                {recipes.map((recipe: RecipeType, k: number) => (
                  <BoxRecipe recipe={recipe} key={k} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <nav className="flex justify-center mt-12">
                <ul className="flex space-x-2">
                  {/* Bouton page précédente */}
                  <li>
                    <Form method="get" className="inline-block">
                      {/* Conserver les filtres */}
                      <input type="hidden" name="search" value={search} />
                      <input type="hidden" name="mealType" value={mealType} />
                      {maxPreparationTime && <input type="hidden" name="maxPreparationTime" value={maxPreparationTime.toString()} />}
                      <input type="hidden" name="sortBy" value={sortBy} />
                      <input type="hidden" name="sortDirection" value={sortDirection} />
                      <input type="hidden" name="page" value={(pagination.currentPage - 1).toString()} />

                      <button
                        type="submit"
                        disabled={pagination.currentPage <= 1}
                        className={`px-4 py-2 rounded-md ${pagination.currentPage <= 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                          }`}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>
                    </Form>
                  </li>

                  {/* Pages centrales */}
                  {[...Array(pagination.totalPages)].map((_, i) => {
                    const pageNumber = i + 1;

                    // Logique pour n'afficher que certaines pages dans la pagination
                    const shouldDisplay =
                      pageNumber === 1 ||
                      pageNumber === pagination.totalPages ||
                      Math.abs(pageNumber - pagination.currentPage) <= 1;

                    // Afficher des ellipses pour les pages masquées
                    if (!shouldDisplay) {
                      if (pageNumber === 2 || pageNumber === pagination.totalPages - 1) {
                        return (
                          <li key={`ellipsis-${pageNumber}`} className="px-1 flex items-center">
                            <span className="text-gray-500">...</span>
                          </li>
                        );
                      }
                      return null;
                    }

                    return (
                      <li key={pageNumber}>
                        <Form method="get" className="inline-block">
                          {/* Conserver les filtres */}
                          <input type="hidden" name="search" value={search} />
                          <input type="hidden" name="mealType" value={mealType} />
                          {maxPreparationTime && <input type="hidden" name="maxPreparationTime" value={maxPreparationTime.toString()} />}
                          <input type="hidden" name="sortBy" value={sortBy} />
                          <input type="hidden" name="sortDirection" value={sortDirection} />
                          <input type="hidden" name="page" value={pageNumber.toString()} />

                          <button
                            type="submit"
                            className={`w-10 h-10 rounded-md flex items-center justify-center ${pagination.currentPage === pageNumber
                              ? 'bg-rose-500 text-white font-semibold'
                              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                              }`}
                          >
                            {pageNumber}
                          </button>
                        </Form>
                      </li>
                    );
                  })}

                  {/* Bouton page suivante */}
                  <li>
                    <Form method="get" className="inline-block">
                      {/* Conserver les filtres */}
                      <input type="hidden" name="search" value={search} />
                      <input type="hidden" name="mealType" value={mealType} />
                      {maxPreparationTime && <input type="hidden" name="maxPreparationTime" value={maxPreparationTime.toString()} />}
                      <input type="hidden" name="sortBy" value={sortBy} />
                      <input type="hidden" name="sortDirection" value={sortDirection} />
                      <input type="hidden" name="page" value={(pagination.currentPage + 1).toString()} />

                      <button
                        type="submit"
                        disabled={pagination.currentPage >= pagination.totalPages}
                        className={`px-4 py-2 rounded-md ${pagination.currentPage >= pagination.totalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                          }`}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </Form>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}