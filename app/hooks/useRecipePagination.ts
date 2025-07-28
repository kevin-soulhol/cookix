import { useState, useEffect, useCallback, useRef } from "react";
import { useFetcher, useNavigation } from "@remix-run/react";
import type { RecipeType } from "~/components/BoxRecipe";

interface PaginationState {
  currentPage: number;
  recipes: RecipeType[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMoreRecipes: boolean;
  loadMoreRecipes: () => void;
}

interface PaginationOptions {
  initialRecipes: RecipeType[];
  initialPage: number;
  hasMore: boolean;
  searchParams: URLSearchParams;
}

export function useRecipePagination({
  initialRecipes,
  initialPage,
  hasMore,
  searchParams,
}: PaginationOptions): PaginationState {
  const navigation = useNavigation();
  const moreFetcher = useFetcher();

  const [recipes, setRecipes] = useState<RecipeType[]>(initialRecipes);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreRecipes, setHasMoreRecipes] = useState(hasMore);
  const isFirstRender = useRef(true);

  // Effet pour mettre à jour les recettes quand les données sont chargées
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (navigation.state === "idle") {
      if (initialPage === 1) {
        setRecipes(initialRecipes);
      }
    }
  }, [initialRecipes, navigation.state, initialPage]);

  useEffect(() => {
    if (navigation.state === "idle") {
      setHasMoreRecipes(hasMore);
    }
  }, [navigation.state, hasMore]);

  // Fonction pour charger plus de recettes
  const loadMoreRecipes = useCallback(() => {
    if (moreFetcher.state !== "idle" || isLoadingMore || !hasMoreRecipes) {
      return;
    }

    setIsLoadingMore(true);
    const nextPage = currentPage + 1;

    // Utiliser le fetcher intégré de Remix
    const params = new URLSearchParams(searchParams);
    params.set("page", nextPage.toString());

    moreFetcher.load(`/?index&${params.toString()}`);
  }, [currentPage, hasMoreRecipes, isLoadingMore, moreFetcher, searchParams]);

  // Traiter les résultats du moreFetcher
  useEffect(() => {
    if (moreFetcher.state === "idle" && isLoadingMore && moreFetcher.data) {
      const data = moreFetcher.data;

      if (data?.pagination && "hasMore" in data.pagination) {
        setHasMoreRecipes(data.pagination.hasMore);
      }

      if (
        data !== undefined &&
        data?.recipes &&
        Array.isArray(data.recipes) &&
        data.recipes.length > 0
      ) {
        setRecipes((prev) => [...prev, ...data.recipes]);
        setCurrentPage((prev) => prev + 1);
      } else {
        setHasMoreRecipes(false);
      }

      setIsLoadingMore(false);
    }
  }, [moreFetcher.state, moreFetcher.data, isLoadingMore]);

  // Effet pour réinitialiser les recettes lors des changements de filtres
  useEffect(() => {
    if (navigation.state === "loading" && navigation.formData) {
      setRecipes([]);
      setCurrentPage(1);
    }
  }, [navigation.state, navigation.formData]);

  return {
    currentPage,
    recipes,
    isLoading:
      navigation.state === "loading" || navigation.state === "submitting",
    isLoadingMore,
    hasMoreRecipes,
    loadMoreRecipes,
  };
}
