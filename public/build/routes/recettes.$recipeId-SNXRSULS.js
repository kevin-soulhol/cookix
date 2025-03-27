import {
  Layout
} from "/build/_shared/chunk-7EYIA7FC.js";
import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
  Link,
  useFetcher,
  useLoaderData,
  useOutletContext
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

// app/routes/recettes.$recipeId.tsx
var import_node = __toESM(require_node(), 1);
var import_react2 = __toESM(require_react(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/recettes.$recipeId.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/recettes.$recipeId.tsx"
  );
  import.meta.hot.lastModified = "1743069603025.3616";
}
var meta = ({
  data
}) => {
  if (!data?.recipe) {
    return [{
      title: "Recette non trouv\xE9e - Cookix"
    }, {
      name: "description",
      content: "Cette recette n'existe pas ou a \xE9t\xE9 supprim\xE9e."
    }];
  }
  return [{
    title: `${data.recipe.title} - Cookix`
  }, {
    name: "description",
    content: data.recipe.description || `D\xE9couvrez la recette de ${data.recipe.title}`
  }];
};
function RecipeDetail() {
  _s();
  const {
    isAuthenticated
  } = useOutletContext() || {
    isAuthenticated: false
  };
  const {
    recipe,
    error
  } = useLoaderData();
  const [selectedTab, setSelectedTab] = (0, import_react2.useState)("ingredients");
  const [inFavorites, setInFavorites] = (0, import_react2.useState)(recipe.isFavorite);
  const [isAddingToMenu, setIsAddingToMenu] = (0, import_react2.useState)(false);
  const [isAdded, setIsAdded] = (0, import_react2.useState)(recipe.isInMenu);
  const favoriteFetcher = useFetcher();
  const isTogglingFavoriteInProgress = favoriteFetcher.state === "submitting";
  const menuFetcher = useFetcher();
  const isAddingToMenuInProgress = menuFetcher.state === "submitting";
  (0, import_react2.useEffect)(() => {
    if (menuFetcher.state === "idle" && menuFetcher.data) {
      setIsAdded(true);
    }
  }, [menuFetcher]);
  if (menuFetcher.state === "idle" && isAddingToMenu && isAddingToMenuInProgress) {
    setIsAddingToMenu(false);
  }
  const handleAddToMenu = async () => {
    setIsAddingToMenu(true);
    menuFetcher.submit({
      recipeId: recipe.id.toString()
    }, {
      method: "post",
      action: "/api/menu"
    });
  };
  const handleToggleFavorite = () => {
    setInFavorites(!inFavorites);
    favoriteFetcher.submit({
      recipeId: recipe.id.toString(),
      action: inFavorites ? "remove" : "add"
    }, {
      method: "post",
      action: "/api/favorites"
    });
  };
  if (error) {
    return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-white rounded-lg shadow-md p-8 max-w-xl w-full text-center", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "w-16 h-16 text-rose-500 mx-auto mb-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" }, void 0, false, {
        fileName: "app/routes/recettes.$recipeId.tsx",
        lineNumber: 140,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "app/routes/recettes.$recipeId.tsx",
        lineNumber: 139,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-2xl font-bold text-gray-800 mb-4", children: error }, void 0, false, {
        fileName: "app/routes/recettes.$recipeId.tsx",
        lineNumber: 142,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-gray-600 mb-6", children: "La recette que vous recherchez n'existe pas ou a \xE9t\xE9 supprim\xE9e." }, void 0, false, {
        fileName: "app/routes/recettes.$recipeId.tsx",
        lineNumber: 143,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/recettes", className: "inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-sm", children: "Voir toutes les recettes" }, void 0, false, {
        fileName: "app/routes/recettes.$recipeId.tsx",
        lineNumber: 146,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/recettes.$recipeId.tsx",
      lineNumber: 138,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/recettes.$recipeId.tsx",
      lineNumber: 137,
      columnNumber: 12
    }, this);
  }
  if (!recipe) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Layout, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-white rounded-lg shadow-md overflow-hidden", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "relative", children: [
      recipe.imageUrl ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "h-64 sm:h-96 w-full bg-cover bg-center", style: {
        backgroundImage: `url(${recipe.imageUrl})`
      }, children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "absolute inset-0 bg-gradient-to-t from-black opacity-60" }, void 0, false, {
        fileName: "app/routes/recettes.$recipeId.tsx",
        lineNumber: 163,
        columnNumber: 17
      }, this) }, void 0, false, {
        fileName: "app/routes/recettes.$recipeId.tsx",
        lineNumber: 160,
        columnNumber: 32
      }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "h-64 sm:h-96 w-full bg-gray-200 flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "w-24 h-24 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }, void 0, false, {
        fileName: "app/routes/recettes.$recipeId.tsx",
        lineNumber: 166,
        columnNumber: 19
      }, this) }, void 0, false, {
        fileName: "app/routes/recettes.$recipeId.tsx",
        lineNumber: 165,
        columnNumber: 17
      }, this) }, void 0, false, {
        fileName: "app/routes/recettes.$recipeId.tsx",
        lineNumber: 164,
        columnNumber: 24
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "absolute bottom-0 left-0 w-full p-6 text-white", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-3xl font-bold mb-2 text-shadow", children: recipe.title }, void 0, false, {
        fileName: "app/routes/recettes.$recipeId.tsx",
        lineNumber: 172,
        columnNumber: 15
      }, this) }, void 0, false, {
        fileName: "app/routes/recettes.$recipeId.tsx",
        lineNumber: 171,
        columnNumber: 13
      }, this),
      isAuthenticated && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: handleToggleFavorite, disabled: isTogglingFavoriteInProgress, className: "absolute top-4 left-4 bg-white bg-opacity-80 p-2 rounded-full shadow-md hover:bg-opacity-100 transition-all", "aria-label": inFavorites ? "Retirer des favoris" : "Ajouter aux favoris", children: isTogglingFavoriteInProgress ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "w-5 h-5 animate-spin text-rose-500", fill: "none", viewBox: "0 0 24 24", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }, void 0, false, {
          fileName: "app/routes/recettes.$recipeId.tsx",
          lineNumber: 178,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" }, void 0, false, {
          fileName: "app/routes/recettes.$recipeId.tsx",
          lineNumber: 179,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/recettes.$recipeId.tsx",
        lineNumber: 177,
        columnNumber: 49
      }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: `w-5 h-5 ${inFavorites ? "text-rose-500 fill-current" : "text-gray-500"}`, fill: inFavorites ? "currentColor" : "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" }, void 0, false, {
        fileName: "app/routes/recettes.$recipeId.tsx",
        lineNumber: 181,
        columnNumber: 21
      }, this) }, void 0, false, {
        fileName: "app/routes/recettes.$recipeId.tsx",
        lineNumber: 180,
        columnNumber: 28
      }, this) }, void 0, false, {
        fileName: "app/routes/recettes.$recipeId.tsx",
        lineNumber: 176,
        columnNumber: 33
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/recettes.$recipeId.tsx",
      lineNumber: 159,
      columnNumber: 11
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "border-b border-gray-200", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "grid grid-cols-2 sm:grid-cols-4 divide-x divide-gray-200", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "p-4 text-center", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "block text-sm text-gray-500", children: "Pr\xE9paration" }, void 0, false, {
          fileName: "app/routes/recettes.$recipeId.tsx",
          lineNumber: 190,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-lg font-semibold", children: recipe.preparationTime ? `${recipe.preparationTime} min` : "Non sp\xE9cifi\xE9" }, void 0, false, {
          fileName: "app/routes/recettes.$recipeId.tsx",
          lineNumber: 191,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/recettes.$recipeId.tsx",
        lineNumber: 189,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "p-4 text-center", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "block text-sm text-gray-500", children: "Cuisson" }, void 0, false, {
          fileName: "app/routes/recettes.$recipeId.tsx",
          lineNumber: 196,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-lg font-semibold", children: recipe.cookingTime ? `${recipe.cookingTime} min` : "Non sp\xE9cifi\xE9" }, void 0, false, {
          fileName: "app/routes/recettes.$recipeId.tsx",
          lineNumber: 197,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/recettes.$recipeId.tsx",
        lineNumber: 195,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "p-4 text-center", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "block text-sm text-gray-500", children: "Difficult\xE9" }, void 0, false, {
          fileName: "app/routes/recettes.$recipeId.tsx",
          lineNumber: 202,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-lg font-semibold", children: recipe.difficulty || "Non sp\xE9cifi\xE9e" }, void 0, false, {
          fileName: "app/routes/recettes.$recipeId.tsx",
          lineNumber: 203,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/recettes.$recipeId.tsx",
        lineNumber: 201,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "p-4 text-center", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "block text-sm text-gray-500", children: "Portions" }, void 0, false, {
          fileName: "app/routes/recettes.$recipeId.tsx",
          lineNumber: 208,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-lg font-semibold", children: recipe.servings ? `${recipe.servings}` : "Non sp\xE9cifi\xE9" }, void 0, false, {
          fileName: "app/routes/recettes.$recipeId.tsx",
          lineNumber: 209,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/recettes.$recipeId.tsx",
        lineNumber: 207,
        columnNumber: 15
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/recettes.$recipeId.tsx",
      lineNumber: 188,
      columnNumber: 13
    }, this) }, void 0, false, {
      fileName: "app/routes/recettes.$recipeId.tsx",
      lineNumber: 187,
      columnNumber: 11
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "border-b border-gray-200", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("nav", { className: "flex justify-between items-center", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: () => setSelectedTab("ingredients"), className: `py-4 px-6 font-medium text-sm focus:outline-none ${selectedTab === "ingredients" ? "border-b-2 border-rose-500 text-rose-500" : "text-gray-500 hover:text-gray-700"}`, children: "Ingr\xE9dients" }, void 0, false, {
            fileName: "app/routes/recettes.$recipeId.tsx",
            lineNumber: 221,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: () => setSelectedTab("instructions"), className: `py-4 px-6 font-medium text-sm focus:outline-none ${selectedTab === "instructions" ? "border-b-2 border-rose-500 text-rose-500" : "text-gray-500 hover:text-gray-700"}`, children: "Instructions" }, void 0, false, {
            fileName: "app/routes/recettes.$recipeId.tsx",
            lineNumber: 224,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: () => setSelectedTab("description"), className: `py-4 px-6 font-medium text-sm focus:outline-none ${selectedTab === "description" ? "border-b-2 border-rose-500 text-rose-500" : "text-gray-500 hover:text-gray-700"}`, children: "Description" }, void 0, false, {
            fileName: "app/routes/recettes.$recipeId.tsx",
            lineNumber: 227,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/recettes.$recipeId.tsx",
          lineNumber: 220,
          columnNumber: 17
        }, this),
        isAuthenticated && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center gap-2 px-4", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: handleAddToMenu, disabled: isAddingToMenuInProgress || isAdded, className: `inline-flex items-center px-3 py-1.5 border border-teal-500 rounded-md text-teal-500 transition-colors text-sm ${isAdded ? "bg-teal-600 text-white" : "bg-white hover:bg-teal-50"}`, children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "w-4 h-4 mr-1", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" }, void 0, false, {
            fileName: "app/routes/recettes.$recipeId.tsx",
            lineNumber: 236,
            columnNumber: 25
          }, this) }, void 0, false, {
            fileName: "app/routes/recettes.$recipeId.tsx",
            lineNumber: 235,
            columnNumber: 23
          }, this),
          isAdded ? "D\xE9j\xE0 dans le menu" : "Ajouter au menu"
        ] }, void 0, true, {
          fileName: "app/routes/recettes.$recipeId.tsx",
          lineNumber: 234,
          columnNumber: 21
        }, this) }, void 0, false, {
          fileName: "app/routes/recettes.$recipeId.tsx",
          lineNumber: 233,
          columnNumber: 37
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/recettes.$recipeId.tsx",
        lineNumber: 219,
        columnNumber: 15
      }, this) }, void 0, false, {
        fileName: "app/routes/recettes.$recipeId.tsx",
        lineNumber: 218,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "p-6", children: [
        selectedTab === "ingredients" && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-xl font-semibold mb-4", children: "Ingr\xE9dients" }, void 0, false, {
            fileName: "app/routes/recettes.$recipeId.tsx",
            lineNumber: 247,
            columnNumber: 19
          }, this),
          recipe.ingredients && recipe.ingredients.length > 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", { className: "space-y-2", children: recipe.ingredients.map((item, index) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { className: "flex items-center p-2 border-b border-gray-100 last:border-0", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "w-5 h-5 text-rose-500 mr-3 flex-shrink-0", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M5 13l4 4L19 7" }, void 0, false, {
              fileName: "app/routes/recettes.$recipeId.tsx",
              lineNumber: 251,
              columnNumber: 29
            }, this) }, void 0, false, {
              fileName: "app/routes/recettes.$recipeId.tsx",
              lineNumber: 250,
              columnNumber: 27
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [
              item.quantity && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "font-medium", children: [
                item.quantity,
                " "
              ] }, void 0, true, {
                fileName: "app/routes/recettes.$recipeId.tsx",
                lineNumber: 254,
                columnNumber: 47
              }, this),
              item.unit && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [
                item.unit,
                " de "
              ] }, void 0, true, {
                fileName: "app/routes/recettes.$recipeId.tsx",
                lineNumber: 255,
                columnNumber: 43
              }, this),
              item.ingredient.name
            ] }, void 0, true, {
              fileName: "app/routes/recettes.$recipeId.tsx",
              lineNumber: 253,
              columnNumber: 27
            }, this)
          ] }, index, true, {
            fileName: "app/routes/recettes.$recipeId.tsx",
            lineNumber: 249,
            columnNumber: 64
          }, this)) }, void 0, false, {
            fileName: "app/routes/recettes.$recipeId.tsx",
            lineNumber: 248,
            columnNumber: 74
          }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-gray-500 italic", children: "Aucun ingr\xE9dient n'est sp\xE9cifi\xE9 pour cette recette." }, void 0, false, {
            fileName: "app/routes/recettes.$recipeId.tsx",
            lineNumber: 259,
            columnNumber: 29
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/recettes.$recipeId.tsx",
          lineNumber: 246,
          columnNumber: 49
        }, this),
        selectedTab === "instructions" && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-xl font-semibold mb-4", children: "Instructions" }, void 0, false, {
            fileName: "app/routes/recettes.$recipeId.tsx",
            lineNumber: 263,
            columnNumber: 19
          }, this),
          recipe.steps && recipe.steps.length > 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ol", { className: "space-y-6", children: recipe.steps.map((step) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { className: "flex", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "flex-shrink-0 w-8 h-8 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center font-bold mr-4", children: step.stepNumber }, void 0, false, {
              fileName: "app/routes/recettes.$recipeId.tsx",
              lineNumber: 266,
              columnNumber: 27
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "pt-1", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-gray-700", children: step.instruction }, void 0, false, {
              fileName: "app/routes/recettes.$recipeId.tsx",
              lineNumber: 270,
              columnNumber: 29
            }, this) }, void 0, false, {
              fileName: "app/routes/recettes.$recipeId.tsx",
              lineNumber: 269,
              columnNumber: 27
            }, this)
          ] }, step.id, true, {
            fileName: "app/routes/recettes.$recipeId.tsx",
            lineNumber: 265,
            columnNumber: 49
          }, this)) }, void 0, false, {
            fileName: "app/routes/recettes.$recipeId.tsx",
            lineNumber: 264,
            columnNumber: 62
          }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-gray-500 italic", children: "Aucune instruction n'est sp\xE9cifi\xE9e pour cette recette." }, void 0, false, {
            fileName: "app/routes/recettes.$recipeId.tsx",
            lineNumber: 273,
            columnNumber: 29
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/recettes.$recipeId.tsx",
          lineNumber: 262,
          columnNumber: 50
        }, this),
        selectedTab === "description" && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-xl font-semibold mb-4", children: "Description" }, void 0, false, {
            fileName: "app/routes/recettes.$recipeId.tsx",
            lineNumber: 277,
            columnNumber: 19
          }, this),
          recipe.description ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-m mb-3", children: recipe.description }, void 0, false, {
            fileName: "app/routes/recettes.$recipeId.tsx",
            lineNumber: 278,
            columnNumber: 41
          }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-gray-500 italic", children: "Aucune description n'est sp\xE9cifi\xE9e pour cette recette." }, void 0, false, {
            fileName: "app/routes/recettes.$recipeId.tsx",
            lineNumber: 278,
            columnNumber: 95
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/recettes.$recipeId.tsx",
          lineNumber: 276,
          columnNumber: 49
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/recettes.$recipeId.tsx",
        lineNumber: 245,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/recettes.$recipeId.tsx",
      lineNumber: 217,
      columnNumber: 11
    }, this),
    recipe.sourceUrl && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "p-4 text-sm text-center text-gray-500 border-t", children: [
      "Voir la recette sur ",
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", { href: recipe.sourceUrl, target: "_blank", rel: "noopener noreferrer", className: "text-rose-500 hover:underline", children: new URL(recipe.sourceUrl).hostname }, void 0, false, {
        fileName: "app/routes/recettes.$recipeId.tsx",
        lineNumber: 285,
        columnNumber: 35
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/recettes.$recipeId.tsx",
      lineNumber: 284,
      columnNumber: 32
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/recettes.$recipeId.tsx",
    lineNumber: 157,
    columnNumber: 9
  }, this) }, void 0, false, {
    fileName: "app/routes/recettes.$recipeId.tsx",
    lineNumber: 156,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "app/routes/recettes.$recipeId.tsx",
    lineNumber: 155,
    columnNumber: 10
  }, this);
}
_s(RecipeDetail, "JuR9xaVwwPINwHNyzP3QAzQ8uD4=", false, function() {
  return [useOutletContext, useLoaderData, useFetcher, useFetcher];
});
_c = RecipeDetail;
var _c;
$RefreshReg$(_c, "RecipeDetail");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  RecipeDetail as default,
  meta
};
//# sourceMappingURL=/build/routes/recettes.$recipeId-SNXRSULS.js.map
