import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { Form, useLoaderData, useSubmit, useNavigation, useSearchParams, useFetcher } from "@remix-run/react";
import { useEffect, useState, useRef, useCallback } from "react";
import BoxRecipe, { RecipeType } from "~/components/BoxRecipe";
import Layout from "~/components/Layout";

// Type pour nos filtres
type SortOption = 'title' | 'preparationTime' | 'note';
type SortDirection = 'asc' | 'desc';

// Hook pour le debounce (recherche)
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
  const sortBy = url.searchParams.get("sortBy") || "note";
  const sortDirection = url.searchParams.get("sortDirection") || "desc";
  const randomParam = url.searchParams.get("random") || "false"; // Par défaut à "true"
  const random = randomParam === "false";
  // Paramètres pour le scroll infini
  const page = parseInt(url.searchParams.get("page") || "1");
  const perPage = 12; // Nombre réduit pour un chargement mobile optimal
  const offset = (page - 1) * perPage;

  // Construire l'URL de l'API recipes avec tous les paramètres
  const apiUrl = new URL(`${request.url.split('/').slice(0, 3).join('/')}/api/recipes`);

  // Ajouter les paramètres de filtrage à l'URL de l'API
  if (searchQuery) apiUrl.searchParams.append("search", searchQuery);
  if (categoryId) apiUrl.searchParams.append("categoryId", categoryId);
  if (mealType) apiUrl.searchParams.append("mealType", mealType);
  if (maxPreparationTime) apiUrl.searchParams.append("maxPreparationTime", maxPreparationTime.toString());
  if (random) apiUrl.searchParams.append("random", "false");

  // Ajouter les paramètres de tri
  apiUrl.searchParams.append("sort", sortBy);
  apiUrl.searchParams.append("dir", sortDirection);

  // Ajouter les paramètres de pagination adaptés au scroll infini
  apiUrl.searchParams.append("limit", perPage.toString());
  apiUrl.searchParams.append("offset", offset.toString());

  // Envoyer la requête à l'API
  const cookies = request.headers.get("Cookie");
  try {
    const response = await fetch(apiUrl.toString(), {
      method: "GET",
      headers: {
        Cookie: cookies || "",
      },
    });

    const apiResponse = await response.json();

    if (!apiResponse.success) {
      throw new Error(apiResponse.message || "Erreur lors du chargement des recettes");
    }

    // Récupérer les catégories
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

    // Récupérer les types de repas
    const apiUrlForMealTypes = new URL(`${request.url.split('/').slice(0, 3).join('/')}/api/mealtypes`);
    const mealTypesResponse = await fetch(apiUrlForMealTypes.toString(), {
      headers: {
        Cookie: cookies || "",
      },
    });

    let mealTypeOptions = [];
    if (mealTypesResponse.ok) {
      const mealTypesData = await mealTypesResponse.json();
      mealTypeOptions = mealTypesData.mealTypes || [];
    }

    const totalRecipes = apiResponse.pagination.total;

    return json({
      recipes: apiResponse.recipes,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalRecipes / perPage),
        totalRecipes: totalRecipes,
        hasMore: page < Math.ceil(totalRecipes / perPage) // Vérifie s'il reste des recettes à charger
      },
      filters: {
        categoryOptions,
        mealTypeOptions,
        preparationTimeMax: 120
      },
      appliedFilters: {
        search: searchQuery,
        maxPreparationTime: maxPreparationTime ? parseInt(maxPreparationTime) : null,
        categoryId: categoryId ? parseInt(categoryId) : null,
        mealType,
        sortBy,
        sortDirection,
        random
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
        totalRecipes: 0,
        hasMore: false
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

export default function RecipesIndex() {
  const {
    recipes: initialRecipes,
    pagination,
    filters,
    appliedFilters,
    error
  } = useLoaderData<typeof loader>();

  const navigation = useNavigation();
  const [searchParams, setSearchParams] = useSearchParams();
  const submit = useSubmit();

  const moreFetcher = useFetcher();

  // États pour gérer le scroll infini
  const [recipes, setRecipes] = useState<RecipeType[]>(initialRecipes);
  const [currentPage, setCurrentPage] = useState(pagination.currentPage);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreRecipes, setHasMoreRecipes] = useState(pagination.hasMore);

  // États pour les filtres
  const [search, setSearch] = useState(appliedFilters.search);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [maxPreparationTime, setMaxPreparationTime] = useState<number | null>(appliedFilters.maxPreparationTime);
  const [category, setCategory] = useState(appliedFilters.categoryId?.toString() || "");
  const [mealType, setMealType] = useState(appliedFilters.mealType);
  const [sortBy, setSortBy] = useState<SortOption>(appliedFilters.sortBy as SortOption);
  const [sortDirection, setSortDirection] = useState<SortDirection>(appliedFilters.sortDirection as SortDirection);
  const [randomEnabled, setRandomEnabled] = useState(appliedFilters.random !== false);

  // Debounce la recherche
  const debouncedSearch = useDebounce(search, 400);

  // Référence pour le formulaire
  const formRef = useRef<HTMLFormElement>(null);

  // Effet pour charger plus de recettes lors du scroll
  const loadMoreRecipes = useCallback(() => {
    // Éviter de charger plus si on est déjà en train de charger ou s'il n'y a plus rien à charger
    if (!hasMoreRecipes ||
      moreFetcher.state !== "idle" ||
      isLoadingMore ||
      navigation.state !== "idle") {
      return;
    }

    setIsLoadingMore(true);
    const nextPage = currentPage + 1;

    // Construire la recherche pour la page suivante
    const params = new URLSearchParams(searchParams);
    params.set("page", nextPage.toString());

    // Utiliser le fetcher de Remix
    moreFetcher.load(`/?index&${params.toString()}`);

  }, [currentPage, hasMoreRecipes, moreFetcher, isLoadingMore, searchParams, navigation.state]);

  useEffect(() => {
    if (moreFetcher.state === "idle" && isLoadingMore) {

      if (moreFetcher.data) {
        // Mettre à jour l'état hasMoreRecipes avec la nouvelle valeur du serveur
        if (moreFetcher.data.pagination && moreFetcher.data.pagination.hasMore !== undefined) {
          setHasMoreRecipes(moreFetcher.data.pagination.hasMore);
        }

        if (moreFetcher.data.recipes && moreFetcher.data.recipes.length > 0) {
          setRecipes(prev => [...prev, ...moreFetcher.data.recipes]);
          setCurrentPage(prev => prev + 1);
        } else {
          // Si aucune recette n'est reçue, définir hasMoreRecipes à false
          setHasMoreRecipes(false);
        }
      }

      setIsLoadingMore(false);
    }
  }, [moreFetcher.state, moreFetcher.data, isLoadingMore]);

  // Ref pour l'intersection observer (détecter quand on atteint le bas de la page)
  // Définir un observateur d'intersection simplifié
  const observer = useRef<IntersectionObserver | null>(null);
  const bottomElementRef = useRef<HTMLDivElement | null>(null);

  // Configurer l'observateur
  useEffect(() => {
    if (observer.current) {
      observer.current.disconnect();
    }

    const loadMore = () => {
      if (!isLoadingMore && pagination.hasMore) {
        loadMoreRecipes();
      }
    };

    // Dans l'observateur
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMoreRecipes) {
        loadMore();
      }
    }, {
      rootMargin: '100px',
      threshold: 0.1
    });

    const currentElement = bottomElementRef.current;
    if (currentElement && pagination.hasMore) {
      observer.current.observe(currentElement);
    }

    return () => {
      if (observer.current && currentElement) {
        observer.current.unobserve(currentElement);
        observer.current.disconnect();
      }
    };
  }, [loadMoreRecipes, isLoadingMore, hasMoreRecipes]);


  // Effet pour soumettre le formulaire lorsque la recherche debouncée change
  useEffect(() => {
    if (debouncedSearch !== appliedFilters.search && formRef.current) {
      // Construire une nouvelle URL avec les paramètres de recherche
      const params = new URLSearchParams();

      // Ajouter les paramètres non vides
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (category) params.set("categoryId", category);
      if (mealType) params.set("mealType", mealType);
      if (maxPreparationTime) params.set("maxPreparationTime", maxPreparationTime.toString());
      params.set("sortBy", sortBy);
      params.set("sortDirection", sortDirection);
      params.set("page", "1"); // Retour à la première page lors d'une recherche

      // Mettre à jour les params de l'URL
      setSearchParams(params);

      // Réinitialiser l'état local
      setCurrentPage(1);
      setRecipes([]); // Vider pour éviter les doublons
    }
  }, [debouncedSearch, appliedFilters.search, setSearchParams, category, mealType, maxPreparationTime, sortBy, sortDirection]);

  // Effets pour la mise à jour des états lors des changements de filtres
  useEffect(() => {
    if (navigation.state === "idle") {
      // Mise à jour des recettes lorsque les données sont rechargées
      if (pagination.currentPage === 1) {
        setRecipes(initialRecipes);
      }
    }
  }, [initialRecipes, navigation.state, pagination.currentPage]);

  // Gestion des changements de recherche
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  //Gestion des filtres de la recherche
  const updateFilter = useCallback((key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams);

    // Mettre à jour ou supprimer le paramètre selon la valeur
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    // Réinitialiser la page à 1 lors d'un changement de filtre
    params.set("page", "1");

    // Mettre à jour l'URL
    setSearchParams(params);
  }, [searchParams, setSearchParams]);

  // Réinitialiser les filtres
  const resetFilters = useCallback(() => {
    setSearch("");
    setMaxPreparationTime(null);
    setCategory("");
    setMealType("");
    setSortBy("title");
    setSortDirection("asc");
    setRandomEnabled(false);

    // Soumettre le formulaire avec des valeurs vides
    setSearchParams({
      sortBy: "title",
      sortDirection: "asc",
      random: "true",
      page: "1"
    });
  }, [setSearchParams]);

  // État de chargement
  const isLoading = navigation.state === "loading" || navigation.state === "submitting";

  useEffect(() => {
    // Réinitialiser les recettes lors de changements de filtres
    if (navigation.state === "loading" && navigation.formData) {
      setRecipes([]); // Vider le tableau lorsqu'une nouvelle requête est en cours
      setCurrentPage(1);
    }

    // Mise à jour des recettes lorsque les données sont rechargées
    if (navigation.state === "idle" && initialRecipes) {
      if (pagination.currentPage === 1) {
        setRecipes(initialRecipes);
      }
    }
  }, [navigation.state, navigation.formData, initialRecipes, pagination.currentPage]);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">

        {/* Barre de recherche sticky en haut */}
        <div className="sticky top-[4rem] z-20 pb-3 pt-4 shadow-sm">
          <div className="relative">
            <input
              type="text"
              name="search"
              id="search"
              placeholder="Rechercher une recette..."
              value={search}
              onChange={handleSearchChange}
              className="block w-full pl-10 pr-16 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500 text-base"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              {search ? (
                <button
                  type="button"
                  className="pr-3 flex items-center"
                  onClick={() => setSearch("")}
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
            <div className="absolute inset-y-0 right-7 pr-3 flex items-center text-xs text-gray-500">
              {pagination.totalRecipes} recettes
            </div>

            {/* Bouton pour afficher les filtres */}
            <button
              type="button"
              onClick={() => setFiltersVisible(true)}
              className="absolute inset-y-0 right-0 px-3 flex items-center"
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

          {/* Badges de filtres actifs */}
          {(category || mealType || maxPreparationTime) && (
            <div className="flex flex-wrap gap-2 mt-2">
              {category && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {filters.categoryOptions.find(c => c.id.toString() === category)?.title || 'Catégorie'}
                  <button
                    type="button"
                    onClick={() => {
                      setCategory("");
                      updateFilter("categoryId", "");
                    }}
                    className="ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-indigo-400 hover:bg-indigo-200 hover:text-indigo-600"
                  >
                    <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" stroke="currentColor">
                      <path d="M8 4l-4 4M4 4l4 4" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                </span>
              )}

              {mealType && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {mealType}
                  <button
                    type="button"
                    onClick={() => {
                      setMealType("");
                      updateFilter("mealType", "");
                    }}
                    className="ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-green-400 hover:bg-green-200 hover:text-green-600"
                  >
                    <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" stroke="currentColor">
                      <path d="M8 4l-4 4M4 4l4 4" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                </span>
              )}

              {maxPreparationTime && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                  Max {maxPreparationTime} min
                  <button
                    type="button"
                    onClick={() => {
                      setMaxPreparationTime(null);
                      updateFilter("maxPreparationTime", null);
                    }}
                    className="ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-amber-400 hover:bg-amber-200 hover:text-amber-600"
                  >
                    <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" stroke="currentColor">
                      <path d="M8 4l-4 4M4 4l4 4" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                </span>
              )}

              <button
                type="button"
                onClick={resetFilters}
                className="text-xs text-gray-500 hover:text-gray-700 underline"
              >
                Tout effacer
              </button>
            </div>
          )}
        </div>

        {/* Affichage des recettes */}
        {error ? (
          <div className="my-8 bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-center">
            {error}
          </div>
        ) : (
          <>
            {/* Grille des recettes - optimisée pour mobile */}
            {recipes.length === 0 && !isLoading ? (
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
                  Essayez de modifier vos filtres pour voir plus de résultats.
                </p>
                <div className="mt-6">
                  <button
                    onClick={resetFilters}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {recipes.map((recipe, index) => (
                  <BoxRecipe key={`${recipe.id}-${index}`} recipe={recipe} />
                ))}
              </div>
            )}

            {/* Élément observé pour le scroll infini */}
            {hasMoreRecipes && recipes.length > 0 && (
              <div
                ref={bottomElementRef}
                className="h-20 w-full my-4 flex justify-center items-center"
                style={{ border: "1px solid red" }}
              >
                {isLoadingMore && (
                  <div className="flex flex-col items-center">
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
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span className="text-sm text-gray-500">Chargement d'autres recettes...</span>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Formulaire caché pour les filtres */}
        <Form ref={formRef} method="get" id="filter-form" className="hidden">
          <input type="hidden" name="search" value={search} />
          <input type="hidden" name="categoryId" value={category} />
          <input type="hidden" name="mealType" value={mealType} />
          {maxPreparationTime && (
            <input type="hidden" name="maxPreparationTime" value={maxPreparationTime} />
          )}
          <input type="hidden" name="sortBy" value={sortBy} />
          <input type="hidden" name="sortDirection" value={sortDirection} />
          <input type="hidden" name="random" value={randomEnabled.toString()} />
          <input type="hidden" name="page" value="1" />
        </Form>

        {/* Panneau de filtres mobile */}
        {filtersVisible && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 z-50 flex items-end"
            onClick={(e) => {
              setFiltersVisible(false)
            }} >
            <div onClick={(e) => e.stopPropagation()} className="bg-white w-full rounded-t-xl p-5 transform transition-transform duration-300 ease-in-out max-h-[90vh] overflow-auto">
              {/* En-tête du panneau de filtres */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Filtres</h3>
                <button
                  onClick={() => setFiltersVisible(false)}
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
                <div>
                  <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                    Catégorie
                  </label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      updateFilter("categoryId", e.target.value);
                    }}
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
                <div>
                  <label htmlFor="mealType" className="block text-sm font-medium text-gray-700 mb-1">
                    Type de repas
                  </label>
                  <select
                    id="mealType"
                    name="mealType"
                    value={mealType}
                    onChange={(e) => {
                      setMealType(e.target.value);
                      updateFilter("mealType", e.target.value);
                    }}
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
                <div>
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
                    onChange={(e) => {
                      const newMaxTime = parseInt(e.target.value);
                      setMaxPreparationTime(newMaxTime);
                      updateFilter("maxPreparationTime", newMaxTime.toString());
                      if (formRef.current) submit(formRef.current);
                    }}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0 min</span>
                    <span>{filters.preparationTimeMax} min</span>
                  </div>
                </div>

                {/* Option de tri aléatoire */}
                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="random" className="text-sm font-medium text-gray-700">
                      Affichage aléatoire
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setRandomEnabled(!randomEnabled);
                        if (formRef.current) {
                          setTimeout(() => submit(formRef.current), 0);
                        }
                      }}
                      className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none ${randomEnabled ? 'bg-rose-500' : 'bg-gray-200'
                        }`}
                      role="switch"
                      aria-checked={false}
                    >
                      <span className="sr-only">Activer l'affichage aléatoire</span>
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${randomEnabled ? 'translate-x-5' : 'translate-x-0'
                          }`}
                      ></span>
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Afficher les recettes dans un ordre aléatoire pour favoriser la découverte
                  </p>
                </div>

                {/* Tri */}
                <div>
                  <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
                    Trier par
                  </label>
                  <select
                    id="sort"
                    name="sort"
                    value={`${sortBy}-${sortDirection}`}
                    onChange={(e) => {
                      const [newSortBy, newSortDirection] = e.target.value.split("-") as [SortOption, SortDirection];
                      setSortBy(newSortBy);
                      setSortDirection(newSortDirection);
                      if (formRef.current) submit(formRef.current);
                    }}
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

                {/* Boutons d'action */}
                <div className="flex space-x-3 pt-3">
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Réinitialiser
                  </button>
                  <button
                    type="button"
                    onClick={() => setFiltersVisible(false)}
                    className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700"
                  >
                    Appliquer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}