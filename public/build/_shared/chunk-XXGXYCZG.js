import {
  Link,
  useFetcher,
  useLocation,
  useOutletContext
} from "/build/_shared/chunk-YHAWPGHG.js";
import {
  require_jsx_dev_runtime
} from "/build/_shared/chunk-XGOTYLZ5.js";
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
var import_react2 = __toESM(require_react(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
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
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/components/BoxRecipe.tsx"
  );
  import.meta.hot.lastModified = "1743084690644.0977";
}
function BoxRecipe({
  recipe
}) {
  _s();
  const location = useLocation();
  const {
    isAuthenticated
  } = useOutletContext() || {
    isAuthenticated: false
  };
  const [isAddingToMenu, setIsAddingToMenu] = (0, import_react2.useState)(false);
  const [inFavorites, setInFavorites] = (0, import_react2.useState)(recipe.isFavorite);
  const [isAdded, setIsAdded] = (0, import_react2.useState)(recipe.isInMenu);
  const menuFetcher = useFetcher();
  const favoriteFetcher = useFetcher();
  const isAddingToMenuInProgress = menuFetcher.state === "submitting";
  const isTogglingFavoriteInProgress = favoriteFetcher.state === "submitting";
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
  (0, import_react2.useEffect)(() => {
    if (menuFetcher.state === "idle" && menuFetcher.data) {
      setIsAdded(true);
    }
  }, [menuFetcher]);
  if (menuFetcher.state === "idle" && isAddingToMenu && isAddingToMenuInProgress) {
    setIsAddingToMenu(false);
  }
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: `/recettes/${recipe.id}`, className: "text-rose-500 hover:text-rose-700 font-medium text-sm items-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("article", { className: "bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-lg flex flex-col h-full", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "relative", children: [
      recipe.imageUrl ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "h-48 bg-cover bg-center", style: {
        backgroundImage: `url(${recipe.imageUrl})`
      }, children: recipe.difficulty && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "absolute top-4 right-4 bg-black bg-opacity-70 text-white text-xs font-semibold px-2 py-1 rounded", children: recipe.difficulty }, void 0, false, {
        fileName: "app/components/BoxRecipe.tsx",
        lineNumber: 83,
        columnNumber: 51
      }, this) }, void 0, false, {
        fileName: "app/components/BoxRecipe.tsx",
        lineNumber: 80,
        columnNumber: 40
      }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "h-48 bg-gray-200 flex items-center justify-center", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "w-16 h-16 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }, void 0, false, {
          fileName: "app/components/BoxRecipe.tsx",
          lineNumber: 88,
          columnNumber: 33
        }, this) }, void 0, false, {
          fileName: "app/components/BoxRecipe.tsx",
          lineNumber: 87,
          columnNumber: 29
        }, this),
        recipe.difficulty && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "absolute top-4 right-4 bg-black bg-opacity-70 text-white text-xs font-semibold px-2 py-1 rounded", children: recipe.difficulty }, void 0, false, {
          fileName: "app/components/BoxRecipe.tsx",
          lineNumber: 90,
          columnNumber: 51
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/BoxRecipe.tsx",
        lineNumber: 86,
        columnNumber: 34
      }, this),
      isAuthenticated && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: handleToggleFavorite, disabled: isTogglingFavoriteInProgress, className: "absolute top-4 left-4 bg-white bg-opacity-80 p-2 rounded-full shadow-md hover:bg-opacity-100 transition-all", "aria-label": inFavorites ? "Retirer des favoris" : "Ajouter aux favoris", children: isTogglingFavoriteInProgress ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "w-5 h-5 animate-spin text-rose-500", fill: "none", viewBox: "0 0 24 24", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }, void 0, false, {
          fileName: "app/components/BoxRecipe.tsx",
          lineNumber: 98,
          columnNumber: 37
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" }, void 0, false, {
          fileName: "app/components/BoxRecipe.tsx",
          lineNumber: 99,
          columnNumber: 37
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/BoxRecipe.tsx",
        lineNumber: 97,
        columnNumber: 61
      }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: `w-5 h-5 ${inFavorites ? "text-rose-500 fill-current" : "text-gray-500"}`, fill: inFavorites ? "currentColor" : "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" }, void 0, false, {
        fileName: "app/components/BoxRecipe.tsx",
        lineNumber: 101,
        columnNumber: 37
      }, this) }, void 0, false, {
        fileName: "app/components/BoxRecipe.tsx",
        lineNumber: 100,
        columnNumber: 42
      }, this) }, void 0, false, {
        fileName: "app/components/BoxRecipe.tsx",
        lineNumber: 96,
        columnNumber: 41
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/BoxRecipe.tsx",
      lineNumber: 79,
      columnNumber: 17
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "p-5 flex flex-col flex-grow", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { className: "font-bold text-lg mb-2 h-14 overflow-hidden leading-tight", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "line-clamp-2 text-gray-900", children: recipe.title }, void 0, false, {
        fileName: "app/components/BoxRecipe.tsx",
        lineNumber: 109,
        columnNumber: 25
      }, this) }, void 0, false, {
        fileName: "app/components/BoxRecipe.tsx",
        lineNumber: 108,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-between text-sm text-gray-500 mb-3 h-6", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center", children: [
        recipe.preparationTime ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "flex items-center mr-3", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "w-4 h-4 mr-1", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" }, void 0, false, {
            fileName: "app/components/BoxRecipe.tsx",
            lineNumber: 119,
            columnNumber: 41
          }, this) }, void 0, false, {
            fileName: "app/components/BoxRecipe.tsx",
            lineNumber: 118,
            columnNumber: 37
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [
            recipe.preparationTime,
            " min"
          ] }, void 0, true, {
            fileName: "app/components/BoxRecipe.tsx",
            lineNumber: 121,
            columnNumber: 37
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/BoxRecipe.tsx",
          lineNumber: 117,
          columnNumber: 55
        }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "flex items-center mr-3 opacity-0", children: "-" }, void 0, false, {
          fileName: "app/components/BoxRecipe.tsx",
          lineNumber: 122,
          columnNumber: 43
        }, this),
        recipe.cookingTime ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "flex items-center", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "w-4 h-4 mr-1", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7a2 2 0 002 2z" }, void 0, false, {
            fileName: "app/components/BoxRecipe.tsx",
            lineNumber: 126,
            columnNumber: 41
          }, this) }, void 0, false, {
            fileName: "app/components/BoxRecipe.tsx",
            lineNumber: 125,
            columnNumber: 37
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [
            recipe.cookingTime,
            " min"
          ] }, void 0, true, {
            fileName: "app/components/BoxRecipe.tsx",
            lineNumber: 128,
            columnNumber: 37
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/BoxRecipe.tsx",
          lineNumber: 124,
          columnNumber: 51
        }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "flex items-center opacity-0", children: "-" }, void 0, false, {
          fileName: "app/components/BoxRecipe.tsx",
          lineNumber: 129,
          columnNumber: 43
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/BoxRecipe.tsx",
        lineNumber: 116,
        columnNumber: 25
      }, this) }, void 0, false, {
        fileName: "app/components/BoxRecipe.tsx",
        lineNumber: 115,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center h-6 text-sm mt-1", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center", children: [
        [1, 2, 3, 4, 5].map((star) => {
          const noteValue = recipe.note || 0;
          const isFullStar = star <= Math.floor(noteValue);
          const isHalfStar = !isFullStar && star <= Math.ceil(noteValue) && noteValue % 1 >= 0.5;
          return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "relative inline-block w-4 h-4", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "w-4 h-4 text-gray-300 fill-current absolute", viewBox: "0 0 20 20", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { d: "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" }, void 0, false, {
              fileName: "app/components/BoxRecipe.tsx",
              lineNumber: 143,
              columnNumber: 45
            }, this) }, void 0, false, {
              fileName: "app/components/BoxRecipe.tsx",
              lineNumber: 142,
              columnNumber: 41
            }, this),
            (isFullStar || isHalfStar) && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "w-4 h-4 text-yellow-500 fill-current absolute", viewBox: "0 0 20 20", xmlns: "http://www.w3.org/2000/svg", style: {
              clipPath: isHalfStar ? "polygon(0 0, 50% 0, 50% 100%, 0 100%)" : "none"
            }, children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { d: "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" }, void 0, false, {
              fileName: "app/components/BoxRecipe.tsx",
              lineNumber: 150,
              columnNumber: 49
            }, this) }, void 0, false, {
              fileName: "app/components/BoxRecipe.tsx",
              lineNumber: 147,
              columnNumber: 72
            }, this)
          ] }, star, true, {
            fileName: "app/components/BoxRecipe.tsx",
            lineNumber: 140,
            columnNumber: 22
          }, this);
        }),
        (recipe.note || recipe.voteNumber) && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "ml-1 text-gray-500", children: [
          recipe.note,
          " - (",
          recipe.voteNumber || 0,
          ")"
        ] }, void 0, true, {
          fileName: "app/components/BoxRecipe.tsx",
          lineNumber: 154,
          columnNumber: 68
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/BoxRecipe.tsx",
        lineNumber: 135,
        columnNumber: 25
      }, this) }, void 0, false, {
        fileName: "app/components/BoxRecipe.tsx",
        lineNumber: 134,
        columnNumber: 21
      }, this),
      recipe.description && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-gray-600 text-sm mb-4 line-clamp-3 flex-grow", children: recipe.description }, void 0, false, {
        fileName: "app/components/BoxRecipe.tsx",
        lineNumber: 161,
        columnNumber: 44
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-auto space-y-3", children: !isAdded && isAuthenticated && location.pathname !== "/menu" && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "w-full", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: handleAddToMenu, disabled: isAddingToMenuInProgress, className: "w-full flex items-center justify-center px-3 py-2 border border-teal-500 text-teal-500 rounded-md hover:bg-teal-50 transition-colors text-sm font-medium", children: isAddingToMenuInProgress ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "animate-spin -ml-1 mr-2 h-4 w-4 text-teal-500", fill: "none", viewBox: "0 0 24 24", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }, void 0, false, {
            fileName: "app/components/BoxRecipe.tsx",
            lineNumber: 171,
            columnNumber: 49
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" }, void 0, false, {
            fileName: "app/components/BoxRecipe.tsx",
            lineNumber: 172,
            columnNumber: 49
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/BoxRecipe.tsx",
          lineNumber: 170,
          columnNumber: 45
        }, this),
        "Ajout en cours..."
      ] }, void 0, true, {
        fileName: "app/components/BoxRecipe.tsx",
        lineNumber: 169,
        columnNumber: 65
      }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "w-4 h-4 mr-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" }, void 0, false, {
          fileName: "app/components/BoxRecipe.tsx",
          lineNumber: 177,
          columnNumber: 49
        }, this) }, void 0, false, {
          fileName: "app/components/BoxRecipe.tsx",
          lineNumber: 176,
          columnNumber: 45
        }, this),
        "Ajouter au menu"
      ] }, void 0, true, {
        fileName: "app/components/BoxRecipe.tsx",
        lineNumber: 175,
        columnNumber: 47
      }, this) }, void 0, false, {
        fileName: "app/components/BoxRecipe.tsx",
        lineNumber: 168,
        columnNumber: 33
      }, this) }, void 0, false, {
        fileName: "app/components/BoxRecipe.tsx",
        lineNumber: 167,
        columnNumber: 90
      }, this) }, void 0, false, {
        fileName: "app/components/BoxRecipe.tsx",
        lineNumber: 165,
        columnNumber: 21
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/BoxRecipe.tsx",
      lineNumber: 107,
      columnNumber: 17
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/BoxRecipe.tsx",
    lineNumber: 77,
    columnNumber: 13
  }, this) }, void 0, false, {
    fileName: "app/components/BoxRecipe.tsx",
    lineNumber: 76,
    columnNumber: 10
  }, this);
}
_s(BoxRecipe, "13BPLr+QWMJbid9dUnsCskLU+5Q=", false, function() {
  return [useLocation, useOutletContext, useFetcher, useFetcher];
});
_c = BoxRecipe;
var _c;
$RefreshReg$(_c, "BoxRecipe");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

export {
  BoxRecipe
};
//# sourceMappingURL=/build/_shared/chunk-XXGXYCZG.js.map
