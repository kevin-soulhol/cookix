import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { Form, useLoaderData, useSubmit, useSearchParams } from "@remix-run/react";
import { useState, useRef, useEffect } from "react";
import BoxRecipe from "~/components/BoxRecipe";
import FilterPanel, { FilterPanelType } from "~/components/FilterPanel";
import Layout from "~/components/Layout";
import SearchBar, { ActiveFilters, EmptyState, LoadingIndicator } from "~/components/SearchBarIndex";
import { useInfiniteScroll } from "~/hooks/useInfiniteScroll";
import { useRecipeFilters } from "~/hooks/useRecipeFilters";
import { useRecipePagination } from "~/hooks/useRecipePagination";


export const meta: MetaFunction = () => {
  return [
    { title: "Cookix" },
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
  const sortDirection = url.searchParams.get("sortDirection") || "asc";
  const randomEnabled = url.searchParams.get("random") === "true";
  const onlyVege = url.searchParams.get("onlyVege") === "true";

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
  if (randomEnabled) apiUrl.searchParams.append("random", "true");
  if (onlyVege) apiUrl.searchParams.append("onlyVege", "true");

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
      preparationTimeMax: 120,
      onlyVege
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
        randomEnabled,
        onlyVege
      },
      error: false
    });
  } catch (error) {
    console.error("Erreur lors du chargement des recettes:", error);
    const filters: FilterPanelType = { categoryOptions: [], mealTypeOptions: [], preparationTimeMax: 120, onlyVege: false }
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
        sortDirection: "asc",
        randomEnabled: null,
        onlyVege: null
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

  const [searchParams] = useSearchParams();
  const submit = useSubmit();
  const formRef = useRef<HTMLFormElement>(null);

  // État des filtres
  const [filterState, filterActions] = useRecipeFilters({
    search: appliedFilters.search,
    category: appliedFilters.categoryId?.toString() || "",
    mealType: appliedFilters.mealType,
    maxPreparationTime: appliedFilters.maxPreparationTime,
    sortBy: appliedFilters.sortBy as any,
    sortDirection: appliedFilters.sortDirection as any,
    randomEnabled: appliedFilters.randomEnabled,
    onlyVege: appliedFilters.onlyVege
  });

  // Utiliser le hook de pagination
  const {
    recipes,
    isLoading,
    isLoadingMore,
    hasMoreRecipes,
    loadMoreRecipes
  } = useRecipePagination({
    initialRecipes,
    initialPage: pagination.currentPage,
    hasMore: pagination.hasMore,
    searchParams
  });

  // État pour l'affichage du panneau de filtres
  const [filtersVisible, setFiltersVisible] = useState(false);

  // Configurer le scroll infini
  const infiniteScrollRef = useInfiniteScroll({
    hasMore: hasMoreRecipes,
    isLoading: isLoadingMore,
    onLoadMore: loadMoreRecipes,
    enabled: !isLoading
  });

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Barre de recherche */}
        <SearchBar
          value={filterState.search}
          onChange={(e) => filterActions.setSearch(e.target.value)}
          onClear={filterActions.clearSearch}
          onFilterClick={() => setFiltersVisible(true)}
          totalRecipes={pagination.totalRecipes}
        />

        {/* Badges de filtres actifs */}
        <ActiveFilters
          category={filterState.category}
          mealType={filterState.mealType}
          maxPreparationTime={filterState.maxPreparationTime}
          categoryOptions={filters.categoryOptions}
          onyVegeEnabled={filters.onlyVege}
          onCategoryRemove={() => {
            filterActions.setCategory("");
            filterActions.updateFilter("categoryId", "");
          }}
          onMealTypeRemove={() => {
            filterActions.setMealType("");
            filterActions.updateFilter("mealType", "");
          }}
          onPrepTimeRemove={() => {
            filterActions.setMaxPreparationTime(null);
            filterActions.updateFilter("maxPreparationTime", null);
          }}
          onOnlyVegeRemove={() => {
            filterActions.setOnlyVege(false);
            filterActions.updateFilter("onlyVege", null);
          }}
          onResetAll={filterActions.resetFilters}
        />

        {/* Affichage des recettes */}
        {error ? (
          <div className="my-8 bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-center">
            {error}
          </div>
        ) : recipes.length === 0 && !isLoading ? (
          <EmptyState onReset={filterActions.resetFilters} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {recipes.map((recipe, index) => (
              <BoxRecipe key={`${recipe.id}-${index}`} recipe={recipe} />
            ))}
          </div>
        )}

        {/* Élément observé pour le scroll infini */}
        <div
          ref={infiniteScrollRef}
          className="h-20 w-full my-4 flex justify-center items-center"
          id="infinite-scroll-target" // Ajouter un ID pour faciliter le débogage
        >
          {isLoadingMore ? (
            <LoadingIndicator />
          ) : hasMoreRecipes ? (
            <div>Scroll pour plus de résultats</div>
          ) : (
            <div>Fin des résultats</div>
          )}
        </div>

        {/* Formulaire caché pour les filtres */}
        <Form ref={formRef} method="get" id="filter-form" className="hidden">
          <input type="hidden" name="search" value={filterState.search} />
          <input type="hidden" name="categoryId" value={filterState.category} />
          <input type="hidden" name="mealType" value={filterState.mealType} />
          {filterState.maxPreparationTime && (
            <input type="hidden" name="maxPreparationTime" value={filterState.maxPreparationTime.toString()} />
          )}
          <input type="hidden" name="sortBy" value={filterState.sortBy} />
          <input type="hidden" name="sortDirection" value={filterState.sortDirection} />
          <input type="hidden" name="random" value={filterState.randomEnabled.toString()} />
          <input type="hidden" name="onlyVege" value={filterState.onlyVege.toString()} />
          <input type="hidden" name="page" value="1" />
        </Form>

        {/* Panneau de filtres mobile */}
        <FilterPanel
          isVisible={filtersVisible}
          onClose={() => setFiltersVisible(false)}
          filters={filters}
          filterValues={{
            category: filterState.category,
            mealType: filterState.mealType,
            maxPreparationTime: filterState.maxPreparationTime,
            sortBy: filterState.sortBy,
            sortDirection: filterState.sortDirection,
            randomEnabled: filterState.randomEnabled,
            onlyVege: filterState.onlyVege
          }}
          onUpdateFilter={filterActions.updateFilter}
          onReset={filterActions.resetFilters}
          formRef={formRef}
          onSubmit={submit}
          setCategory={filterActions.setCategory}
          setMealType={filterActions.setMealType}
          setMaxPreparationTime={filterActions.setMaxPreparationTime}
          setSortBy={filterActions.setSortBy}
          setSortDirection={filterActions.setSortDirection}
          setRandomEnabled={filterActions.setRandomEnabled}
          setOnlyVege={filterActions.setOnlyVege}
        />
      </div>
    </Layout>
  );
}