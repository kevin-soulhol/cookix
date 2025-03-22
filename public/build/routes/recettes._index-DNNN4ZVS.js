import {
  BoxRecipe
} from "/build/_shared/chunk-U4IONIVO.js";
import {
  Layout
} from "/build/_shared/chunk-XAMQJL7P.js";
import {
  require_db
} from "/build/_shared/chunk-KONDUBG3.js";
import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
  Form,
  Link,
  useLoaderData,
  useNavigation,
  useSubmit
} from "/build/_shared/chunk-S75R672J.js";
import "/build/_shared/chunk-U4FRFQSK.js";
import {
  require_jsx_dev_runtime
} from "/build/_shared/chunk-XGOTYLZ5.js";
import {
  require_react
} from "/build/_shared/chunk-7M6SC7J5.js";
import {
  createHotContext
} from "/build/_shared/chunk-MCH5QMAS.js";
import "/build/_shared/chunk-UWV35TSL.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// app/routes/recettes._index.tsx
var import_node = __toESM(require_node(), 1);
var import_react2 = __toESM(require_react(), 1);
var import_db = __toESM(require_db(), 1);
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
  import.meta.hot.lastModified = "1742579563340.4453";
}
var meta = () => {
  return [{
    title: "Toutes les recettes - Cookix"
  }, {
    name: "description",
    content: "D\xE9couvrez et filtrez toutes nos recettes pour Monsieur Cuisine Smart"
  }];
};
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
function RecipesIndex() {
  _s2();
  const {
    recipes,
    pagination,
    filters,
    appliedFilters,
    error
  } = useLoaderData();
  const navigation = useNavigation();
  const submit = useSubmit();
  const [search, setSearch] = (0, import_react2.useState)(appliedFilters.search);
  const [difficulty, setDifficulty] = (0, import_react2.useState)(appliedFilters.difficulty);
  const [maxPreparationTime, setMaxPreparationTime] = (0, import_react2.useState)(appliedFilters.maxPreparationTime);
  const [sortBy, setSortBy] = (0, import_react2.useState)(appliedFilters.sortBy);
  const [sortDirection, setSortDirection] = (0, import_react2.useState)(appliedFilters.sortDirection);
  const [filtersVisible, setFiltersVisible] = (0, import_react2.useState)(false);
  const formRef = (0, import_react2.useRef)(null);
  const debouncedSearch = useDebounce(search, 400);
  (0, import_react2.useEffect)(() => {
    if (debouncedSearch !== appliedFilters.search && formRef.current) {
      submit(formRef.current);
    }
  }, [debouncedSearch, appliedFilters.search, submit]);
  (0, import_react2.useEffect)(() => {
    setSearch(appliedFilters.search);
    setDifficulty(appliedFilters.difficulty);
    setMaxPreparationTime(appliedFilters.maxPreparationTime);
    setSortBy(appliedFilters.sortBy);
    setSortDirection(appliedFilters.sortDirection);
  }, [appliedFilters]);
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };
  const handleSortChange = (e) => {
    const value = e.target.value;
    const [newSortBy, newSortDirection] = value.split("-");
    setSortBy(newSortBy);
    setSortDirection(newSortDirection);
    if (formRef.current) {
      submit(formRef.current);
    }
  };
  const resetFilters = (0, import_react2.useCallback)(() => {
    setSearch("");
    setDifficulty("");
    setMaxPreparationTime(null);
    setSortBy("title");
    setSortDirection("asc");
  }, []);
  const isLoading = navigation.state === "loading" || navigation.state === "submitting";
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Layout, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mb-8 text-center", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: [
        pagination.totalRecipes,
        " recettes \xE0 d\xE9couvrir"
      ] }, void 0, true, {
        fileName: "app/routes/recettes._index.tsx",
        lineNumber: 281,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-gray-600", children: "Trouvez la recette parfaite pour votre Monsieur Cuisine Smart" }, void 0, false, {
        fileName: "app/routes/recettes._index.tsx",
        lineNumber: 284,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/recettes._index.tsx",
      lineNumber: 280,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-8", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: `${filtersVisible ? "block" : "hidden"} md:block md:col-span-1 bg-white rounded-lg shadow-md p-6 self-start sticky top-24`, children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Form, { ref: formRef, method: "get", id: "filter-form", onChange: (e) => submit(e.currentTarget), children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { className: "font-semibold text-lg mb-4 flex items-center justify-between", children: [
          "Filtres",
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "button", onClick: () => setFiltersVisible(false), className: "md:hidden text-gray-400 hover:text-gray-500", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M6 18L18 6M6 6l12 12" }, void 0, false, {
            fileName: "app/routes/recettes._index.tsx",
            lineNumber: 298,
            columnNumber: 21
          }, this) }, void 0, false, {
            fileName: "app/routes/recettes._index.tsx",
            lineNumber: 297,
            columnNumber: 19
          }, this) }, void 0, false, {
            fileName: "app/routes/recettes._index.tsx",
            lineNumber: 296,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/recettes._index.tsx",
          lineNumber: 294,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mb-6", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "search", className: "block text-sm font-medium text-gray-700 mb-1", children: "Rechercher" }, void 0, false, {
            fileName: "app/routes/recettes._index.tsx",
            lineNumber: 305,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "relative", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "text", name: "search", id: "search", placeholder: "Nom de recette...", value: search, onChange: handleSearchChange, className: "block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm" }, void 0, false, {
              fileName: "app/routes/recettes._index.tsx",
              lineNumber: 309,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "h-5 w-5 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }, void 0, false, {
              fileName: "app/routes/recettes._index.tsx",
              lineNumber: 312,
              columnNumber: 23
            }, this) }, void 0, false, {
              fileName: "app/routes/recettes._index.tsx",
              lineNumber: 311,
              columnNumber: 21
            }, this) }, void 0, false, {
              fileName: "app/routes/recettes._index.tsx",
              lineNumber: 310,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/recettes._index.tsx",
            lineNumber: 308,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/recettes._index.tsx",
          lineNumber: 304,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mb-6", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "difficulty", className: "block text-sm font-medium text-gray-700 mb-1", children: "Difficult\xE9" }, void 0, false, {
            fileName: "app/routes/recettes._index.tsx",
            lineNumber: 320,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", { id: "difficulty", name: "difficulty", value: difficulty, onChange: (e) => setDifficulty(e.target.value), className: "block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: "", children: "Toutes les difficult\xE9s" }, void 0, false, {
              fileName: "app/routes/recettes._index.tsx",
              lineNumber: 324,
              columnNumber: 19
            }, this),
            filters.difficultyOptions.map((option) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: option, children: option }, option, false, {
              fileName: "app/routes/recettes._index.tsx",
              lineNumber: 325,
              columnNumber: 60
            }, this))
          ] }, void 0, true, {
            fileName: "app/routes/recettes._index.tsx",
            lineNumber: 323,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/recettes._index.tsx",
          lineNumber: 319,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mb-6", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "maxPreparationTime", className: "block text-sm font-medium text-gray-700 mb-1", children: [
            "Temps de pr\xE9paration (max ",
            maxPreparationTime || filters.preparationTimeMax,
            " min)"
          ] }, void 0, true, {
            fileName: "app/routes/recettes._index.tsx",
            lineNumber: 333,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "range", id: "maxPreparationTime", name: "maxPreparationTime", min: "0", max: filters.preparationTimeMax, step: "10", value: maxPreparationTime || filters.preparationTimeMax, onChange: (e) => setMaxPreparationTime(parseInt(e.target.value)), className: "w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rose-500" }, void 0, false, {
            fileName: "app/routes/recettes._index.tsx",
            lineNumber: 336,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex justify-between text-xs text-gray-500 mt-1", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "0 min" }, void 0, false, {
              fileName: "app/routes/recettes._index.tsx",
              lineNumber: 338,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [
              filters.preparationTimeMax,
              " min"
            ] }, void 0, true, {
              fileName: "app/routes/recettes._index.tsx",
              lineNumber: 339,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/recettes._index.tsx",
            lineNumber: 337,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/recettes._index.tsx",
          lineNumber: 332,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mb-6", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "sort", className: "block text-sm font-medium text-gray-700 mb-1", children: "Trier par" }, void 0, false, {
            fileName: "app/routes/recettes._index.tsx",
            lineNumber: 345,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", { id: "sort", name: "sort", value: `${sortBy}-${sortDirection}`, onChange: handleSortChange, className: "block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: "title-asc", children: "Titre (A-Z)" }, void 0, false, {
              fileName: "app/routes/recettes._index.tsx",
              lineNumber: 349,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: "title-desc", children: "Titre (Z-A)" }, void 0, false, {
              fileName: "app/routes/recettes._index.tsx",
              lineNumber: 350,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: "preparationTime-asc", children: "Temps de pr\xE9paration (croissant)" }, void 0, false, {
              fileName: "app/routes/recettes._index.tsx",
              lineNumber: 351,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: "preparationTime-desc", children: "Temps de pr\xE9paration (d\xE9croissant)" }, void 0, false, {
              fileName: "app/routes/recettes._index.tsx",
              lineNumber: 352,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: "note-desc", children: "Note (d\xE9croissant)" }, void 0, false, {
              fileName: "app/routes/recettes._index.tsx",
              lineNumber: 353,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: "note-asc", children: "Note (croissant)" }, void 0, false, {
              fileName: "app/routes/recettes._index.tsx",
              lineNumber: 354,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/recettes._index.tsx",
            lineNumber: 348,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/recettes._index.tsx",
          lineNumber: 344,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "page", value: "1" }, void 0, false, {
          fileName: "app/routes/recettes._index.tsx",
          lineNumber: 359,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "sortBy", value: sortBy }, void 0, false, {
          fileName: "app/routes/recettes._index.tsx",
          lineNumber: 360,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "sortDirection", value: sortDirection }, void 0, false, {
          fileName: "app/routes/recettes._index.tsx",
          lineNumber: 361,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "submit", onClick: resetFilters, className: "w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500", children: "R\xE9initialiser les filtres" }, void 0, false, {
          fileName: "app/routes/recettes._index.tsx",
          lineNumber: 364,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/recettes._index.tsx",
        lineNumber: 293,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "app/routes/recettes._index.tsx",
        lineNumber: 292,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "md:col-span-3", children: [
        error && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mb-8 bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-center", children: error }, void 0, false, {
          fileName: "app/routes/recettes._index.tsx",
          lineNumber: 372,
          columnNumber: 23
        }, this),
        isLoading && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex justify-center my-8", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "animate-spin h-8 w-8 text-rose-500", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }, void 0, false, {
            fileName: "app/routes/recettes._index.tsx",
            lineNumber: 379,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" }, void 0, false, {
            fileName: "app/routes/recettes._index.tsx",
            lineNumber: 380,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/recettes._index.tsx",
          lineNumber: 378,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "app/routes/recettes._index.tsx",
          lineNumber: 377,
          columnNumber: 27
        }, this),
        !isLoading && recipes.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-center py-12 bg-white rounded-lg shadow-md", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "mx-auto h-12 w-12 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }, void 0, false, {
            fileName: "app/routes/recettes._index.tsx",
            lineNumber: 386,
            columnNumber: 19
          }, this) }, void 0, false, {
            fileName: "app/routes/recettes._index.tsx",
            lineNumber: 385,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { className: "mt-2 text-lg font-medium text-gray-900", children: "Aucune recette trouv\xE9e" }, void 0, false, {
            fileName: "app/routes/recettes._index.tsx",
            lineNumber: 388,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-1 text-sm text-gray-500", children: "Essayez d'ajuster vos filtres pour voir plus de r\xE9sultats." }, void 0, false, {
            fileName: "app/routes/recettes._index.tsx",
            lineNumber: 389,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-6", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/recettes", className: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500", children: "Voir toutes les recettes" }, void 0, false, {
            fileName: "app/routes/recettes._index.tsx",
            lineNumber: 393,
            columnNumber: 19
          }, this) }, void 0, false, {
            fileName: "app/routes/recettes._index.tsx",
            lineNumber: 392,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/recettes._index.tsx",
          lineNumber: 384,
          columnNumber: 51
        }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 ${isLoading ? "opacity-50" : ""}`, children: recipes.map((recipe, k) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BoxRecipe, { recipe }, k, false, {
          fileName: "app/routes/recettes._index.tsx",
          lineNumber: 398,
          columnNumber: 45
        }, this)) }, void 0, false, {
          fileName: "app/routes/recettes._index.tsx",
          lineNumber: 397,
          columnNumber: 24
        }, this),
        pagination.totalPages > 1 && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("nav", { className: "flex justify-center mt-12", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", { className: "flex space-x-2", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Form, { method: "get", className: "inline-block", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "search", value: search }, void 0, false, {
              fileName: "app/routes/recettes._index.tsx",
              lineNumber: 408,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "difficulty", value: difficulty }, void 0, false, {
              fileName: "app/routes/recettes._index.tsx",
              lineNumber: 409,
              columnNumber: 23
            }, this),
            maxPreparationTime && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "maxPreparationTime", value: maxPreparationTime.toString() }, void 0, false, {
              fileName: "app/routes/recettes._index.tsx",
              lineNumber: 410,
              columnNumber: 46
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "sortBy", value: sortBy }, void 0, false, {
              fileName: "app/routes/recettes._index.tsx",
              lineNumber: 411,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "sortDirection", value: sortDirection }, void 0, false, {
              fileName: "app/routes/recettes._index.tsx",
              lineNumber: 412,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "page", value: (pagination.currentPage - 1).toString() }, void 0, false, {
              fileName: "app/routes/recettes._index.tsx",
              lineNumber: 413,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "submit", disabled: pagination.currentPage <= 1, className: `px-4 py-2 rounded-md ${pagination.currentPage <= 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"}`, children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M15 19l-7-7 7-7" }, void 0, false, {
              fileName: "app/routes/recettes._index.tsx",
              lineNumber: 417,
              columnNumber: 27
            }, this) }, void 0, false, {
              fileName: "app/routes/recettes._index.tsx",
              lineNumber: 416,
              columnNumber: 25
            }, this) }, void 0, false, {
              fileName: "app/routes/recettes._index.tsx",
              lineNumber: 415,
              columnNumber: 23
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/recettes._index.tsx",
            lineNumber: 406,
            columnNumber: 21
          }, this) }, void 0, false, {
            fileName: "app/routes/recettes._index.tsx",
            lineNumber: 405,
            columnNumber: 19
          }, this),
          [...Array(pagination.totalPages)].map((_, i) => {
            const pageNumber = i + 1;
            const shouldDisplay = pageNumber === 1 || pageNumber === pagination.totalPages || Math.abs(pageNumber - pagination.currentPage) <= 1;
            if (!shouldDisplay) {
              if (pageNumber === 2 || pageNumber === pagination.totalPages - 1) {
                return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { className: "px-1 flex items-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-gray-500", children: "..." }, void 0, false, {
                  fileName: "app/routes/recettes._index.tsx",
                  lineNumber: 434,
                  columnNumber: 29
                }, this) }, `ellipsis-${pageNumber}`, false, {
                  fileName: "app/routes/recettes._index.tsx",
                  lineNumber: 433,
                  columnNumber: 28
                }, this);
              }
              return null;
            }
            return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Form, { method: "get", className: "inline-block", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "search", value: search }, void 0, false, {
                fileName: "app/routes/recettes._index.tsx",
                lineNumber: 442,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "difficulty", value: difficulty }, void 0, false, {
                fileName: "app/routes/recettes._index.tsx",
                lineNumber: 443,
                columnNumber: 27
              }, this),
              maxPreparationTime && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "maxPreparationTime", value: maxPreparationTime.toString() }, void 0, false, {
                fileName: "app/routes/recettes._index.tsx",
                lineNumber: 444,
                columnNumber: 50
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "sortBy", value: sortBy }, void 0, false, {
                fileName: "app/routes/recettes._index.tsx",
                lineNumber: 445,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "sortDirection", value: sortDirection }, void 0, false, {
                fileName: "app/routes/recettes._index.tsx",
                lineNumber: 446,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "page", value: pageNumber.toString() }, void 0, false, {
                fileName: "app/routes/recettes._index.tsx",
                lineNumber: 447,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "submit", className: `w-10 h-10 rounded-md flex items-center justify-center ${pagination.currentPage === pageNumber ? "bg-rose-500 text-white font-semibold" : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"}`, children: pageNumber }, void 0, false, {
                fileName: "app/routes/recettes._index.tsx",
                lineNumber: 449,
                columnNumber: 27
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/recettes._index.tsx",
              lineNumber: 440,
              columnNumber: 25
            }, this) }, pageNumber, false, {
              fileName: "app/routes/recettes._index.tsx",
              lineNumber: 439,
              columnNumber: 24
            }, this);
          }),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Form, { method: "get", className: "inline-block", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "search", value: search }, void 0, false, {
              fileName: "app/routes/recettes._index.tsx",
              lineNumber: 460,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "difficulty", value: difficulty }, void 0, false, {
              fileName: "app/routes/recettes._index.tsx",
              lineNumber: 461,
              columnNumber: 23
            }, this),
            maxPreparationTime && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "maxPreparationTime", value: maxPreparationTime.toString() }, void 0, false, {
              fileName: "app/routes/recettes._index.tsx",
              lineNumber: 462,
              columnNumber: 46
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "sortBy", value: sortBy }, void 0, false, {
              fileName: "app/routes/recettes._index.tsx",
              lineNumber: 463,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "sortDirection", value: sortDirection }, void 0, false, {
              fileName: "app/routes/recettes._index.tsx",
              lineNumber: 464,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "page", value: (pagination.currentPage + 1).toString() }, void 0, false, {
              fileName: "app/routes/recettes._index.tsx",
              lineNumber: 465,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "submit", disabled: pagination.currentPage >= pagination.totalPages, className: `px-4 py-2 rounded-md ${pagination.currentPage >= pagination.totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"}`, children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M9 5l7 7-7 7" }, void 0, false, {
              fileName: "app/routes/recettes._index.tsx",
              lineNumber: 469,
              columnNumber: 27
            }, this) }, void 0, false, {
              fileName: "app/routes/recettes._index.tsx",
              lineNumber: 468,
              columnNumber: 25
            }, this) }, void 0, false, {
              fileName: "app/routes/recettes._index.tsx",
              lineNumber: 467,
              columnNumber: 23
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/recettes._index.tsx",
            lineNumber: 458,
            columnNumber: 21
          }, this) }, void 0, false, {
            fileName: "app/routes/recettes._index.tsx",
            lineNumber: 457,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/recettes._index.tsx",
          lineNumber: 403,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "app/routes/recettes._index.tsx",
          lineNumber: 402,
          columnNumber: 43
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/recettes._index.tsx",
        lineNumber: 371,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/recettes._index.tsx",
      lineNumber: 290,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/recettes._index.tsx",
    lineNumber: 278,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "app/routes/recettes._index.tsx",
    lineNumber: 277,
    columnNumber: 10
  }, this);
}
_s2(RecipesIndex, "DBBwLLze9pVXSQjhAUDYO7hj87I=", false, function() {
  return [useLoaderData, useNavigation, useSubmit, useDebounce];
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
//# sourceMappingURL=/build/routes/recettes._index-DNNN4ZVS.js.map
