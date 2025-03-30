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
import "/build/_shared/chunk-7M6SC7J5.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// app/routes/_index.tsx
var import_node = __toESM(require_node(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/_index.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/_index.tsx"
  );
  import.meta.hot.lastModified = "1742653329023.4187";
}
var meta = () => {
  return [{
    title: "Cookix - Vos recettes Monsieur Cuisine Smart"
  }, {
    name: "description",
    content: "Application de gestion de recettes pour Monsieur Cuisine Smart"
  }];
};
function Index() {
  _s();
  const {
    isAuthenticated
  } = useOutletContext() || {
    isAuthenticated: false
  };
  const {
    randomRecipes,
    totalRecipes,
    error
  } = useLoaderData();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Layout, { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", { className: "bg-gradient-to-r from-rose-500 to-teal-500 text-white", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-3xl md:text-4xl font-bold mb-4 max-w-3xl mx-auto", children: "D\xE9couvrez des recettes pour votre Monsieur Cuisine Smart" }, void 0, false, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 78,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-lg md:text-xl mb-8 max-w-2xl mx-auto", children: [
        "Explorez notre collection de ",
        totalRecipes,
        " recettes, cr\xE9ez vos menus et g\xE9n\xE9rez automatiquement vos listes de courses."
      ] }, void 0, true, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 81,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex flex-col sm:flex-row justify-center gap-4", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/recettes", className: "inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-sm", children: "Explorer les recettes" }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 85,
          columnNumber: 13
        }, this),
        isAuthenticated && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/menu", className: "inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 transition-colors shadow-sm", children: "Mon menu" }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 88,
          columnNumber: 33
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 84,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 77,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 76,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", { className: "py-12 bg-white", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-3xl font-bold text-center mb-10", children: "Recettes \xE0 d\xE9couvrir" }, void 0, false, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 98,
        columnNumber: 11
      }, this),
      error && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mb-8 bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-center", children: error }, void 0, false, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 100,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12", children: randomRecipes?.map((recipe, k) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BoxRecipe, { recipe }, k, false, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 105,
        columnNumber: 48
      }, this)) }, void 0, false, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 104,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/recettes", className: "inline-flex justify-center items-center px-6 py-3 border border-rose-500 text-base font-medium rounded-md text-rose-500 bg-white hover:bg-rose-50 transition-colors", children: "Voir toutes les recettes" }, void 0, false, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 109,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 108,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 97,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 96,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", { className: "py-12 bg-gray-50", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-3xl font-bold text-center mb-10", children: "Fonctionnalit\xE9s" }, void 0, false, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 119,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-white p-6 rounded-lg shadow-md text-center transition-transform hover:-translate-y-1 hover:shadow-lg", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-rose-500 mx-auto mb-4", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "w-16 h-16 mx-auto", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 125,
            columnNumber: 19
          }, this) }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 124,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 123,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { className: "text-xl font-semibold mb-3", children: "Filtrage avanc\xE9" }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 128,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-gray-600", children: "Trouvez facilement des recettes par ingr\xE9dients, temps de pr\xE9paration ou niveau de difficult\xE9." }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 129,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 122,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-white p-6 rounded-lg shadow-md text-center transition-transform hover:-translate-y-1 hover:shadow-lg", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-rose-500 mx-auto mb-4", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "w-16 h-16 mx-auto", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 137,
            columnNumber: 19
          }, this) }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 136,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 135,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { className: "text-xl font-semibold mb-3", children: "Menu hebdomadaire" }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 140,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-gray-600", children: "Planifiez vos repas de la semaine et organisez-vous facilement." }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 141,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 134,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-white p-6 rounded-lg shadow-md text-center transition-transform hover:-translate-y-1 hover:shadow-lg", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-rose-500 mx-auto mb-4", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "w-16 h-16 mx-auto", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 149,
            columnNumber: 19
          }, this) }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 148,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 147,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { className: "text-xl font-semibold mb-3", children: "Liste de courses" }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 152,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-gray-600", children: "G\xE9n\xE9rez automatiquement votre liste de courses bas\xE9e sur votre menu de la semaine." }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 153,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 146,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 121,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 118,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 117,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/_index.tsx",
    lineNumber: 74,
    columnNumber: 10
  }, this);
}
_s(Index, "rvFtF9C0Y5U/F2RtZh+VtAfH03o=", false, function() {
  return [useOutletContext, useLoaderData];
});
_c = Index;
var _c;
$RefreshReg$(_c, "Index");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  Index as default,
  meta
};
//# sourceMappingURL=/build/routes/_index-YODAGMTE.js.map
