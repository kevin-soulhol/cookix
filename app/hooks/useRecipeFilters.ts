import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "@remix-run/react";
import { SortDirection, SortOption } from "~/components/FilterPanel";
import { useDebounce } from "./useDebounce";

interface FilterState {
  search: string;
  category: string;
  mealType: string;
  maxPreparationTime: number | null;
  sortBy: SortOption;
  sortDirection: SortDirection;
  randomEnabled: boolean;
  onlyVege: boolean;
}

interface FilterActions {
  setSearch: (value: string) => void;
  setCategory: (value: string) => void;
  setMealType: (value: string) => void;
  setMaxPreparationTime: (value: number | null) => void;
  setSortBy: (value: SortOption) => void;
  setSortDirection: (value: SortDirection) => void;
  setRandomEnabled: (value: boolean) => void;
  setOnlyVege: (value: boolean) => void;
  clearSearch: () => void;
  resetFilters: () => void;
  updateFilter: (key: string, value: string | null) => void;
}

export function useRecipeFilters(initialState: FilterState): [FilterState, FilterActions] {
  // États pour les filtres
  const [search, setSearch] = useState(initialState.search);
  const [category, setCategory] = useState(initialState.category);
  const [mealType, setMealType] = useState(initialState.mealType);
  const [maxPreparationTime, setMaxPreparationTime] = useState<number | null>(initialState.maxPreparationTime);
  const [sortBy, setSortBy] = useState<SortOption>(initialState.sortBy);
  const [sortDirection, setSortDirection] = useState<SortDirection>(initialState.sortDirection);
  const [randomEnabled, setRandomEnabled] = useState(initialState.randomEnabled);
  const [onlyVege, setOnlyVege] = useState(initialState.onlyVege);
  
  
  // Debounce la recherche
  const debouncedSearch = useDebounce(search, 400);
  
  const [searchParams, setSearchParams] = useSearchParams();

  // Gérer la mise à jour des paramètres d'URL quand la recherche change
  useEffect(() => {
    if (debouncedSearch !== initialState.search && debouncedSearch !== searchParams.get("search")) {
      const params = new URLSearchParams();

      if (debouncedSearch) params.set("search", debouncedSearch);
      if (category) params.set("categoryId", category);
      if (mealType) params.set("mealType", mealType);
      if (maxPreparationTime) params.set("maxPreparationTime", maxPreparationTime.toString());
      params.set("sortBy", sortBy);
      params.set("sortDirection", sortDirection);
      params.set("random", randomEnabled ? "true" : "false");
      params.set("onlyVege", onlyVege ? "true" : "false");
      params.set("page", "1");

      setSearchParams(params);
    }
  }, [debouncedSearch, initialState.search, category, mealType, maxPreparationTime, sortBy, sortDirection, randomEnabled, onlyVege, setSearchParams, searchParams]);

  // Fonctions pour modifier les filtres
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
    setSortDirection("asc");
    setRandomEnabled(false);
    setOnlyVege(false);

    setSearchParams({
      sortBy: "note",
      sortDirection: "asc",
      random: "false",
      page: "1"
    });
  }, [setSearchParams]);

  const clearSearch = useCallback(() => {
    setSearch("");
  }, []);

  // Définir l'état et les actions
  const state: FilterState = {
    search,
    category,
    mealType,
    maxPreparationTime,
    sortBy,
    sortDirection,
    randomEnabled,
    onlyVege
  };

  const actions: FilterActions = {
    setSearch,
    setCategory,
    setMealType,
    setMaxPreparationTime,
    setSortBy,
    setSortDirection,
    setRandomEnabled,
    setOnlyVege,
    clearSearch,
    resetFilters,
    updateFilter,
  };

  return [state, actions];
}