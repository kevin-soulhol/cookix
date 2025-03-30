import {
  BoxRecipe
} from "/build/_shared/chunk-IWHF6S5H.js";
import {
  Layout
} from "/build/_shared/chunk-7EYIA7FC.js";
import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
  Form,
  useFetcher,
  useLoaderData,
  useNavigation,
  useSearchParams,
  useSubmit
} from "/build/_shared/chunk-YHAWPGHG.js";
import {
  require_jsx_dev_runtime
} from "/build/_shared/chunk-XGOTYLZ5.js";
import {
  createHotContext
} from "/build/_shared/chunk-MCH5QMAS.js";
import "/build/_shared/chunk-UWV35TSL.js";
import "/build/_shared/chunk-U4FRFQSK.js";
import {
  require_react
} from "/build/_shared/chunk-7M6SC7J5.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// app/routes/recettes._index.tsx
var import_node = __toESM(require_node(), 1);
var import_react2 = __toESM(require_react(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/recettes._index.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
var _s2 = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/recettes._index.tsx"
  );
  import.meta.hot.lastModified = "1743284978004.621";
}
function useDebounce(value, delay) {
  _s();
  const [debouncedValue, setDebouncedValue] = (0, import_react2.useState)(value);
  (0, import_react2.useEffect)(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}
_s(useDebounce, "KDuPAtDOgxm8PU6legVJOb3oOmA=");
var meta = () => {
  return [{
    title: "Toutes les recettes - Cookix"
  }, {
    name: "description",
    content: "D\xE9couvrez et filtrez toutes nos recettes pour Monsieur Cuisine Smart"
  }];
};
function RecipesIndex() {
  _s2();
  const {
    recipes: initialRecipes,
    pagination,
    filters,
    appliedFilters,
    error
  } = useLoaderData();
  const navigation = useNavigation();
  const [searchParams, setSearchParams] = useSearchParams();
  const submit = useSubmit();
  const moreFetcher = useFetcher();
  const [recipes, setRecipes] = (0, import_react2.useState)(initialRecipes);
  const [currentPage, setCurrentPage] = (0, import_react2.useState)(pagination.currentPage);
  const [isLoadingMore, setIsLoadingMore] = (0, import_react2.useState)(false);
  const [search, setSearch] = (0, import_react2.useState)(appliedFilters.search);
  const [filtersVisible, setFiltersVisible] = (0, import_react2.useState)(false);
  const [maxPreparationTime, setMaxPreparationTime] = (0, import_react2.useState)(appliedFilters.maxPreparationTime);
  const [category, setCategory] = (0, import_react2.useState)(appliedFilters.categoryId?.toString() || "");
  const [mealType, setMealType] = (0, import_react2.useState)(appliedFilters.mealType);
  const [sortBy, setSortBy] = (0, import_react2.useState)(appliedFilters.sortBy);
  const [sortDirection, setSortDirection] = (0, import_react2.useState)(appliedFilters.sortDirection);
  const [randomEnabled, setRandomEnabled] = (0, import_react2.useState)(appliedFilters.random !== false);
  const debouncedSearch = useDebounce(search, 400);
  const formRef = (0, import_react2.useRef)(null);
  const loadMoreRecipes = (0, import_react2.useCallback)(() => {
    if (!pagination.hasMore || moreFetcher.state !== "idle" || isLoadingMore || navigation.state !== "idle") {
      return;
    }
    setIsLoadingMore(true);
    const nextPage = currentPage + 1;
    const params = new URLSearchParams(searchParams);
    params.set("page", nextPage.toString());
    moreFetcher.load(`/recettes?${params.toString()}`);
  }, [currentPage, pagination.hasMore, moreFetcher, isLoadingMore, searchParams, navigation.state]);
  (0, import_react2.useEffect)(() => {
    if (moreFetcher.state === "idle" && moreFetcher.data && isLoadingMore) {
      const fetcherData = moreFetcher.data;
      if (fetcherData.recipes && fetcherData.recipes.length > 0) {
        setRecipes((prev) => [...prev, ...fetcherData.recipes]);
        setCurrentPage((prev) => prev + 1);
      }
      setIsLoadingMore(false);
    }
  }, [moreFetcher.state, moreFetcher.data, isLoadingMore]);
  const observer = (0, import_react2.useRef)(null);
  const bottomElementRef = (0, import_react2.useRef)(null);
  (0, import_react2.useEffect)(() => {
    if (observer.current) {
      observer.current.disconnect();
    }
    const loadMore = () => {
      if (!isLoadingMore && pagination.hasMore) {
        loadMoreRecipes();
      }
    };
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadMore();
      }
    }, {
      rootMargin: "100px",
      threshold: 0.1
    });
    const currentElement = bottomElementRef.current;
    if (currentElement) {
      observer.current.observe(currentElement);
    }
    return () => {
      if (observer.current && currentElement) {
        observer.current.unobserve(currentElement);
        observer.current.disconnect();
      }
    };
  }, [loadMoreRecipes, isLoadingMore, pagination.hasMore]);
  (0, import_react2.useEffect)(() => {
    if (debouncedSearch !== appliedFilters.search && formRef.current) {
      const params = new URLSearchParams();
      if (debouncedSearch)
        params.set("search", debouncedSearch);
      if (category)
        params.set("categoryId", category);
      if (mealType)
        params.set("mealType", mealType);
      if (maxPreparationTime)
        params.set("maxPreparationTime", maxPreparationTime.toString());
      params.set("sortBy", sortBy);
      params.set("sortDirection", sortDirection);
      params.set("page", "1");
      setSearchParams(params);
      setCurrentPage(1);
      setRecipes([]);
    }
  }, [debouncedSearch, appliedFilters.search, setSearchParams]);
  (0, import_react2.useEffect)(() => {
    if (navigation.state === "idle") {
      if (pagination.currentPage === 1) {
        setRecipes(initialRecipes);
      }
    }
  }, [initialRecipes, navigation.state, pagination.currentPage]);
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };
  const resetFilters = (0, import_react2.useCallback)(() => {
    setSearch("");
    setMaxPreparationTime(null);
    setCategory("");
    setMealType("");
    setSortBy("title");
    setSortDirection("asc");
    setRandomEnabled(true);
    if (formRef.current) {
      const formData = new FormData(formRef.current);
      formData.delete("search");
      formData.delete("categoryId");
      formData.delete("mealType");
      formData.delete("maxPreparationTime");
      formData.set("sortBy", "title");
      formData.set("sortDirection", "asc");
      formData.set("page", "1");
      submit(formData, {
        method: "get"
      });
    }
  }, [submit]);
  const isLoading = navigation.state === "loading" || navigation.state === "submitting";
  (0, import_react2.useEffect)(() => {
    if (navigation.state === "loading" && navigation.formData) {
      setRecipes([]);
      setCurrentPage(1);
    }
    if (navigation.state === "idle" && initialRecipes) {
      if (pagination.currentPage === 1) {
        setRecipes(initialRecipes);
      }
    }
  }, [navigation.state, navigation.formData, initialRecipes, pagination.currentPage]);
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Layout, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mb-3 text-center", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-xl font-bold text-gray-900", children: [
        pagination.totalRecipes,
        " recettes \xE0 d\xE9couvrir"
      ] }, void 0, true, {
        fileName: "app/routes/recettes._index.tsx",
        lineNumber: 366,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm text-gray-600", children: "Trouvez la recette parfaite pour votre Monsieur Cuisine Smart" }, void 0, false, {
        fileName: "app/routes/recettes._index.tsx",
        lineNumber: 369,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/recettes._index.tsx",
      lineNumber: 365,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "sticky top-0 z-10 bg-white pb-3 pt-1 shadow-sm", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "relative", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "text", name: "search", id: "search", placeholder: "Rechercher une recette...", value: search, onChange: handleSearchChange, className: "block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500 text-base" }, void 0, false, {
          fileName: "app/routes/recettes._index.tsx",
          lineNumber: 377,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "h-5 w-5 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }, void 0, false, {
          fileName: "app/routes/recettes._index.tsx",
          lineNumber: 380,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "app/routes/recettes._index.tsx",
          lineNumber: 379,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "app/routes/recettes._index.tsx",
          lineNumber: 378,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "button", onClick: () => setFiltersVisible(true), className: "absolute inset-y-0 right-0 px-3 flex items-center", "aria-label": "Filtrer les recettes", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "w-5 h-5 text-gray-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" }, void 0, false, {
          fileName: "app/routes/recettes._index.tsx",
          lineNumber: 387,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "app/routes/recettes._index.tsx",
          lineNumber: 386,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "app/routes/recettes._index.tsx",
          lineNumber: 385,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/recettes._index.tsx",
        lineNumber: 376,
        columnNumber: 11
      }, this),
      (category || mealType || maxPreparationTime) && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex flex-wrap gap-2 mt-2", children: [
        category && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800", children: [
          filters.categoryOptions.find((c) => c.id.toString() === category)?.title || "Cat\xE9gorie",
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "button", onClick: () => {
            setCategory("");
            if (formRef.current)
              submit(formRef.current);
          }, className: "ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-indigo-400 hover:bg-indigo-200 hover:text-indigo-600", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "h-3 w-3", viewBox: "0 0 12 12", fill: "none", stroke: "currentColor", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { d: "M8 4l-4 4M4 4l4 4", strokeWidth: "2", strokeLinecap: "round" }, void 0, false, {
            fileName: "app/routes/recettes._index.tsx",
            lineNumber: 401,
            columnNumber: 23
          }, this) }, void 0, false, {
            fileName: "app/routes/recettes._index.tsx",
            lineNumber: 400,
            columnNumber: 21
          }, this) }, void 0, false, {
            fileName: "app/routes/recettes._index.tsx",
            lineNumber: 396,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/recettes._index.tsx",
          lineNumber: 394,
          columnNumber: 28
        }, this),
        mealType && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800", children: [
          mealType,
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "button", onClick: () => {
            setMealType("");
            if (formRef.current)
              submit(formRef.current);
          }, className: "ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-green-400 hover:bg-green-200 hover:text-green-600", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "h-3 w-3", viewBox: "0 0 12 12", fill: "none", stroke: "currentColor", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { d: "M8 4l-4 4M4 4l4 4", strokeWidth: "2", strokeLinecap: "round" }, void 0, false, {
            fileName: "app/routes/recettes._index.tsx",
            lineNumber: 413,
            columnNumber: 23
          }, this) }, void 0, false, {
            fileName: "app/routes/recettes._index.tsx",
            lineNumber: 412,
            columnNumber: 21
          }, this) }, void 0, false, {
            fileName: "app/routes/recettes._index.tsx",
            lineNumber: 408,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/recettes._index.tsx",
          lineNumber: 406,
          columnNumber: 28
        }, this),
        maxPreparationTime && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800", children: [
          "Max ",
          maxPreparationTime,
          " min",
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "button", onClick: () => {
            setMaxPreparationTime(null);
            if (formRef.current)
              submit(formRef.current);
          }, className: "ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-amber-400 hover:bg-amber-200 hover:text-amber-600", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "h-3 w-3", viewBox: "0 0 12 12", fill: "none", stroke: "currentColor", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { d: "M8 4l-4 4M4 4l4 4", strokeWidth: "2", strokeLinecap: "round" }, void 0, false, {
            fileName: "app/routes/recettes._index.tsx",
            lineNumber: 425,
            columnNumber: 23
          }, this) }, void 0, false, {
            fileName: "app/routes/recettes._index.tsx",
            lineNumber: 424,
            columnNumber: 21
          }, this) }, void 0, false, {
            fileName: "app/routes/recettes._index.tsx",
            lineNumber: 420,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/recettes._index.tsx",
          lineNumber: 418,
          columnNumber: 38
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "button", onClick: resetFilters, className: "text-xs text-gray-500 hover:text-gray-700 underline", children: "Tout effacer" }, void 0, false, {
          fileName: "app/routes/recettes._index.tsx",
          lineNumber: 430,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/recettes._index.tsx",
        lineNumber: 393,
        columnNumber: 60
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/recettes._index.tsx",
      lineNumber: 375,
      columnNumber: 9
    }, this),
    error ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "my-8 bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-center", children: error }, void 0, false, {
      fileName: "app/routes/recettes._index.tsx",
      lineNumber: 437,
      columnNumber: 18
    }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
      recipes.length === 0 && !isLoading ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-center py-12 bg-white rounded-lg shadow-md", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "mx-auto h-12 w-12 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }, void 0, false, {
          fileName: "app/routes/recettes._index.tsx",
          lineNumber: 443,
          columnNumber: 19
        }, this) }, void 0, false, {
          fileName: "app/routes/recettes._index.tsx",
          lineNumber: 442,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { className: "mt-2 text-lg font-medium text-gray-900", children: "Aucune recette trouv\xE9e" }, void 0, false, {
          fileName: "app/routes/recettes._index.tsx",
          lineNumber: 445,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-1 text-sm text-gray-500", children: "Essayez de modifier vos filtres pour voir plus de r\xE9sultats." }, void 0, false, {
          fileName: "app/routes/recettes._index.tsx",
          lineNumber: 446,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-6", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: resetFilters, className: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500", children: "R\xE9initialiser les filtres" }, void 0, false, {
          fileName: "app/routes/recettes._index.tsx",
          lineNumber: 450,
          columnNumber: 19
        }, this) }, void 0, false, {
          fileName: "app/routes/recettes._index.tsx",
          lineNumber: 449,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/recettes._index.tsx",
        lineNumber: 441,
        columnNumber: 51
      }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2", children: recipes.map((recipe, index) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BoxRecipe, { recipe }, `${recipe.id}-${index}`, false, {
        fileName: "app/routes/recettes._index.tsx",
        lineNumber: 455,
        columnNumber: 49
      }, this)) }, void 0, false, {
        fileName: "app/routes/recettes._index.tsx",
        lineNumber: 454,
        columnNumber: 24
      }, this),
      pagination.hasMore && recipes.length > 0 && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { ref: bottomElementRef, className: "h-20 w-full my-4 flex justify-center items-center", children: isLoadingMore && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex flex-col items-center", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "animate-spin h-8 w-8 text-rose-500 mb-2", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }, void 0, false, {
            fileName: "app/routes/recettes._index.tsx",
            lineNumber: 462,
            columnNumber: 23
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" }, void 0, false, {
            fileName: "app/routes/recettes._index.tsx",
            lineNumber: 463,
            columnNumber: 23
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/recettes._index.tsx",
          lineNumber: 461,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-sm text-gray-500", children: "Chargement d'autres recettes..." }, void 0, false, {
          fileName: "app/routes/recettes._index.tsx",
          lineNumber: 465,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/recettes._index.tsx",
        lineNumber: 460,
        columnNumber: 35
      }, this) }, void 0, false, {
        fileName: "app/routes/recettes._index.tsx",
        lineNumber: 459,
        columnNumber: 58
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/recettes._index.tsx",
      lineNumber: 439,
      columnNumber: 20
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Form, { ref: formRef, method: "get", id: "filter-form", className: "hidden", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "search", value: search }, void 0, false, {
        fileName: "app/routes/recettes._index.tsx",
        lineNumber: 472,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "categoryId", value: category }, void 0, false, {
        fileName: "app/routes/recettes._index.tsx",
        lineNumber: 473,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "mealType", value: mealType }, void 0, false, {
        fileName: "app/routes/recettes._index.tsx",
        lineNumber: 474,
        columnNumber: 11
      }, this),
      maxPreparationTime && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "maxPreparationTime", value: maxPreparationTime }, void 0, false, {
        fileName: "app/routes/recettes._index.tsx",
        lineNumber: 475,
        columnNumber: 34
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "sortBy", value: sortBy }, void 0, false, {
        fileName: "app/routes/recettes._index.tsx",
        lineNumber: 476,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "sortDirection", value: sortDirection }, void 0, false, {
        fileName: "app/routes/recettes._index.tsx",
        lineNumber: 477,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "random", value: randomEnabled.toString() }, void 0, false, {
        fileName: "app/routes/recettes._index.tsx",
        lineNumber: 478,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "page", value: "1" }, void 0, false, {
        fileName: "app/routes/recettes._index.tsx",
        lineNumber: 479,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/recettes._index.tsx",
      lineNumber: 471,
      columnNumber: 9
    }, this),
    filtersVisible && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "fixed inset-0 bg-gray-500 bg-opacity-75 z-50 flex items-end", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-white w-full rounded-t-xl p-5 transform transition-transform duration-300 ease-in-out max-h-[90vh] overflow-auto", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex justify-between items-center mb-4", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { className: "text-lg font-semibold", children: "Filtres" }, void 0, false, {
          fileName: "app/routes/recettes._index.tsx",
          lineNumber: 487,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: () => setFiltersVisible(false), className: "p-2 rounded-full hover:bg-gray-100", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "w-5 h-5", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M6 18L18 6M6 6l12 12" }, void 0, false, {
          fileName: "app/routes/recettes._index.tsx",
          lineNumber: 490,
          columnNumber: 21
        }, this) }, void 0, false, {
          fileName: "app/routes/recettes._index.tsx",
          lineNumber: 489,
          columnNumber: 19
        }, this) }, void 0, false, {
          fileName: "app/routes/recettes._index.tsx",
          lineNumber: 488,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/recettes._index.tsx",
        lineNumber: 486,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "space-y-5", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "categoryId", className: "block text-sm font-medium text-gray-700 mb-1", children: "Cat\xE9gorie" }, void 0, false, {
            fileName: "app/routes/recettes._index.tsx",
            lineNumber: 499,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", { id: "categoryId", name: "categoryId", value: category, onChange: (e) => {
            setCategory(e.target.value);
            if (formRef.current)
              submit(formRef.current);
          }, className: "block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: "", children: "Toutes les cat\xE9gories" }, void 0, false, {
              fileName: "app/routes/recettes._index.tsx",
              lineNumber: 506,
              columnNumber: 21
            }, this),
            filters.categoryOptions?.map((option) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: option.id.toString(), children: option.title }, option.id, false, {
              fileName: "app/routes/recettes._index.tsx",
              lineNumber: 507,
              columnNumber: 61
            }, this))
          ] }, void 0, true, {
            fileName: "app/routes/recettes._index.tsx",
            lineNumber: 502,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/recettes._index.tsx",
          lineNumber: 498,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "mealType", className: "block text-sm font-medium text-gray-700 mb-1", children: "Type de repas" }, void 0, false, {
            fileName: "app/routes/recettes._index.tsx",
            lineNumber: 515,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", { id: "mealType", name: "mealType", value: mealType, onChange: (e) => {
            setMealType(e.target.value);
            if (formRef.current)
              submit(formRef.current);
          }, className: "block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: "", children: "Tous les types" }, void 0, false, {
              fileName: "app/routes/recettes._index.tsx",
              lineNumber: 522,
              columnNumber: 21
            }, this),
            filters.mealTypeOptions?.map((option) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: option.title, children: option.title }, option.title, false, {
              fileName: "app/routes/recettes._index.tsx",
              lineNumber: 523,
              columnNumber: 61
            }, this))
          ] }, void 0, true, {
            fileName: "app/routes/recettes._index.tsx",
            lineNumber: 518,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/recettes._index.tsx",
          lineNumber: 514,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "maxPreparationTime", className: "block text-sm font-medium text-gray-700 mb-1", children: [
            "Temps de pr\xE9paration (max ",
            maxPreparationTime || filters.preparationTimeMax,
            " min)"
          ] }, void 0, true, {
            fileName: "app/routes/recettes._index.tsx",
            lineNumber: 531,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "range", id: "maxPreparationTime", name: "maxPreparationTime", min: "0", max: filters.preparationTimeMax, step: "10", value: maxPreparationTime || filters.preparationTimeMax, onChange: (e) => {
            setMaxPreparationTime(parseInt(e.target.value));
            if (formRef.current)
              submit(formRef.current);
          }, className: "w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rose-500" }, void 0, false, {
            fileName: "app/routes/recettes._index.tsx",
            lineNumber: 534,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex justify-between text-xs text-gray-500 mt-1", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "0 min" }, void 0, false, {
              fileName: "app/routes/recettes._index.tsx",
              lineNumber: 539,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [
              filters.preparationTimeMax,
              " min"
            ] }, void 0, true, {
              fileName: "app/routes/recettes._index.tsx",
              lineNumber: 540,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/recettes._index.tsx",
            lineNumber: 538,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/recettes._index.tsx",
          lineNumber: 530,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "random", className: "text-sm font-medium text-gray-700", children: "Affichage al\xE9atoire" }, void 0, false, {
              fileName: "app/routes/recettes._index.tsx",
              lineNumber: 547,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "button", onClick: () => {
              setRandomEnabled(!randomEnabled);
              if (formRef.current) {
                setTimeout(() => submit(formRef.current), 0);
              }
            }, className: `relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none ${randomEnabled ? "bg-rose-500" : "bg-gray-200"}`, role: "switch", "aria-checked": randomEnabled, children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "sr-only", children: "Activer l'affichage al\xE9atoire" }, void 0, false, {
                fileName: "app/routes/recettes._index.tsx",
                lineNumber: 556,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { "aria-hidden": "true", className: `pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${randomEnabled ? "translate-x-5" : "translate-x-0"}` }, void 0, false, {
                fileName: "app/routes/recettes._index.tsx",
                lineNumber: 557,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/recettes._index.tsx",
              lineNumber: 550,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/recettes._index.tsx",
            lineNumber: 546,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-1 text-xs text-gray-500", children: "Afficher les recettes dans un ordre al\xE9atoire pour favoriser la d\xE9couverte" }, void 0, false, {
            fileName: "app/routes/recettes._index.tsx",
            lineNumber: 560,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/recettes._index.tsx",
          lineNumber: 545,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "sort", className: "block text-sm font-medium text-gray-700 mb-1", children: "Trier par" }, void 0, false, {
            fileName: "app/routes/recettes._index.tsx",
            lineNumber: 567,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", { id: "sort", name: "sort", value: `${sortBy}-${sortDirection}`, onChange: (e) => {
            const [newSortBy, newSortDirection] = e.target.value.split("-");
            setSortBy(newSortBy);
            setSortDirection(newSortDirection);
            if (formRef.current)
              submit(formRef.current);
          }, className: "block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: "title-asc", children: "Titre (A-Z)" }, void 0, false, {
              fileName: "app/routes/recettes._index.tsx",
              lineNumber: 576,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: "title-desc", children: "Titre (Z-A)" }, void 0, false, {
              fileName: "app/routes/recettes._index.tsx",
              lineNumber: 577,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: "preparationTime-asc", children: "Temps de pr\xE9paration (croissant)" }, void 0, false, {
              fileName: "app/routes/recettes._index.tsx",
              lineNumber: 578,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: "preparationTime-desc", children: "Temps de pr\xE9paration (d\xE9croissant)" }, void 0, false, {
              fileName: "app/routes/recettes._index.tsx",
              lineNumber: 579,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: "note-desc", children: "Note (d\xE9croissant)" }, void 0, false, {
              fileName: "app/routes/recettes._index.tsx",
              lineNumber: 580,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: "note-asc", children: "Note (croissant)" }, void 0, false, {
              fileName: "app/routes/recettes._index.tsx",
              lineNumber: 581,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/recettes._index.tsx",
            lineNumber: 570,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/recettes._index.tsx",
          lineNumber: 566,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex space-x-3 pt-3", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "button", onClick: resetFilters, className: "flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50", children: "R\xE9initialiser" }, void 0, false, {
            fileName: "app/routes/recettes._index.tsx",
            lineNumber: 587,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "button", onClick: () => setFiltersVisible(false), className: "flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700", children: "Appliquer" }, void 0, false, {
            fileName: "app/routes/recettes._index.tsx",
            lineNumber: 590,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/recettes._index.tsx",
          lineNumber: 586,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/recettes._index.tsx",
        lineNumber: 496,
        columnNumber: 15
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/recettes._index.tsx",
      lineNumber: 484,
      columnNumber: 13
    }, this) }, void 0, false, {
      fileName: "app/routes/recettes._index.tsx",
      lineNumber: 483,
      columnNumber: 28
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/recettes._index.tsx",
    lineNumber: 363,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "app/routes/recettes._index.tsx",
    lineNumber: 362,
    columnNumber: 10
  }, this);
}
_s2(RecipesIndex, "CXM28RHza5Kv20w/gWd+BdLMMVw=", false, function() {
  return [useLoaderData, useNavigation, useSearchParams, useSubmit, useFetcher, useDebounce];
});
_c = RecipesIndex;
var _c;
$RefreshReg$(_c, "RecipesIndex");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  RecipesIndex as default,
  meta
};
//# sourceMappingURL=/build/routes/recettes._index-MLFSIGCG.js.map
