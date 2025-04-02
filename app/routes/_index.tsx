import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { Form, useLoaderData, useSubmit, useNavigation, useSearchParams, useFetcher } from "@remix-run/react";
import { useEffect, useState, useRef, useCallback } from "react";
import BoxRecipe, { RecipeType } from "~/components/BoxRecipe";
import FilterPanel, { FilterPanelType, MealAndCategoryTypeOption, SortDirection, SortOption } from "~/components/FilterPanel";
import Layout from "~/components/Layout";
import SearchBar, { ActiveFilters, EmptyState, LoadingIndicator } from "~/components/SearchBarIndex";

type LoaderReturnType = {
  recipes: RecipeType[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalRecipes: number;
    hasMore: boolean;
  };
  filters: {
    categoryOptions: MealAndCategoryTypeOption[];
    mealTypeOptions: MealAndCategoryTypeOption[];
    preparationTimeMax: number;
  };
  appliedFilters: {
    search: string;
    maxPreparationTime: number | null;
    categoryId: number | null;
    mealType: string;
    sortBy: string;
    sortDirection: string;
    randomEnabled: boolean;
  };
  error: boolean | string;
};

// Hook personnalisé pour le debounce (recherche)
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
  const randomEnabled = url.searchParams.get("random") !== "false";

  // Paramètres pour la pagination
  const page = parseInt(url.searchParams.get("page") || "1");
  const perPage = 12;
  const offset = (page - 1) * perPage;

  // Construire l'URL de l'API avec tous les paramètres
  const apiUrl = new URL(`${request.url.split('/').slice(0, 3).join('/')}/api/recipes`);

  // Ajouter les paramètres de filtrage à l'URL de l'API
  if (searchQuery) apiUrl.searchParams.append("search", searchQuery);
  if (categoryId) apiUrl.searchParams.append("categoryId", categoryId);
  if (mealType) apiUrl.searchParams.append("mealType", mealType);
  if (maxPreparationTime) apiUrl.searchParams.append("maxPreparationTime", maxPreparationTime);
  if (!randomEnabled) apiUrl.searchParams.append("random", "false");

  // Ajouter les paramètres de tri et pagination
  apiUrl.searchParams.append("sort", sortBy);
  apiUrl.searchParams.append("dir", sortDirection);
  apiUrl.searchParams.append("limit", perPage.toString());
  apiUrl.searchParams.append("offset", offset.toString());

  try {
    // Récupérer les données des recettes
    const cookies = request.headers.get("Cookie");
    const response = await fetch(apiUrl.toString(), {
      method: "GET",
      headers: { Cookie: cookies || "" },
    });

    const apiResponse = await response.json();
    if (!apiResponse.success) {
      throw new Error(apiResponse.message || "Erreur lors du chargement des recettes");
    }

    // Récupérer les options de filtrage (catégories et types de repas)
    const [categoryOptions, mealTypeOptions] = await Promise.all([
      fetchCategories(request),
      fetchMealTypes(request)
    ]);

    const totalRecipes = apiResponse.pagination.total;

    const filters: FilterPanelType = {
      categoryOptions,
      mealTypeOptions,
      preparationTimeMax: 120
    }

    return json({
      recipes: apiResponse.recipes,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalRecipes / perPage),
        totalRecipes,
        hasMore: page < Math.ceil(totalRecipes / perPage)
      },
      filters,
      appliedFilters: {
        search: searchQuery,
        maxPreparationTime: maxPreparationTime ? parseInt(maxPreparationTime) : null,
        categoryId: categoryId ? parseInt(categoryId) : null,
        mealType,
        sortBy,
        sortDirection,
        randomEnabled
      },
      error: false
    });
  } catch (error) {
    console.error("Erreur lors du chargement des recettes:", error);
    const filters: FilterPanelType = { categoryOptions: [], mealTypeOptions: [], preparationTimeMax: 120 }
    return json({
      recipes: [],
      pagination: { currentPage: 1, totalPages: 0, totalRecipes: 0, hasMore: false },
      filters,
      appliedFilters: {
        search: searchQuery,
        mealType,
        categoryId: null,
        maxPreparationTime: maxPreparationTime ? parseInt(maxPreparationTime) : null,
        sortBy: "note",
        sortDirection: "desc",
        randomEnabled: true
      },
      error: error instanceof Error ? error.message : "Impossible de charger les recettes."
    });
  }
}

// Fonctions utilitaires pour extraire la logique du loader
async function fetchCategories(request: Request) {
  const apiUrl = new URL(`${request.url.split('/').slice(0, 3).join('/')}/api/categories`);
  const cookies = request.headers.get("Cookie");

  try {
    const response = await fetch(apiUrl.toString(), {
      headers: { Cookie: cookies || "" }
    });

    if (response.ok) {
      const data = await response.json();
      return data.categories || [];
    }
    return [];
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories:", error);
    return [];
  }
}

async function fetchMealTypes(request: Request) {
  const apiUrl = new URL(`${request.url.split('/').slice(0, 3).join('/')}/api/mealtypes`);
  const cookies = request.headers.get("Cookie");

  try {
    const response = await fetch(apiUrl.toString(), {
      headers: { Cookie: cookies || "" }
    });

    if (response.ok) {
      const data = await response.json();
      return data.mealTypes || [];
    }
    return [];
  } catch (error) {
    console.error("Erreur lors de la récupération des types de repas:", error);
    return [];
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
  const moreFetcher = useFetcher<LoaderReturnType>();

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
  const [randomEnabled, setRandomEnabled] = useState(appliedFilters.randomEnabled);

  // Debounce la recherche
  const debouncedSearch = useDebounce(search, 400);

  // Références
  const formRef = useRef<HTMLFormElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const bottomElementRef = useRef<HTMLDivElement | null>(null);

  // État de chargement
  const isLoading = navigation.state === "loading" || navigation.state === "submitting";

  // Gestionnaires d'événements
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSearchClear = () => {
    setSearch("");
  };

  const updateFilter = useCallback((key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    params.set("page", "1");
    setSearchParams(params);
  }, [searchParams, setSearchParams]);

  const resetFilters = useCallback(() => {
    setSearch("");
    setMaxPreparationTime(null);
    setCategory("");
    setMealType("");
    setSortBy("note");
    setSortDirection("desc");
    setRandomEnabled(true);

    setSearchParams({
      sortBy: "note",
      sortDirection: "desc",
      random: "true",
      page: "1"
    });
  }, [setSearchParams]);

  useEffect(() => {
    // Réinitialiser l'état de pagination lorsque la recherche change
    if (debouncedSearch !== appliedFilters.search) {
      setHasMoreRecipes(pagination.hasMore);
    }
  }, [debouncedSearch, appliedFilters.search, pagination.hasMore]);

  useEffect(() => {
    if (navigation.state === 'idle') {
      setHasMoreRecipes(pagination.hasMore);
    }
  }, [navigation.state, pagination.hasMore]);

  // Fonction pour charger plus de recettes (scroll infini)
  const loadMoreRecipes = useCallback(() => {
    // Assouplir les conditions pour le débogage
    if (moreFetcher.state !== "idle") {
      return;
    }

    setIsLoadingMore(true);
    const nextPage = currentPage + 1;

    // Créer un objet URLSearchParams frais au lieu d'utiliser searchParams
    const params = new URLSearchParams();
    params.set("page", nextPage.toString());

    // Ajoutez explicitement tous les paramètres actuels
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (category) params.set("categoryId", category);
    if (mealType) params.set("mealType", mealType);
    if (maxPreparationTime) params.set("maxPreparationTime", maxPreparationTime.toString());
    params.set("sortBy", sortBy);
    params.set("sortDirection", sortDirection);
    params.set("random", randomEnabled ? "true" : "false");

    moreFetcher.load(`/?index&${params.toString()}`);
  }, [
    currentPage,
    moreFetcher,
    debouncedSearch,
    category,
    mealType,
    maxPreparationTime,
    sortBy,
    sortDirection,
    randomEnabled
  ]);

  // Effet pour la recherche
  useEffect(() => {
    if (debouncedSearch !== appliedFilters.search) {
      const params = new URLSearchParams();

      if (debouncedSearch) params.set("search", debouncedSearch);
      if (category) params.set("categoryId", category);
      if (mealType) params.set("mealType", mealType);
      if (maxPreparationTime) params.set("maxPreparationTime", maxPreparationTime.toString());
      params.set("sortBy", sortBy);
      params.set("sortDirection", sortDirection);
      params.set("random", randomEnabled ? "true" : "false");
      params.set("page", "1");

      // Réinitialiser explicitement les états
      setCurrentPage(1);
      setRecipes([]);

      setSearchParams(params);
    }
  }, [debouncedSearch, appliedFilters.search, category, mealType, maxPreparationTime, sortBy, sortDirection, randomEnabled, setSearchParams]);

  // Effet spécifique pour réinitialiser l'observer après une recherche
  useEffect(() => {
    // Attendre un moment pour que le DOM soit mis à jour
    const timeoutId = setTimeout(() => {
      if (observer.current) {
        observer.current.disconnect();
        observer.current = null;
      }

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMoreRecipes) {
          const nextPage = currentPage + 1;
          const params = new URLSearchParams();
          params.set("page", nextPage.toString());
          if (debouncedSearch) params.set("search", debouncedSearch);
          if (category) params.set("categoryId", category);
          if (mealType) params.set("mealType", mealType);
          if (maxPreparationTime) params.set("maxPreparationTime", maxPreparationTime.toString());
          params.set("sortBy", sortBy);
          params.set("sortDirection", sortDirection);
          params.set("random", randomEnabled ? "true" : "false");

          setIsLoadingMore(true);
          moreFetcher.load(`/?index&${params.toString()}`);
        }
      }, {
        rootMargin: '200px',
        threshold: 0.1
      });

      const currentElement = bottomElementRef.current;
      if (currentElement) {
        observer.current.observe(currentElement);
      }
    }, 300); // 300ms est généralement suffisant

    return () => {
      clearTimeout(timeoutId);
    };
  }, [debouncedSearch, currentPage, hasMoreRecipes, category, mealType, maxPreparationTime, sortBy, sortDirection, randomEnabled]);

  // Effet pour mettre à jour les recettes quand les données sont chargées
  useEffect(() => {
    if (navigation.state === "idle") {
      if (pagination.currentPage === 1) {
        setRecipes(initialRecipes);
      }
    }
  }, [initialRecipes, navigation.state, pagination.currentPage]);

  // Effet pour traiter les résultats du moreFetcher (scroll infini)
  useEffect(() => {
    if (moreFetcher.state === "idle" && isLoadingMore) {
      const data = moreFetcher.data;
      if (data) {
        if (data?.pagination && 'hasMore' in data.pagination) {
          setHasMoreRecipes(data.pagination.hasMore);
        }

        if (data !== undefined && data?.recipes && Array.isArray(data.recipes) && data.recipes.length > 0) {
          setRecipes(prev => [...prev, ...data.recipes]);
          setCurrentPage(prev => prev + 1);
        } else {
          setHasMoreRecipes(false);
        }
      }

      setIsLoadingMore(false);
    }
  }, [moreFetcher.state, moreFetcher.data, isLoadingMore]);

  // Configuration de l'intersection observer pour le scroll infini
  useEffect(() => {
    // Toujours déconnecter l'observer précédent
    if (observer.current) {
      observer.current.disconnect();
      observer.current = null;
    }

    // Créer un nouvel observer seulement si on a plus de recettes à charger
    if (hasMoreRecipes) {
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          loadMoreRecipes();
        }
      }, {
        rootMargin: '300px', // Augmenter la marge pour déclencher plus tôt
        threshold: 0.1
      });

      const currentElement = bottomElementRef.current;
      if (currentElement) {
        observer.current.observe(currentElement);
      }
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
        observer.current = null;
      }
    };
  }, [loadMoreRecipes, hasMoreRecipes, debouncedSearch]);

  // Effet pour réinitialiser les recettes lors des changements de filtres
  useEffect(() => {
    if (navigation.state === "loading" && navigation.formData) {
      setRecipes([]);
      setCurrentPage(1);
    }
  }, [navigation.state, navigation.formData]);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Barre de recherche */}
        <SearchBar
          value={search}
          onChange={handleSearchChange}
          onClear={handleSearchClear}
          onFilterClick={() => setFiltersVisible(true)}
          totalRecipes={pagination.totalRecipes}
        />

        {/* Badges de filtres actifs */}
        <ActiveFilters
          category={category}
          mealType={mealType}
          maxPreparationTime={maxPreparationTime}
          categoryOptions={filters.categoryOptions}
          onCategoryRemove={() => {
            setCategory("");
            updateFilter("categoryId", "");
          }}
          onMealTypeRemove={() => {
            setMealType("");
            updateFilter("mealType", "");
          }}
          onPrepTimeRemove={() => {
            setMaxPreparationTime(null);
            updateFilter("maxPreparationTime", null);
          }}
          onResetAll={resetFilters}
        />

        {/* Affichage des recettes */}
        {error ? (
          <div className="my-8 bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-center">
            {error}
          </div>
        ) : recipes.length === 0 && !isLoading ? (
          <EmptyState onReset={resetFilters} />
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
          >
            {isLoadingMore && <LoadingIndicator />}
          </div>
        )}

        {/* Formulaire caché pour les filtres */}
        <Form ref={formRef} method="get" id="filter-form" className="hidden">
          <input type="hidden" name="search" value={search} />
          <input type="hidden" name="categoryId" value={category} />
          <input type="hidden" name="mealType" value={mealType} />
          {maxPreparationTime && (
            <input type="hidden" name="maxPreparationTime" value={maxPreparationTime.toString()} />
          )}
          <input type="hidden" name="sortBy" value={sortBy} />
          <input type="hidden" name="sortDirection" value={sortDirection} />
          <input type="hidden" name="random" value={randomEnabled.toString()} />
          <input type="hidden" name="page" value="1" />
        </Form>

        {/* Panneau de filtres mobile */}
        <FilterPanel
          isVisible={filtersVisible}
          onClose={() => setFiltersVisible(false)}
          filters={filters}
          filterValues={{
            category,
            mealType,
            maxPreparationTime,
            sortBy,
            sortDirection,
            randomEnabled
          }}
          onUpdateFilter={updateFilter}
          onReset={resetFilters}
          formRef={formRef}
          onSubmit={submit}
          setCategory={setCategory}
          setMealType={setMealType}
          setMaxPreparationTime={setMaxPreparationTime}
          setSortBy={setSortBy}
          setSortDirection={setSortDirection}
          setRandomEnabled={setRandomEnabled}
        />
      </div>
    </Layout>
  );
}