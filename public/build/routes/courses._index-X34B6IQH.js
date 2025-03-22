import {
  require_db
} from "/build/_shared/chunk-KONDUBG3.js";
import {
  Layout
} from "/build/_shared/chunk-APGWOUXP.js";
import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
  require_jsx_dev_runtime
} from "/build/_shared/chunk-XGOTYLZ5.js";
import {
  Link,
  useFetcher,
  useLoaderData
} from "/build/_shared/chunk-CZSOU3SK.js";
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

// app/routes/courses._index.tsx
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
    window.$RefreshRuntime$.register(type, '"app/routes/courses._index.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/courses._index.tsx"
  );
  import.meta.hot.lastModified = "1742648370489.2668";
}
function ShoppingList() {
  _s();
  const {
    shoppingList,
    items,
    error
  } = useLoaderData();
  const [showAddForm, setShowAddForm] = (0, import_react2.useState)(false);
  const [newItemName, setNewItemName] = (0, import_react2.useState)("");
  const [newItemQuantity, setNewItemQuantity] = (0, import_react2.useState)("");
  const [newItemUnit, setNewItemUnit] = (0, import_react2.useState)("");
  const [itemInFocus, setItemInFocus] = (0, import_react2.useState)(null);
  const [showShareModal, setShowShareModal] = (0, import_react2.useState)(false);
  const [email, setEmail] = (0, import_react2.useState)("");
  const shareFetcher = useFetcher();
  const toggleItemFetcher = useFetcher();
  const removeItemFetcher = useFetcher();
  const addItemFetcher = useFetcher();
  const clearCheckedFetcher = useFetcher();
  const checkedCount = items?.filter((item) => item.isChecked)?.length || 0;
  const progress = items?.length > 0 ? Math.round(checkedCount / items.length * 100) : 0;
  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemName.trim())
      return;
    addItemFetcher.submit({
      _action: "addItem",
      name: newItemName,
      quantity: newItemQuantity,
      unit: newItemUnit,
      listId: shoppingList.id
    }, {
      method: "post"
    });
    setNewItemName("");
    setNewItemQuantity("");
    setNewItemUnit("");
    setShowAddForm(false);
  };
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Layout, { pageTitle: "Liste de courses", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: error ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-red-50 border-l-4 border-red-500 p-4 text-red-700 mb-8", children: error }, void 0, false, {
    fileName: "app/routes/courses._index.tsx",
    lineNumber: 337,
    columnNumber: 26
  }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex justify-between items-center mb-6", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-2xl font-bold", children: "Liste de courses" }, void 0, false, {
        fileName: "app/routes/courses._index.tsx",
        lineNumber: 342,
        columnNumber: 29
      }, this),
      checkedCount > 0 && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: () => {
        if (window.confirm("Voulez-vous supprimer tous les articles coch\xE9s ?")) {
          clearCheckedFetcher.submit({
            _action: "clearChecked",
            listId: shoppingList.id
          }, {
            method: "post"
          });
        }
      }, className: "inline-flex items-center px-3 py-2 border border-gray-300 text-sm rounded-md text-gray-700 bg-white hover:bg-gray-50", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "w-5 h-5 mr-1", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }, void 0, false, {
          fileName: "app/routes/courses._index.tsx",
          lineNumber: 355,
          columnNumber: 41
        }, this) }, void 0, false, {
          fileName: "app/routes/courses._index.tsx",
          lineNumber: 354,
          columnNumber: 37
        }, this),
        "Vider les coch\xE9s"
      ] }, void 0, true, {
        fileName: "app/routes/courses._index.tsx",
        lineNumber: 344,
        columnNumber: 50
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: () => setShowShareModal(true), className: "inline-flex items-center px-3 py-2 border border-gray-300 text-sm rounded-md text-gray-700 bg-white hover:bg-gray-50", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "w-5 h-5 mr-1", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" }, void 0, false, {
          fileName: "app/routes/courses._index.tsx",
          lineNumber: 362,
          columnNumber: 37
        }, this) }, void 0, false, {
          fileName: "app/routes/courses._index.tsx",
          lineNumber: 361,
          columnNumber: 33
        }, this),
        "Partager"
      ] }, void 0, true, {
        fileName: "app/routes/courses._index.tsx",
        lineNumber: 360,
        columnNumber: 29
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/courses._index.tsx",
      lineNumber: 341,
      columnNumber: 25
    }, this),
    items.length > 0 && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mb-8", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex justify-between text-sm text-gray-600 mb-1", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          checkedCount,
          " sur ",
          items.length,
          " articles"
        ] }, void 0, true, {
          fileName: "app/routes/courses._index.tsx",
          lineNumber: 371,
          columnNumber: 37
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          progress,
          "% compl\xE9t\xE9"
        ] }, void 0, true, {
          fileName: "app/routes/courses._index.tsx",
          lineNumber: 372,
          columnNumber: 37
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/courses._index.tsx",
        lineNumber: 370,
        columnNumber: 33
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "w-full bg-gray-200 rounded-full h-2.5", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-teal-500 h-2.5 rounded-full", style: {
        width: `${progress}%`
      } }, void 0, false, {
        fileName: "app/routes/courses._index.tsx",
        lineNumber: 375,
        columnNumber: 37
      }, this) }, void 0, false, {
        fileName: "app/routes/courses._index.tsx",
        lineNumber: 374,
        columnNumber: 33
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/courses._index.tsx",
      lineNumber: 369,
      columnNumber: 46
    }, this),
    items.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-center py-12 bg-white rounded-lg shadow-md mb-8", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "mx-auto h-12 w-12 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" }, void 0, false, {
        fileName: "app/routes/courses._index.tsx",
        lineNumber: 384,
        columnNumber: 37
      }, this) }, void 0, false, {
        fileName: "app/routes/courses._index.tsx",
        lineNumber: 383,
        columnNumber: 33
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { className: "mt-2 text-lg font-medium text-gray-900", children: "Votre liste est vide" }, void 0, false, {
        fileName: "app/routes/courses._index.tsx",
        lineNumber: 386,
        columnNumber: 33
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-1 text-sm text-gray-500", children: "Ajoutez des articles manuellement ou depuis votre menu." }, void 0, false, {
        fileName: "app/routes/courses._index.tsx",
        lineNumber: 387,
        columnNumber: 33
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-6", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: () => setShowAddForm(true), className: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500", children: "Ajouter un article" }, void 0, false, {
        fileName: "app/routes/courses._index.tsx",
        lineNumber: 391,
        columnNumber: 37
      }, this) }, void 0, false, {
        fileName: "app/routes/courses._index.tsx",
        lineNumber: 390,
        columnNumber: 33
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/courses._index.tsx",
      lineNumber: 382,
      columnNumber: 47
    }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-white rounded-lg shadow-md overflow-hidden mb-8", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", { className: "divide-y divide-gray-200", children: items.map((item) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { className: `px-4 py-3 flex items-center hover:bg-gray-50 ${item.isChecked ? "bg-gray-50" : ""}`, onMouseEnter: () => setItemInFocus(item.id), onMouseLeave: () => setItemInFocus(null), children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(toggleItemFetcher.Form, { method: "post", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "_action", value: "toggleItem" }, void 0, false, {
          fileName: "app/routes/courses._index.tsx",
          lineNumber: 399,
          columnNumber: 49
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "itemId", value: item.id }, void 0, false, {
          fileName: "app/routes/courses._index.tsx",
          lineNumber: 400,
          columnNumber: 49
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "isChecked", value: item.isChecked.toString() }, void 0, false, {
          fileName: "app/routes/courses._index.tsx",
          lineNumber: 401,
          columnNumber: 49
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "submit", className: `w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${item.isChecked ? "bg-teal-500 border-teal-500 text-white" : "border-gray-300"}`, "aria-label": item.isChecked ? "D\xE9cocher" : "Cocher", children: item.isChecked && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "w-3 h-3", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "3", d: "M5 13l4 4L19 7" }, void 0, false, {
          fileName: "app/routes/courses._index.tsx",
          lineNumber: 404,
          columnNumber: 61
        }, this) }, void 0, false, {
          fileName: "app/routes/courses._index.tsx",
          lineNumber: 403,
          columnNumber: 72
        }, this) }, void 0, false, {
          fileName: "app/routes/courses._index.tsx",
          lineNumber: 402,
          columnNumber: 49
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/courses._index.tsx",
        lineNumber: 398,
        columnNumber: 45
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex-grow", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: `font-medium ${item.isChecked ? "line-through text-gray-500" : "text-gray-700"}`, children: item.ingredient.name }, void 0, false, {
          fileName: "app/routes/courses._index.tsx",
          lineNumber: 410,
          columnNumber: 49
        }, this),
        (item.quantity || item.unit) && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: `ml-2 text-sm ${item.isChecked ? "text-gray-400" : "text-gray-500"}`, children: [
          item.quantity && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: item.quantity }, void 0, false, {
            fileName: "app/routes/courses._index.tsx",
            lineNumber: 414,
            columnNumber: 75
          }, this),
          item.unit && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [
            " ",
            item.unit
          ] }, void 0, true, {
            fileName: "app/routes/courses._index.tsx",
            lineNumber: 415,
            columnNumber: 71
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/courses._index.tsx",
          lineNumber: 413,
          columnNumber: 82
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/courses._index.tsx",
        lineNumber: 409,
        columnNumber: 45
      }, this),
      (itemInFocus === item.id || item.isChecked) && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(removeItemFetcher.Form, { method: "post", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "_action", value: "removeItem" }, void 0, false, {
          fileName: "app/routes/courses._index.tsx",
          lineNumber: 420,
          columnNumber: 53
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "itemId", value: item.id }, void 0, false, {
          fileName: "app/routes/courses._index.tsx",
          lineNumber: 421,
          columnNumber: 53
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "submit", className: "text-gray-400 hover:text-red-500 ml-2", "aria-label": "Supprimer", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }, void 0, false, {
          fileName: "app/routes/courses._index.tsx",
          lineNumber: 424,
          columnNumber: 61
        }, this) }, void 0, false, {
          fileName: "app/routes/courses._index.tsx",
          lineNumber: 423,
          columnNumber: 57
        }, this) }, void 0, false, {
          fileName: "app/routes/courses._index.tsx",
          lineNumber: 422,
          columnNumber: 53
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/courses._index.tsx",
        lineNumber: 419,
        columnNumber: 93
      }, this)
    ] }, item.id, true, {
      fileName: "app/routes/courses._index.tsx",
      lineNumber: 397,
      columnNumber: 56
    }, this)) }, void 0, false, {
      fileName: "app/routes/courses._index.tsx",
      lineNumber: 396,
      columnNumber: 33
    }, this) }, void 0, false, {
      fileName: "app/routes/courses._index.tsx",
      lineNumber: 395,
      columnNumber: 38
    }, this),
    !showAddForm && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: () => setShowAddForm(true), className: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "w-5 h-5 mr-1", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M12 6v6m0 0v6m0-6h6m-6 0H6" }, void 0, false, {
        fileName: "app/routes/courses._index.tsx",
        lineNumber: 436,
        columnNumber: 41
      }, this) }, void 0, false, {
        fileName: "app/routes/courses._index.tsx",
        lineNumber: 435,
        columnNumber: 37
      }, this),
      "Ajouter un article"
    ] }, void 0, true, {
      fileName: "app/routes/courses._index.tsx",
      lineNumber: 434,
      columnNumber: 33
    }, this) }, void 0, false, {
      fileName: "app/routes/courses._index.tsx",
      lineNumber: 433,
      columnNumber: 42
    }, this),
    showAddForm && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-white rounded-lg shadow-md p-4 mt-6", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { className: "text-lg font-medium text-gray-900 mb-4", children: "Ajouter un article" }, void 0, false, {
        fileName: "app/routes/courses._index.tsx",
        lineNumber: 444,
        columnNumber: 33
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", { onSubmit: handleAddItem, children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "sm:col-span-3", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "name", className: "block text-sm font-medium text-gray-700", children: "Nom de l'article *" }, void 0, false, {
              fileName: "app/routes/courses._index.tsx",
              lineNumber: 448,
              columnNumber: 45
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-1", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "text", id: "name", name: "name", required: true, value: newItemName, onChange: (e) => setNewItemName(e.target.value), className: "shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm border-gray-300 rounded-md", placeholder: "Ex: Tomates" }, void 0, false, {
              fileName: "app/routes/courses._index.tsx",
              lineNumber: 452,
              columnNumber: 49
            }, this) }, void 0, false, {
              fileName: "app/routes/courses._index.tsx",
              lineNumber: 451,
              columnNumber: 45
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/courses._index.tsx",
            lineNumber: 447,
            columnNumber: 41
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "sm:col-span-2", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "quantity", className: "block text-sm font-medium text-gray-700", children: "Quantit\xE9" }, void 0, false, {
              fileName: "app/routes/courses._index.tsx",
              lineNumber: 457,
              columnNumber: 45
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-1", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "number", id: "quantity", name: "quantity", step: "0.01", min: "0", value: newItemQuantity, onChange: (e) => setNewItemQuantity(e.target.value), className: "shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm border-gray-300 rounded-md", placeholder: "Ex: 500" }, void 0, false, {
              fileName: "app/routes/courses._index.tsx",
              lineNumber: 461,
              columnNumber: 49
            }, this) }, void 0, false, {
              fileName: "app/routes/courses._index.tsx",
              lineNumber: 460,
              columnNumber: 45
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/courses._index.tsx",
            lineNumber: 456,
            columnNumber: 41
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "sm:col-span-1", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "unit", className: "block text-sm font-medium text-gray-700", children: "Unit\xE9" }, void 0, false, {
              fileName: "app/routes/courses._index.tsx",
              lineNumber: 466,
              columnNumber: 45
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-1", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "text", id: "unit", name: "unit", value: newItemUnit, onChange: (e) => setNewItemUnit(e.target.value), className: "shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm border-gray-300 rounded-md", placeholder: "Ex: g" }, void 0, false, {
              fileName: "app/routes/courses._index.tsx",
              lineNumber: 470,
              columnNumber: 49
            }, this) }, void 0, false, {
              fileName: "app/routes/courses._index.tsx",
              lineNumber: 469,
              columnNumber: 45
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/courses._index.tsx",
            lineNumber: 465,
            columnNumber: 41
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/courses._index.tsx",
          lineNumber: 446,
          columnNumber: 37
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-5 flex justify-end space-x-3", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "button", onClick: () => setShowAddForm(false), className: "px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500", children: "Annuler" }, void 0, false, {
            fileName: "app/routes/courses._index.tsx",
            lineNumber: 476,
            columnNumber: 41
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "submit", className: "inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500", children: "Ajouter" }, void 0, false, {
            fileName: "app/routes/courses._index.tsx",
            lineNumber: 479,
            columnNumber: 41
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/courses._index.tsx",
          lineNumber: 475,
          columnNumber: 37
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/courses._index.tsx",
        lineNumber: 445,
        columnNumber: 33
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/courses._index.tsx",
      lineNumber: 443,
      columnNumber: 41
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-center mt-8", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/menu", className: "inline-flex items-center text-teal-600 hover:text-teal-800", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "w-5 h-5 mr-1", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" }, void 0, false, {
        fileName: "app/routes/courses._index.tsx",
        lineNumber: 490,
        columnNumber: 37
      }, this) }, void 0, false, {
        fileName: "app/routes/courses._index.tsx",
        lineNumber: 489,
        columnNumber: 33
      }, this),
      "Retour au menu"
    ] }, void 0, true, {
      fileName: "app/routes/courses._index.tsx",
      lineNumber: 488,
      columnNumber: 29
    }, this) }, void 0, false, {
      fileName: "app/routes/courses._index.tsx",
      lineNumber: 487,
      columnNumber: 25
    }, this),
    showShareModal && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-white rounded-lg shadow-xl p-6 w-full max-w-md", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-lg font-bold mb-4", children: "Partager votre liste de courses" }, void 0, false, {
        fileName: "app/routes/courses._index.tsx",
        lineNumber: 499,
        columnNumber: 37
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(shareFetcher.Form, { method: "post", action: "/api/share", onSubmit: () => setShowShareModal(false), children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "_action", value: "shareMenu" }, void 0, false, {
          fileName: "app/routes/courses._index.tsx",
          lineNumber: 502,
          columnNumber: 41
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "shoppingListId", value: shoppingList.id }, void 0, false, {
          fileName: "app/routes/courses._index.tsx",
          lineNumber: 503,
          columnNumber: 41
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mb-4", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700 mb-1", children: "Adresse email" }, void 0, false, {
            fileName: "app/routes/courses._index.tsx",
            lineNumber: 507,
            columnNumber: 45
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "email", id: "email", name: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), className: "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500", placeholder: "exemple@email.com" }, void 0, false, {
            fileName: "app/routes/courses._index.tsx",
            lineNumber: 510,
            columnNumber: 45
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/courses._index.tsx",
          lineNumber: 506,
          columnNumber: 41
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex justify-end space-x-3", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "button", onClick: () => setShowShareModal(false), className: "px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50", children: "Annuler" }, void 0, false, {
            fileName: "app/routes/courses._index.tsx",
            lineNumber: 514,
            columnNumber: 45
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "submit", className: "px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500", children: "Partager" }, void 0, false, {
            fileName: "app/routes/courses._index.tsx",
            lineNumber: 517,
            columnNumber: 45
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/courses._index.tsx",
          lineNumber: 513,
          columnNumber: 41
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/courses._index.tsx",
        lineNumber: 501,
        columnNumber: 37
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/courses._index.tsx",
      lineNumber: 498,
      columnNumber: 33
    }, this) }, void 0, false, {
      fileName: "app/routes/courses._index.tsx",
      lineNumber: 497,
      columnNumber: 44
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/courses._index.tsx",
    lineNumber: 339,
    columnNumber: 30
  }, this) }, void 0, false, {
    fileName: "app/routes/courses._index.tsx",
    lineNumber: 336,
    columnNumber: 13
  }, this) }, void 0, false, {
    fileName: "app/routes/courses._index.tsx",
    lineNumber: 335,
    columnNumber: 10
  }, this);
}
_s(ShoppingList, "MSwc1XXlR7A8jRqRb7C3FA3TjbA=", false, function() {
  return [useLoaderData, useFetcher, useFetcher, useFetcher, useFetcher, useFetcher];
});
_c = ShoppingList;
var _c;
$RefreshReg$(_c, "ShoppingList");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ShoppingList as default
};
//# sourceMappingURL=/build/routes/courses._index-X34B6IQH.js.map
