import {
  require_jsx_dev_runtime
} from "/build/_shared/chunk-XGOTYLZ5.js";
import {
  useFetcher,
  useOutletContext
} from "/build/_shared/chunk-YHAWPGHG.js";
import {
  createHotContext
} from "/build/_shared/chunk-MCH5QMAS.js";
import {
  require_react
} from "/build/_shared/chunk-7M6SC7J5.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// app/components/BoxRecipe.tsx
var import_react3 = __toESM(require_react(), 1);

// app/components/RecipeModal.tsx
var import_react = __toESM(require_react(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/components/RecipeModal.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/components/RecipeModal.tsx"
  );
  import.meta.hot.lastModified = "1743359499002.4517";
}
function RecipeModal({
  recipeId,
  basicRecipe,
  isOpen,
  onClose,
  isAuthenticated = false
}) {
  _s();
  const modalRef = (0, import_react.useRef)(null);
  const [selectedTab, setSelectedTab] = (0, import_react.useState)("ingredients");
  const recipeDetailsFetcher = useFetcher();
  const favoriteFetcher = useFetcher();
  const menuFetcher = useFetcher();
  const recipe = recipeDetailsFetcher.data?.recipe || basicRecipe;
  const isLoading = recipeDetailsFetcher.state === "loading";
  const inFavorites = recipe?.isFavorite || false;
  const isAdded = recipe?.isInMenu || false;
  (0, import_react.useEffect)(() => {
    if (isOpen && recipeId) {
      recipeDetailsFetcher.load(`/api/recipes?id=${recipeId}`);
    }
  }, [isOpen, recipeId]);
  (0, import_react.useEffect)(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape")
        onClose();
    };
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);
  const handleAddToMenu = () => {
    menuFetcher.submit({
      recipeId: recipeId.toString()
    }, {
      method: "post",
      action: "/api/menu"
    });
  };
  const handleToggleFavorite = () => {
    favoriteFetcher.submit({
      recipeId: recipeId.toString(),
      action: inFavorites ? "remove" : "add"
    }, {
      method: "post",
      action: "/api/favorites"
    });
  };
  if (!isOpen || !recipe)
    return null;
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "fixed inset-0 bg-gray-500 bg-opacity-75 z-50 flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-white w-full h-full md:h-screen max-h-screen rounded-none shadow-xl overflow-hidden flex flex-col", ref: modalRef, children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "relative", children: [
      recipe.imageUrl ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "h-48 sm:h-64 w-full bg-cover bg-center", style: {
        backgroundImage: `url(${recipe.imageUrl})`
      }, children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "absolute inset-0 bg-gradient-to-t from-black opacity-60" }, void 0, false, {
        fileName: "app/components/RecipeModal.tsx",
        lineNumber: 104,
        columnNumber: 29
      }, this) }, void 0, false, {
        fileName: "app/components/RecipeModal.tsx",
        lineNumber: 101,
        columnNumber: 40
      }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "h-48 sm:h-64 w-full bg-gray-200 flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "w-16 h-16 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }, void 0, false, {
        fileName: "app/components/RecipeModal.tsx",
        lineNumber: 107,
        columnNumber: 33
      }, this) }, void 0, false, {
        fileName: "app/components/RecipeModal.tsx",
        lineNumber: 106,
        columnNumber: 29
      }, this) }, void 0, false, {
        fileName: "app/components/RecipeModal.tsx",
        lineNumber: 105,
        columnNumber: 34
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "absolute bottom-0 left-0 w-full p-6 text-white", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-2xl font-bold mb-2 text-shadow", children: recipe.title }, void 0, false, {
        fileName: "app/components/RecipeModal.tsx",
        lineNumber: 113,
        columnNumber: 25
      }, this) }, void 0, false, {
        fileName: "app/components/RecipeModal.tsx",
        lineNumber: 112,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: onClose, className: "absolute top-4 right-4 bg-white bg-opacity-80 p-2 rounded-full shadow-md hover:bg-opacity-100 transition-all", "aria-label": "Fermer", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "w-5 h-5 text-gray-800", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M6 18L18 6M6 6l12 12" }, void 0, false, {
        fileName: "app/components/RecipeModal.tsx",
        lineNumber: 119,
        columnNumber: 29
      }, this) }, void 0, false, {
        fileName: "app/components/RecipeModal.tsx",
        lineNumber: 118,
        columnNumber: 25
      }, this) }, void 0, false, {
        fileName: "app/components/RecipeModal.tsx",
        lineNumber: 117,
        columnNumber: 21
      }, this),
      isAuthenticated && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: handleToggleFavorite, disabled: favoriteFetcher.state !== "idle", className: "absolute top-4 left-4 bg-white bg-opacity-80 p-2 rounded-full shadow-md hover:bg-opacity-100 transition-all", "aria-label": inFavorites ? "Retirer des favoris" : "Ajouter aux favoris", children: favoriteFetcher.state !== "idle" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "w-5 h-5 animate-spin text-rose-500", fill: "none", viewBox: "0 0 24 24", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }, void 0, false, {
          fileName: "app/components/RecipeModal.tsx",
          lineNumber: 126,
          columnNumber: 37
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" }, void 0, false, {
          fileName: "app/components/RecipeModal.tsx",
          lineNumber: 127,
          columnNumber: 37
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/RecipeModal.tsx",
        lineNumber: 125,
        columnNumber: 65
      }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: `w-5 h-5 ${inFavorites ? "text-rose-500 fill-current" : "text-gray-500"}`, fill: inFavorites ? "currentColor" : "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" }, void 0, false, {
        fileName: "app/components/RecipeModal.tsx",
        lineNumber: 129,
        columnNumber: 37
      }, this) }, void 0, false, {
        fileName: "app/components/RecipeModal.tsx",
        lineNumber: 128,
        columnNumber: 42
      }, this) }, void 0, false, {
        fileName: "app/components/RecipeModal.tsx",
        lineNumber: 124,
        columnNumber: 41
      }, this),
      isAuthenticated && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: handleAddToMenu, disabled: menuFetcher.state !== "idle" || isAdded, className: `absolute top-4 left-16 bg-white bg-opacity-80 p-2 rounded-full shadow-md hover:bg-opacity-100 transition-all ${isAdded ? "border border-green-400 text-green-600" : "text-gray-700"}`, "aria-label": isAdded ? "D\xE9j\xE0 dans le menu" : "Ajouter au menu", children: menuFetcher.state !== "idle" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "w-5 h-5 animate-spin text-rose-500", fill: "none", viewBox: "0 0 24 24", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }, void 0, false, {
          fileName: "app/components/RecipeModal.tsx",
          lineNumber: 136,
          columnNumber: 37
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" }, void 0, false, {
          fileName: "app/components/RecipeModal.tsx",
          lineNumber: 137,
          columnNumber: 37
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/RecipeModal.tsx",
        lineNumber: 135,
        columnNumber: 61
      }, this) : isAdded ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "w-5 h-5 text-green-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" }, void 0, false, {
          fileName: "app/components/RecipeModal.tsx",
          lineNumber: 139,
          columnNumber: 37
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M9 14l2 2 4-4" }, void 0, false, {
          fileName: "app/components/RecipeModal.tsx",
          lineNumber: 140,
          columnNumber: 37
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/RecipeModal.tsx",
        lineNumber: 138,
        columnNumber: 52
      }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "w-5 h-5 text-gray-700", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" }, void 0, false, {
        fileName: "app/components/RecipeModal.tsx",
        lineNumber: 142,
        columnNumber: 37
      }, this) }, void 0, false, {
        fileName: "app/components/RecipeModal.tsx",
        lineNumber: 141,
        columnNumber: 42
      }, this) }, void 0, false, {
        fileName: "app/components/RecipeModal.tsx",
        lineNumber: 134,
        columnNumber: 41
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/RecipeModal.tsx",
      lineNumber: 100,
      columnNumber: 17
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "border-b border-gray-200 px-2 py-2", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex flex-wrap justify-around text-xs", children: [
      recipe.preparationTime && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "px-2 py-1 flex items-center", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "w-4 h-4 mr-1 text-gray-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" }, void 0, false, {
          fileName: "app/components/RecipeModal.tsx",
          lineNumber: 152,
          columnNumber: 37
        }, this) }, void 0, false, {
          fileName: "app/components/RecipeModal.tsx",
          lineNumber: 151,
          columnNumber: 33
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "font-medium", children: [
          recipe.preparationTime,
          " min"
        ] }, void 0, true, {
          fileName: "app/components/RecipeModal.tsx",
          lineNumber: 155,
          columnNumber: 37
        }, this) }, void 0, false, {
          fileName: "app/components/RecipeModal.tsx",
          lineNumber: 154,
          columnNumber: 33
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/RecipeModal.tsx",
        lineNumber: 150,
        columnNumber: 52
      }, this),
      recipe.cookingTime && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "px-2 py-1 flex items-center", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "w-4 h-4 mr-1 text-gray-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" }, void 0, false, {
            fileName: "app/components/RecipeModal.tsx",
            lineNumber: 161,
            columnNumber: 37
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" }, void 0, false, {
            fileName: "app/components/RecipeModal.tsx",
            lineNumber: 162,
            columnNumber: 37
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/RecipeModal.tsx",
          lineNumber: 160,
          columnNumber: 33
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "font-medium", children: recipe.cookingTime }, void 0, false, {
          fileName: "app/components/RecipeModal.tsx",
          lineNumber: 165,
          columnNumber: 37
        }, this) }, void 0, false, {
          fileName: "app/components/RecipeModal.tsx",
          lineNumber: 164,
          columnNumber: 33
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/RecipeModal.tsx",
        lineNumber: 159,
        columnNumber: 48
      }, this),
      recipe.difficulty && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "px-2 py-1 flex items-center", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "w-4 h-4 mr-1 text-gray-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M13 10V3L4 14h7v7l9-11h-7z" }, void 0, false, {
          fileName: "app/components/RecipeModal.tsx",
          lineNumber: 171,
          columnNumber: 37
        }, this) }, void 0, false, {
          fileName: "app/components/RecipeModal.tsx",
          lineNumber: 170,
          columnNumber: 33
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "font-medium", children: recipe.difficulty }, void 0, false, {
          fileName: "app/components/RecipeModal.tsx",
          lineNumber: 174,
          columnNumber: 37
        }, this) }, void 0, false, {
          fileName: "app/components/RecipeModal.tsx",
          lineNumber: 173,
          columnNumber: 33
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/RecipeModal.tsx",
        lineNumber: 169,
        columnNumber: 47
      }, this),
      recipe.servings && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "px-2 py-1 flex items-center", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "w-4 h-4 mr-1 text-gray-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" }, void 0, false, {
          fileName: "app/components/RecipeModal.tsx",
          lineNumber: 180,
          columnNumber: 37
        }, this) }, void 0, false, {
          fileName: "app/components/RecipeModal.tsx",
          lineNumber: 179,
          columnNumber: 33
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "font-medium", children: recipe.servings }, void 0, false, {
            fileName: "app/components/RecipeModal.tsx",
            lineNumber: 183,
            columnNumber: 37
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-gray-500 ml-1", children: [
            "portion",
            recipe.servings > 1 ? "s" : ""
          ] }, void 0, true, {
            fileName: "app/components/RecipeModal.tsx",
            lineNumber: 184,
            columnNumber: 37
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/RecipeModal.tsx",
          lineNumber: 182,
          columnNumber: 33
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/RecipeModal.tsx",
        lineNumber: 178,
        columnNumber: 45
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/RecipeModal.tsx",
      lineNumber: 149,
      columnNumber: 21
    }, this) }, void 0, false, {
      fileName: "app/components/RecipeModal.tsx",
      lineNumber: 148,
      columnNumber: 17
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex-1 overflow-hidden flex flex-col", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "border-b border-gray-200", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("nav", { className: "flex justify-between items-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: () => setSelectedTab("ingredients"), className: `py-4 px-4 font-medium text-sm focus:outline-none ${selectedTab === "ingredients" ? "border-b-2 border-rose-500 text-rose-500" : "text-gray-500 hover:text-gray-700"}`, children: "Ingr\xE9dients" }, void 0, false, {
          fileName: "app/components/RecipeModal.tsx",
          lineNumber: 195,
          columnNumber: 33
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: () => setSelectedTab("instructions"), className: `py-4 px-4 font-medium text-sm focus:outline-none ${selectedTab === "instructions" ? "border-b-2 border-rose-500 text-rose-500" : "text-gray-500 hover:text-gray-700"}`, children: "Instructions" }, void 0, false, {
          fileName: "app/components/RecipeModal.tsx",
          lineNumber: 198,
          columnNumber: 33
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: () => setSelectedTab("description"), className: `py-4 px-4 font-medium text-sm focus:outline-none ${selectedTab === "description" ? "border-b-2 border-rose-500 text-rose-500" : "text-gray-500 hover:text-gray-700"}`, children: "Description" }, void 0, false, {
          fileName: "app/components/RecipeModal.tsx",
          lineNumber: 201,
          columnNumber: 33
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/RecipeModal.tsx",
        lineNumber: 194,
        columnNumber: 29
      }, this) }, void 0, false, {
        fileName: "app/components/RecipeModal.tsx",
        lineNumber: 193,
        columnNumber: 25
      }, this) }, void 0, false, {
        fileName: "app/components/RecipeModal.tsx",
        lineNumber: 192,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "p-6 flex-1 overflow-y-auto", children: isLoading ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex justify-center items-center h-40", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "animate-spin h-10 w-10 text-rose-500", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }, void 0, false, {
          fileName: "app/components/RecipeModal.tsx",
          lineNumber: 212,
          columnNumber: 37
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" }, void 0, false, {
          fileName: "app/components/RecipeModal.tsx",
          lineNumber: 213,
          columnNumber: 37
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/RecipeModal.tsx",
        lineNumber: 211,
        columnNumber: 33
      }, this) }, void 0, false, {
        fileName: "app/components/RecipeModal.tsx",
        lineNumber: 210,
        columnNumber: 38
      }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
        selectedTab === "ingredients" && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-xl font-semibold mb-4", children: "Ingr\xE9dients" }, void 0, false, {
            fileName: "app/components/RecipeModal.tsx",
            lineNumber: 217,
            columnNumber: 41
          }, this),
          recipe.ingredients && recipe.ingredients.length > 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", { className: "space-y-2", children: recipe.ingredients.map((item, index) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { className: "flex items-center p-2 border-b border-gray-100 last:border-0", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "w-5 h-5 text-rose-500 mr-3 flex-shrink-0", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M5 13l4 4L19 7" }, void 0, false, {
              fileName: "app/components/RecipeModal.tsx",
              lineNumber: 221,
              columnNumber: 61
            }, this) }, void 0, false, {
              fileName: "app/components/RecipeModal.tsx",
              lineNumber: 220,
              columnNumber: 57
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [
              item.quantity && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "font-medium", children: [
                item.quantity,
                " "
              ] }, void 0, true, {
                fileName: "app/components/RecipeModal.tsx",
                lineNumber: 224,
                columnNumber: 79
              }, this),
              item.unit && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [
                item.unit,
                " de "
              ] }, void 0, true, {
                fileName: "app/components/RecipeModal.tsx",
                lineNumber: 225,
                columnNumber: 75
              }, this),
              item.ingredient.name
            ] }, void 0, true, {
              fileName: "app/components/RecipeModal.tsx",
              lineNumber: 223,
              columnNumber: 57
            }, this)
          ] }, index, true, {
            fileName: "app/components/RecipeModal.tsx",
            lineNumber: 219,
            columnNumber: 90
          }, this)) }, void 0, false, {
            fileName: "app/components/RecipeModal.tsx",
            lineNumber: 218,
            columnNumber: 96
          }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-gray-500 italic", children: "Aucun ingr\xE9dient n'est sp\xE9cifi\xE9 pour cette recette." }, void 0, false, {
            fileName: "app/components/RecipeModal.tsx",
            lineNumber: 229,
            columnNumber: 53
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/RecipeModal.tsx",
          lineNumber: 216,
          columnNumber: 67
        }, this),
        selectedTab === "instructions" && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-xl font-semibold mb-4", children: "Instructions" }, void 0, false, {
            fileName: "app/components/RecipeModal.tsx",
            lineNumber: 233,
            columnNumber: 41
          }, this),
          recipe.steps && recipe.steps.length > 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ol", { className: "space-y-6", children: recipe.steps.map((step) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { className: "flex", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "flex-shrink-0 w-8 h-8 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center font-bold mr-4", children: step.stepNumber }, void 0, false, {
              fileName: "app/components/RecipeModal.tsx",
              lineNumber: 236,
              columnNumber: 57
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "pt-1", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-gray-700", dangerouslySetInnerHTML: {
              __html: step.instruction
            } }, void 0, false, {
              fileName: "app/components/RecipeModal.tsx",
              lineNumber: 240,
              columnNumber: 61
            }, this) }, void 0, false, {
              fileName: "app/components/RecipeModal.tsx",
              lineNumber: 239,
              columnNumber: 57
            }, this)
          ] }, step.id, true, {
            fileName: "app/components/RecipeModal.tsx",
            lineNumber: 235,
            columnNumber: 75
          }, this)) }, void 0, false, {
            fileName: "app/components/RecipeModal.tsx",
            lineNumber: 234,
            columnNumber: 84
          }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-gray-500 italic", children: "Aucune instruction n'est sp\xE9cifi\xE9e pour cette recette." }, void 0, false, {
            fileName: "app/components/RecipeModal.tsx",
            lineNumber: 245,
            columnNumber: 53
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/RecipeModal.tsx",
          lineNumber: 232,
          columnNumber: 68
        }, this),
        selectedTab === "description" && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-xl font-semibold mb-4", children: "Description" }, void 0, false, {
            fileName: "app/components/RecipeModal.tsx",
            lineNumber: 249,
            columnNumber: 41
          }, this),
          recipe.description ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-m mb-3", dangerouslySetInnerHTML: {
            __html: recipe.description
          } }, void 0, false, {
            fileName: "app/components/RecipeModal.tsx",
            lineNumber: 250,
            columnNumber: 63
          }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-gray-500 italic", children: "Aucune description n'est sp\xE9cifi\xE9e pour cette recette." }, void 0, false, {
            fileName: "app/components/RecipeModal.tsx",
            lineNumber: 252,
            columnNumber: 23
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/RecipeModal.tsx",
          lineNumber: 248,
          columnNumber: 67
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/RecipeModal.tsx",
        lineNumber: 215,
        columnNumber: 38
      }, this) }, void 0, false, {
        fileName: "app/components/RecipeModal.tsx",
        lineNumber: 209,
        columnNumber: 21
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/RecipeModal.tsx",
      lineNumber: 191,
      columnNumber: 17
    }, this),
    recipe.sourceUrl && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "px-6 py-2 text-xs text-center text-gray-500 border-t", children: [
      "Voir la recette sur ",
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", { href: recipe.sourceUrl, target: "_blank", rel: "noopener noreferrer", className: "text-rose-500 hover:underline", onClick: (e) => e.stopPropagation(), children: new URL(recipe.sourceUrl).hostname }, void 0, false, {
        fileName: "app/components/RecipeModal.tsx",
        lineNumber: 260,
        columnNumber: 45
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/RecipeModal.tsx",
      lineNumber: 259,
      columnNumber: 38
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/RecipeModal.tsx",
    lineNumber: 98,
    columnNumber: 13
  }, this) }, void 0, false, {
    fileName: "app/components/RecipeModal.tsx",
    lineNumber: 97,
    columnNumber: 10
  }, this);
}
_s(RecipeModal, "+p7QFyDjcbbe2MM+JE4F8MULELk=", false, function() {
  return [useFetcher, useFetcher, useFetcher];
});
_c = RecipeModal;
var _c;
$RefreshReg$(_c, "RecipeModal");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/components/BoxRecipe.tsx
var import_jsx_dev_runtime2 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/components/BoxRecipe.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s2 = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/components/BoxRecipe.tsx"
  );
  import.meta.hot.lastModified = "1743359089145.0188";
}
function BoxRecipe({
  recipe,
  readOnly = false
}) {
  _s2();
  const [isModalOpen, setIsModalOpen] = (0, import_react3.useState)(false);
  const {
    isAuthenticated
  } = useOutletContext() || {
    isAuthenticated: false
  };
  return /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(import_jsx_dev_runtime2.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(
      "div",
      {
        className: "bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col cursor-pointer hover:shadow-lg transition-shadow",
        onClick: () => setIsModalOpen(true),
        children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "relative h-44", children: [
            recipe.imageUrl ? /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "h-full w-full bg-cover bg-center", style: {
              backgroundImage: `url(${recipe.imageUrl})`
            } }, void 0, false, {
              fileName: "app/components/BoxRecipe.tsx",
              lineNumber: 42,
              columnNumber: 40
            }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "h-full w-full bg-gray-200 flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("svg", { className: "w-12 h-12 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }, void 0, false, {
              fileName: "app/components/BoxRecipe.tsx",
              lineNumber: 46,
              columnNumber: 33
            }, this) }, void 0, false, {
              fileName: "app/components/BoxRecipe.tsx",
              lineNumber: 45,
              columnNumber: 29
            }, this) }, void 0, false, {
              fileName: "app/components/BoxRecipe.tsx",
              lineNumber: 44,
              columnNumber: 21
            }, this),
            recipe.note && /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "absolute top-2 left-2 bg-white bg-opacity-90 text-amber-500 font-semibold text-sm rounded-md px-2 py-1 flex items-center", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("svg", { className: "w-4 h-4 mr-1", fill: "currentColor", viewBox: "0 0 20 20", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("path", { d: "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" }, void 0, false, {
                fileName: "app/components/BoxRecipe.tsx",
                lineNumber: 53,
                columnNumber: 33
              }, this) }, void 0, false, {
                fileName: "app/components/BoxRecipe.tsx",
                lineNumber: 52,
                columnNumber: 29
              }, this),
              recipe.note
            ] }, void 0, true, {
              fileName: "app/components/BoxRecipe.tsx",
              lineNumber: 51,
              columnNumber: 37
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/BoxRecipe.tsx",
            lineNumber: 41,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "p-4 flex-1 flex flex-col", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("h3", { className: "text-lg font-semibold mb-1 text-gray-900", children: recipe.title }, void 0, false, {
              fileName: "app/components/BoxRecipe.tsx",
              lineNumber: 61,
              columnNumber: 21
            }, this),
            recipe.description && /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "text-sm text-gray-600 mb-3 line-clamp-2", dangerouslySetInnerHTML: {
              __html: recipe.description
            } }, void 0, false, {
              fileName: "app/components/BoxRecipe.tsx",
              lineNumber: 63,
              columnNumber: 44
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "mt-auto flex justify-between text-xs text-gray-500", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { children: recipe.preparationTime && /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("span", { children: [
                recipe.preparationTime,
                " min"
              ] }, void 0, true, {
                fileName: "app/components/BoxRecipe.tsx",
                lineNumber: 69,
                columnNumber: 56
              }, this) }, void 0, false, {
                fileName: "app/components/BoxRecipe.tsx",
                lineNumber: 68,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { children: recipe.difficulty }, void 0, false, {
                fileName: "app/components/BoxRecipe.tsx",
                lineNumber: 71,
                columnNumber: 25
              }, this)
            ] }, void 0, true, {
              fileName: "app/components/BoxRecipe.tsx",
              lineNumber: 67,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/BoxRecipe.tsx",
            lineNumber: 60,
            columnNumber: 17
          }, this)
        ]
      },
      void 0,
      true,
      {
        fileName: "app/components/BoxRecipe.tsx",
        lineNumber: 38,
        columnNumber: 13
      },
      this
    ),
    isModalOpen && /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(RecipeModal, { recipeId: recipe.id, basicRecipe: recipe, isOpen: isModalOpen, onClose: () => setIsModalOpen(false), isAuthenticated }, void 0, false, {
      fileName: "app/components/BoxRecipe.tsx",
      lineNumber: 77,
      columnNumber: 29
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/BoxRecipe.tsx",
    lineNumber: 37,
    columnNumber: 10
  }, this);
}
_s2(BoxRecipe, "24cO3GLf56qUceudp+MxnBLsLlk=", false, function() {
  return [useOutletContext];
});
_c2 = BoxRecipe;
var _c2;
$RefreshReg$(_c2, "BoxRecipe");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

export {
  BoxRecipe
};
//# sourceMappingURL=/build/_shared/chunk-62M4QYSS.js.map
