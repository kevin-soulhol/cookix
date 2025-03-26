import {
  require_db
} from "/build/_shared/chunk-KONDUBG3.js";
import {
  Layout
} from "/build/_shared/chunk-7EYIA7FC.js";
import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
  Link,
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
var import_db = __toESM(require_db(), 1);
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
  import.meta.hot.lastModified = "1742894871690.6921";
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
  if (error) {
    return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-white rounded-lg shadow-md p-8 max-w-xl w-full text-center", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "w-16 h-16 text-rose-500 mx-auto mb-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" }, void 0, false, {
        fileName: "app/routes/recettes.$recipeId.tsx",
        lineNumber: 115,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "app/routes/recettes.$recipeId.tsx",
        lineNumber: 114,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-2xl font-bold text-gray-800 mb-4", children: error }, void 0, false, {
        fileName: "app/routes/recettes.$recipeId.tsx",
        lineNumber: 117,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-gray-600 mb-6", children: "La recette que vous recherchez n'existe pas ou a \xE9t\xE9 supprim\xE9e." }, void 0, false, {
        fileName: "app/routes/recettes.$recipeId.tsx",
        lineNumber: 118,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/recettes", className: "inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-sm", children: "Voir toutes les recettes" }, void 0, false, {
        fileName: "app/routes/recettes.$recipeId.tsx",
        lineNumber: 121,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/recettes.$recipeId.tsx",
      lineNumber: 113,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/recettes.$recipeId.tsx",
      lineNumber: 112,
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
        lineNumber: 138,
        columnNumber: 17
      }, this) }, void 0, false, {
        fileName: "app/routes/recettes.$recipeId.tsx",
        lineNumber: 135,
        columnNumber: 32
      }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "h-64 sm:h-96 w-full bg-gray-200 flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "w-24 h-24 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }, void 0, false, {
        fileName: "app/routes/recettes.$recipeId.tsx",
        lineNumber: 141,
        columnNumber: 19
      }, this) }, void 0, false, {
        fileName: "app/routes/recettes.$recipeId.tsx",
        lineNumber: 140,
        columnNumber: 17
      }, this) }, void 0, false, {
        fileName: "app/routes/recettes.$recipeId.tsx",
        lineNumber: 139,
        columnNumber: 24
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "absolute bottom-0 left-0 w-full p-6 text-white", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-3xl font-bold mb-2 text-shadow", children: recipe.title }, void 0, false, {
        fileName: "app/routes/recettes.$recipeId.tsx",
        lineNumber: 147,
        columnNumber: 15
      }, this) }, void 0, false, {
        fileName: "app/routes/recettes.$recipeId.tsx",
        lineNumber: 146,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/recettes.$recipeId.tsx",
      lineNumber: 134,
      columnNumber: 11
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "border-b border-gray-200", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "grid grid-cols-2 sm:grid-cols-4 divide-x divide-gray-200", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "p-4 text-center", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "block text-sm text-gray-500", children: "Pr\xE9paration" }, void 0, false, {
          fileName: "app/routes/recettes.$recipeId.tsx",
          lineNumber: 155,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-lg font-semibold", children: recipe.preparationTime ? `${recipe.preparationTime} min` : "Non sp\xE9cifi\xE9" }, void 0, false, {
          fileName: "app/routes/recettes.$recipeId.tsx",
          lineNumber: 156,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/recettes.$recipeId.tsx",
        lineNumber: 154,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "p-4 text-center", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "block text-sm text-gray-500", children: "Cuisson" }, void 0, false, {
          fileName: "app/routes/recettes.$recipeId.tsx",
          lineNumber: 161,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-lg font-semibold", children: recipe.cookingTime ? `${recipe.cookingTime} min` : "Non sp\xE9cifi\xE9" }, void 0, false, {
          fileName: "app/routes/recettes.$recipeId.tsx",
          lineNumber: 162,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/recettes.$recipeId.tsx",
        lineNumber: 160,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "p-4 text-center", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "block text-sm text-gray-500", children: "Difficult\xE9" }, void 0, false, {
          fileName: "app/routes/recettes.$recipeId.tsx",
          lineNumber: 167,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-lg font-semibold", children: recipe.difficulty || "Non sp\xE9cifi\xE9e" }, void 0, false, {
          fileName: "app/routes/recettes.$recipeId.tsx",
          lineNumber: 168,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/recettes.$recipeId.tsx",
        lineNumber: 166,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "p-4 text-center", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "block text-sm text-gray-500", children: "Portions" }, void 0, false, {
          fileName: "app/routes/recettes.$recipeId.tsx",
          lineNumber: 173,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-lg font-semibold", children: recipe.servings ? `${recipe.servings}` : "Non sp\xE9cifi\xE9" }, void 0, false, {
          fileName: "app/routes/recettes.$recipeId.tsx",
          lineNumber: 174,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/recettes.$recipeId.tsx",
        lineNumber: 172,
        columnNumber: 15
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/recettes.$recipeId.tsx",
      lineNumber: 153,
      columnNumber: 13
    }, this) }, void 0, false, {
      fileName: "app/routes/recettes.$recipeId.tsx",
      lineNumber: 152,
      columnNumber: 11
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "border-b border-gray-200", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("nav", { className: "flex", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: () => setSelectedTab("ingredients"), className: `py-4 px-6 font-medium text-sm focus:outline-none ${selectedTab === "ingredients" ? "border-b-2 border-rose-500 text-rose-500" : "text-gray-500 hover:text-gray-700"}`, children: "Ingr\xE9dients" }, void 0, false, {
          fileName: "app/routes/recettes.$recipeId.tsx",
          lineNumber: 185,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: () => setSelectedTab("instructions"), className: `py-4 px-6 font-medium text-sm focus:outline-none ${selectedTab === "instructions" ? "border-b-2 border-rose-500 text-rose-500" : "text-gray-500 hover:text-gray-700"}`, children: "Instructions" }, void 0, false, {
          fileName: "app/routes/recettes.$recipeId.tsx",
          lineNumber: 188,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: () => setSelectedTab("description"), className: `py-4 px-6 font-medium text-sm focus:outline-none ${selectedTab === "description" ? "border-b-2 border-rose-500 text-rose-500" : "text-gray-500 hover:text-gray-700"}`, children: "Description" }, void 0, false, {
          fileName: "app/routes/recettes.$recipeId.tsx",
          lineNumber: 191,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/recettes.$recipeId.tsx",
        lineNumber: 184,
        columnNumber: 15
      }, this) }, void 0, false, {
        fileName: "app/routes/recettes.$recipeId.tsx",
        lineNumber: 183,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "p-6", children: [
        selectedTab === "ingredients" && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-xl font-semibold mb-4", children: "Ingr\xE9dients" }, void 0, false, {
            fileName: "app/routes/recettes.$recipeId.tsx",
            lineNumber: 200,
            columnNumber: 19
          }, this),
          recipe.ingredients && recipe.ingredients.length > 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", { className: "space-y-2", children: recipe.ingredients.map((item, index) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { className: "flex items-center p-2 border-b border-gray-100 last:border-0", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "w-5 h-5 text-rose-500 mr-3 flex-shrink-0", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M5 13l4 4L19 7" }, void 0, false, {
              fileName: "app/routes/recettes.$recipeId.tsx",
              lineNumber: 204,
              columnNumber: 29
            }, this) }, void 0, false, {
              fileName: "app/routes/recettes.$recipeId.tsx",
              lineNumber: 203,
              columnNumber: 27
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [
              item.quantity && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "font-medium", children: [
                item.quantity,
                " "
              ] }, void 0, true, {
                fileName: "app/routes/recettes.$recipeId.tsx",
                lineNumber: 207,
                columnNumber: 47
              }, this),
              item.unit && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [
                item.unit,
                " de "
              ] }, void 0, true, {
                fileName: "app/routes/recettes.$recipeId.tsx",
                lineNumber: 208,
                columnNumber: 43
              }, this),
              item.ingredient.name
            ] }, void 0, true, {
              fileName: "app/routes/recettes.$recipeId.tsx",
              lineNumber: 206,
              columnNumber: 27
            }, this)
          ] }, index, true, {
            fileName: "app/routes/recettes.$recipeId.tsx",
            lineNumber: 202,
            columnNumber: 64
          }, this)) }, void 0, false, {
            fileName: "app/routes/recettes.$recipeId.tsx",
            lineNumber: 201,
            columnNumber: 74
          }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-gray-500 italic", children: "Aucun ingr\xE9dient n'est sp\xE9cifi\xE9 pour cette recette." }, void 0, false, {
            fileName: "app/routes/recettes.$recipeId.tsx",
            lineNumber: 212,
            columnNumber: 29
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/recettes.$recipeId.tsx",
          lineNumber: 199,
          columnNumber: 49
        }, this),
        selectedTab === "instructions" && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-xl font-semibold mb-4", children: "Instructions" }, void 0, false, {
            fileName: "app/routes/recettes.$recipeId.tsx",
            lineNumber: 216,
            columnNumber: 19
          }, this),
          recipe.steps && recipe.steps.length > 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ol", { className: "space-y-6", children: recipe.steps.map((step) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { className: "flex", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "flex-shrink-0 w-8 h-8 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center font-bold mr-4", children: step.stepNumber }, void 0, false, {
              fileName: "app/routes/recettes.$recipeId.tsx",
              lineNumber: 219,
              columnNumber: 27
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "pt-1", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-gray-700", children: step.instruction }, void 0, false, {
              fileName: "app/routes/recettes.$recipeId.tsx",
              lineNumber: 223,
              columnNumber: 29
            }, this) }, void 0, false, {
              fileName: "app/routes/recettes.$recipeId.tsx",
              lineNumber: 222,
              columnNumber: 27
            }, this)
          ] }, step.id, true, {
            fileName: "app/routes/recettes.$recipeId.tsx",
            lineNumber: 218,
            columnNumber: 49
          }, this)) }, void 0, false, {
            fileName: "app/routes/recettes.$recipeId.tsx",
            lineNumber: 217,
            columnNumber: 62
          }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-gray-500 italic", children: "Aucune instruction n'est sp\xE9cifi\xE9e pour cette recette." }, void 0, false, {
            fileName: "app/routes/recettes.$recipeId.tsx",
            lineNumber: 226,
            columnNumber: 29
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/recettes.$recipeId.tsx",
          lineNumber: 215,
          columnNumber: 50
        }, this),
        selectedTab === "description" && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-xl font-semibold mb-4", children: "Description" }, void 0, false, {
            fileName: "app/routes/recettes.$recipeId.tsx",
            lineNumber: 230,
            columnNumber: 19
          }, this),
          recipe.description ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-m mb-3", children: recipe.description }, void 0, false, {
            fileName: "app/routes/recettes.$recipeId.tsx",
            lineNumber: 231,
            columnNumber: 41
          }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-gray-500 italic", children: "Aucune description n'est sp\xE9cifi\xE9e pour cette recette." }, void 0, false, {
            fileName: "app/routes/recettes.$recipeId.tsx",
            lineNumber: 231,
            columnNumber: 95
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/recettes.$recipeId.tsx",
          lineNumber: 229,
          columnNumber: 49
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/recettes.$recipeId.tsx",
        lineNumber: 198,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/recettes.$recipeId.tsx",
      lineNumber: 182,
      columnNumber: 11
    }, this),
    isAuthenticated && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-gray-50 p-6 flex flex-wrap gap-4 justify-between", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex flex-wrap gap-2", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { className: "inline-flex items-center px-4 py-2 border border-rose-500 rounded-md text-rose-500 bg-white hover:bg-rose-50 transition-colors", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "w-5 h-5 mr-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" }, void 0, false, {
            fileName: "app/routes/recettes.$recipeId.tsx",
            lineNumber: 241,
            columnNumber: 21
          }, this) }, void 0, false, {
            fileName: "app/routes/recettes.$recipeId.tsx",
            lineNumber: 240,
            columnNumber: 19
          }, this),
          "Ajouter aux favoris"
        ] }, void 0, true, {
          fileName: "app/routes/recettes.$recipeId.tsx",
          lineNumber: 239,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { className: "inline-flex items-center px-4 py-2 border border-teal-500 rounded-md text-teal-500 bg-white hover:bg-teal-50 transition-colors", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "w-5 h-5 mr-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" }, void 0, false, {
            fileName: "app/routes/recettes.$recipeId.tsx",
            lineNumber: 247,
            columnNumber: 21
          }, this) }, void 0, false, {
            fileName: "app/routes/recettes.$recipeId.tsx",
            lineNumber: 246,
            columnNumber: 19
          }, this),
          "Ajouter au menu"
        ] }, void 0, true, {
          fileName: "app/routes/recettes.$recipeId.tsx",
          lineNumber: 245,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/recettes.$recipeId.tsx",
        lineNumber: 238,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { className: "inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "w-5 h-5 mr-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" }, void 0, false, {
          fileName: "app/routes/recettes.$recipeId.tsx",
          lineNumber: 255,
          columnNumber: 21
        }, this) }, void 0, false, {
          fileName: "app/routes/recettes.$recipeId.tsx",
          lineNumber: 254,
          columnNumber: 19
        }, this),
        "Partager"
      ] }, void 0, true, {
        fileName: "app/routes/recettes.$recipeId.tsx",
        lineNumber: 253,
        columnNumber: 17
      }, this) }, void 0, false, {
        fileName: "app/routes/recettes.$recipeId.tsx",
        lineNumber: 252,
        columnNumber: 15
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/recettes.$recipeId.tsx",
      lineNumber: 237,
      columnNumber: 31
    }, this),
    recipe.sourceUrl && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "p-4 text-sm text-center text-gray-500 border-t", children: [
      "Voir la recette sur ",
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", { href: recipe.sourceUrl, target: "_blank", rel: "noopener noreferrer", className: "text-rose-500 hover:underline", children: new URL(recipe.sourceUrl).hostname }, void 0, false, {
        fileName: "app/routes/recettes.$recipeId.tsx",
        lineNumber: 264,
        columnNumber: 35
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/recettes.$recipeId.tsx",
      lineNumber: 263,
      columnNumber: 32
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/recettes.$recipeId.tsx",
    lineNumber: 132,
    columnNumber: 9
  }, this) }, void 0, false, {
    fileName: "app/routes/recettes.$recipeId.tsx",
    lineNumber: 131,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "app/routes/recettes.$recipeId.tsx",
    lineNumber: 130,
    columnNumber: 10
  }, this);
}
_s(RecipeDetail, "GD229G9/e9/vv6PIsNA+a6rQHpI=", false, function() {
  return [useOutletContext, useLoaderData];
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
//# sourceMappingURL=/build/routes/recettes.$recipeId-62E7S36H.js.map
