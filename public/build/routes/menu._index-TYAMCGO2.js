import {
  BoxRecipe
} from "/build/_shared/chunk-U4IONIVO.js";
import {
  Layout
} from "/build/_shared/chunk-XAMQJL7P.js";
import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
  Link,
  useFetcher,
  useLoaderData
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

// app/routes/menu._index.tsx
var import_node = __toESM(require_node(), 1);
var import_react2 = __toESM(require_react(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/menu._index.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/menu._index.tsx"
  );
  import.meta.hot.lastModified = "1742580587621.0369";
}
function WeeklyMenu() {
  _s();
  const {
    menu,
    menuItems,
    favoriteRecipes,
    shoppingListCount,
    shoppingListId,
    menuShares,
    error
  } = useLoaderData();
  const [showShareModal, setShowShareModal] = (0, import_react2.useState)(false);
  const [email, setEmail] = (0, import_react2.useState)("");
  const [searchQuery, setSearchQuery] = (0, import_react2.useState)("");
  const shareFetcher = useFetcher();
  const removeItemFetcher = useFetcher();
  const recipes = menuItems.map((item) => item.recipe);
  const filteredRecipes = recipes.filter((recipe) => recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) || recipe.description?.toLowerCase().includes(searchQuery.toLowerCase()));
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Layout, { pageTitle: "Menu de la semaine", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: error ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-red-50 border-l-4 border-red-500 p-4 text-red-700 mb-8", children: error }, void 0, false, {
      fileName: "app/routes/menu._index.tsx",
      lineNumber: 145,
      columnNumber: 18
    }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex justify-between items-center mb-8", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-2xl font-bold", children: "Menu de la semaine" }, void 0, false, {
          fileName: "app/routes/menu._index.tsx",
          lineNumber: 150,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex space-x-4", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: `/courses?listId=${shoppingListId}`, className: "inline-flex items-center px-4 py-2 border border-teal-500 rounded-md text-teal-500 bg-white hover:bg-teal-50 transition-colors", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "w-5 h-5 mr-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" }, void 0, false, {
              fileName: "app/routes/menu._index.tsx",
              lineNumber: 156,
              columnNumber: 21
            }, this) }, void 0, false, {
              fileName: "app/routes/menu._index.tsx",
              lineNumber: 155,
              columnNumber: 19
            }, this),
            "Liste de courses",
            shoppingListCount > 0 && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-teal-500 rounded-full", children: shoppingListCount }, void 0, false, {
              fileName: "app/routes/menu._index.tsx",
              lineNumber: 159,
              columnNumber: 45
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/menu._index.tsx",
            lineNumber: 154,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: () => setShowShareModal(true), className: "inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "w-5 h-5 mr-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" }, void 0, false, {
              fileName: "app/routes/menu._index.tsx",
              lineNumber: 167,
              columnNumber: 21
            }, this) }, void 0, false, {
              fileName: "app/routes/menu._index.tsx",
              lineNumber: 166,
              columnNumber: 19
            }, this),
            "Partager"
          ] }, void 0, true, {
            fileName: "app/routes/menu._index.tsx",
            lineNumber: 165,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/menu._index.tsx",
          lineNumber: 152,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/menu._index.tsx",
        lineNumber: 149,
        columnNumber: 13
      }, this),
      menuItems.length > 0 && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mb-6", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "relative rounded-md shadow-sm", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "text", placeholder: "Rechercher dans votre menu...", className: "block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-rose-500 focus:border-rose-500", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value) }, void 0, false, {
          fileName: "app/routes/menu._index.tsx",
          lineNumber: 177,
          columnNumber: 19
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "h-5 w-5 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }, void 0, false, {
          fileName: "app/routes/menu._index.tsx",
          lineNumber: 180,
          columnNumber: 23
        }, this) }, void 0, false, {
          fileName: "app/routes/menu._index.tsx",
          lineNumber: 179,
          columnNumber: 21
        }, this) }, void 0, false, {
          fileName: "app/routes/menu._index.tsx",
          lineNumber: 178,
          columnNumber: 19
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/menu._index.tsx",
        lineNumber: 176,
        columnNumber: 17
      }, this) }, void 0, false, {
        fileName: "app/routes/menu._index.tsx",
        lineNumber: 175,
        columnNumber: 38
      }, this),
      menuItems.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-center py-12 bg-white rounded-lg shadow-md mb-12", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "mx-auto h-12 w-12 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" }, void 0, false, {
          fileName: "app/routes/menu._index.tsx",
          lineNumber: 189,
          columnNumber: 19
        }, this) }, void 0, false, {
          fileName: "app/routes/menu._index.tsx",
          lineNumber: 188,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { className: "mt-2 text-lg font-medium text-gray-900", children: "Votre menu est vide" }, void 0, false, {
          fileName: "app/routes/menu._index.tsx",
          lineNumber: 191,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-1 text-sm text-gray-500", children: "Commencez \xE0 ajouter des recettes \xE0 votre menu pour planifier vos repas." }, void 0, false, {
          fileName: "app/routes/menu._index.tsx",
          lineNumber: 192,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-6", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/recettes", className: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500", children: "Explorer les recettes" }, void 0, false, {
          fileName: "app/routes/menu._index.tsx",
          lineNumber: 196,
          columnNumber: 19
        }, this) }, void 0, false, {
          fileName: "app/routes/menu._index.tsx",
          lineNumber: 195,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/menu._index.tsx",
        lineNumber: 187,
        columnNumber: 39
      }, this) : filteredRecipes.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-center py-8 bg-white rounded-lg shadow-md mb-12", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-gray-500", children: "Aucune recette ne correspond \xE0 votre recherche." }, void 0, false, {
        fileName: "app/routes/menu._index.tsx",
        lineNumber: 201,
        columnNumber: 17
      }, this) }, void 0, false, {
        fileName: "app/routes/menu._index.tsx",
        lineNumber: 200,
        columnNumber: 55
      }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12", children: filteredRecipes.map((recipe) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "relative", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BoxRecipe, { recipe }, void 0, false, {
          fileName: "app/routes/menu._index.tsx",
          lineNumber: 204,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: () => {
          removeItemFetcher.submit({
            recipeId: recipe.id
          }, {
            method: "delete",
            action: "/api/menu"
          });
        }, className: "absolute top-3 right-3 bg-white bg-opacity-80 p-2 rounded-full shadow-md hover:bg-opacity-100 transition-all", "aria-label": "Retirer du menu", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "w-5 h-5 text-red-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M6 18L18 6M6 6l12 12" }, void 0, false, {
          fileName: "app/routes/menu._index.tsx",
          lineNumber: 216,
          columnNumber: 25
        }, this) }, void 0, false, {
          fileName: "app/routes/menu._index.tsx",
          lineNumber: 215,
          columnNumber: 23
        }, this) }, void 0, false, {
          fileName: "app/routes/menu._index.tsx",
          lineNumber: 207,
          columnNumber: 21
        }, this)
      ] }, recipe.id, true, {
        fileName: "app/routes/menu._index.tsx",
        lineNumber: 203,
        columnNumber: 48
      }, this)) }, void 0, false, {
        fileName: "app/routes/menu._index.tsx",
        lineNumber: 202,
        columnNumber: 24
      }, this),
      menuShares.length > 0 && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mb-12", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-xl font-semibold mb-4", children: "Menu partag\xE9 avec" }, void 0, false, {
          fileName: "app/routes/menu._index.tsx",
          lineNumber: 224,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-white rounded-lg shadow-md p-4", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", { className: "divide-y divide-gray-200", children: menuShares.map((share) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { className: "py-3 flex justify-between items-center", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "w-5 h-5 text-gray-400 mr-3", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" }, void 0, false, {
              fileName: "app/routes/menu._index.tsx",
              lineNumber: 230,
              columnNumber: 29
            }, this) }, void 0, false, {
              fileName: "app/routes/menu._index.tsx",
              lineNumber: 229,
              columnNumber: 27
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: share.sharedWithEmail }, void 0, false, {
              fileName: "app/routes/menu._index.tsx",
              lineNumber: 232,
              columnNumber: 27
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/menu._index.tsx",
            lineNumber: 228,
            columnNumber: 25
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: `px-2 py-1 text-xs rounded-full ${share.isAccepted ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`, children: share.isAccepted ? "Accept\xE9" : "En attente" }, void 0, false, {
            fileName: "app/routes/menu._index.tsx",
            lineNumber: 234,
            columnNumber: 25
          }, this)
        ] }, share.id, true, {
          fileName: "app/routes/menu._index.tsx",
          lineNumber: 227,
          columnNumber: 46
        }, this)) }, void 0, false, {
          fileName: "app/routes/menu._index.tsx",
          lineNumber: 226,
          columnNumber: 19
        }, this) }, void 0, false, {
          fileName: "app/routes/menu._index.tsx",
          lineNumber: 225,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/menu._index.tsx",
        lineNumber: 223,
        columnNumber: 39
      }, this),
      favoriteRecipes.length > 0 && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-xl font-semibold mb-4", children: "Ajouter depuis vos favoris" }, void 0, false, {
          fileName: "app/routes/menu._index.tsx",
          lineNumber: 244,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: favoriteRecipes.map((recipe) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BoxRecipe, { recipe }, recipe.id, false, {
          fileName: "app/routes/menu._index.tsx",
          lineNumber: 246,
          columnNumber: 50
        }, this)) }, void 0, false, {
          fileName: "app/routes/menu._index.tsx",
          lineNumber: 245,
          columnNumber: 17
        }, this),
        favoriteRecipes.length > 3 && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-center mt-6", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/favoris", className: "text-rose-500 hover:text-rose-700 font-medium", children: "Voir tous vos favoris" }, void 0, false, {
          fileName: "app/routes/menu._index.tsx",
          lineNumber: 249,
          columnNumber: 21
        }, this) }, void 0, false, {
          fileName: "app/routes/menu._index.tsx",
          lineNumber: 248,
          columnNumber: 48
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/menu._index.tsx",
        lineNumber: 243,
        columnNumber: 44
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/menu._index.tsx",
      lineNumber: 147,
      columnNumber: 20
    }, this) }, void 0, false, {
      fileName: "app/routes/menu._index.tsx",
      lineNumber: 144,
      columnNumber: 7
    }, this),
    showShareModal && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-white rounded-lg shadow-xl p-6 w-full max-w-md", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-lg font-bold mb-4", children: "Partager votre menu" }, void 0, false, {
        fileName: "app/routes/menu._index.tsx",
        lineNumber: 260,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(shareFetcher.Form, { method: "post", onSubmit: () => setShowShareModal(false), children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "_action", value: "share" }, void 0, false, {
          fileName: "app/routes/menu._index.tsx",
          lineNumber: 263,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "menuId", value: menu?.id }, void 0, false, {
          fileName: "app/routes/menu._index.tsx",
          lineNumber: 264,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mb-4", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700 mb-1", children: "Adresse email" }, void 0, false, {
            fileName: "app/routes/menu._index.tsx",
            lineNumber: 267,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "email", id: "email", name: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), className: "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500", placeholder: "exemple@email.com" }, void 0, false, {
            fileName: "app/routes/menu._index.tsx",
            lineNumber: 270,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/menu._index.tsx",
          lineNumber: 266,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex justify-end space-x-3", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "button", onClick: () => setShowShareModal(false), className: "px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50", children: "Annuler" }, void 0, false, {
            fileName: "app/routes/menu._index.tsx",
            lineNumber: 274,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "submit", className: "px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500", children: "Partager" }, void 0, false, {
            fileName: "app/routes/menu._index.tsx",
            lineNumber: 277,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/menu._index.tsx",
          lineNumber: 273,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/menu._index.tsx",
        lineNumber: 262,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/menu._index.tsx",
      lineNumber: 259,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "app/routes/menu._index.tsx",
      lineNumber: 258,
      columnNumber: 26
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/menu._index.tsx",
    lineNumber: 143,
    columnNumber: 10
  }, this);
}
_s(WeeklyMenu, "9isYXsqUYQRMqPDUORE2yZoghL8=", false, function() {
  return [useLoaderData, useFetcher, useFetcher];
});
_c = WeeklyMenu;
var _c;
$RefreshReg$(_c, "WeeklyMenu");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  WeeklyMenu as default
};
//# sourceMappingURL=/build/routes/menu._index-TYAMCGO2.js.map
