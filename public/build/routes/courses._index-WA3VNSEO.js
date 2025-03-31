import {
  require_db
} from "/build/_shared/chunk-KONDUBG3.js";
import {
  Layout
} from "/build/_shared/chunk-R6SO4NDQ.js";
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
} from "/build/_shared/chunk-YHAWPGHG.js";
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
var _s2 = $RefreshSig$();
var _s3 = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/courses._index.tsx"
  );
  import.meta.hot.lastModified = "1742916317417.726";
}
function ShoppingList() {
  _s();
  const {
    shoppingList,
    items,
    categorizedItems,
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
  const toggleMarketplaceFetcher = useFetcher();
  const addItemFetcher = useFetcher();
  const clearCheckedFetcher = useFetcher();
  const firstMarketplaceCount = categorizedItems.firstMarketplace?.length || 0;
  const secondMarketplaceCount = categorizedItems.secondMarketplace?.length || 0;
  const checkedCount = categorizedItems.checked?.length || 0;
  const totalCount = firstMarketplaceCount + secondMarketplaceCount + checkedCount;
  const progress = totalCount > 0 ? Math.round(checkedCount / totalCount * 100) : 0;
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
    lineNumber: 381,
    columnNumber: 26
  }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex justify-between items-center mb-6", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-2xl font-bold", children: "Liste de courses" }, void 0, false, {
        fileName: "app/routes/courses._index.tsx",
        lineNumber: 386,
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
          lineNumber: 399,
          columnNumber: 41
        }, this) }, void 0, false, {
          fileName: "app/routes/courses._index.tsx",
          lineNumber: 398,
          columnNumber: 37
        }, this),
        "Vider les coch\xE9s"
      ] }, void 0, true, {
        fileName: "app/routes/courses._index.tsx",
        lineNumber: 388,
        columnNumber: 50
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: () => setShowShareModal(true), className: "inline-flex items-center px-3 py-2 border border-gray-300 text-sm rounded-md text-gray-700 bg-white hover:bg-gray-50", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "w-5 h-5 mr-1", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" }, void 0, false, {
          fileName: "app/routes/courses._index.tsx",
          lineNumber: 406,
          columnNumber: 37
        }, this) }, void 0, false, {
          fileName: "app/routes/courses._index.tsx",
          lineNumber: 405,
          columnNumber: 33
        }, this),
        "Partager"
      ] }, void 0, true, {
        fileName: "app/routes/courses._index.tsx",
        lineNumber: 404,
        columnNumber: 29
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/courses._index.tsx",
      lineNumber: 385,
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
          lineNumber: 415,
          columnNumber: 37
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          progress,
          "% compl\xE9t\xE9"
        ] }, void 0, true, {
          fileName: "app/routes/courses._index.tsx",
          lineNumber: 416,
          columnNumber: 37
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/courses._index.tsx",
        lineNumber: 414,
        columnNumber: 33
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "w-full bg-gray-200 rounded-full h-2.5", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-teal-500 h-2.5 rounded-full", style: {
        width: `${progress}%`
      } }, void 0, false, {
        fileName: "app/routes/courses._index.tsx",
        lineNumber: 419,
        columnNumber: 37
      }, this) }, void 0, false, {
        fileName: "app/routes/courses._index.tsx",
        lineNumber: 418,
        columnNumber: 33
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/courses._index.tsx",
      lineNumber: 413,
      columnNumber: 46
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mb-8", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-lg font-semibold mb-3 flex items-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-gray-600", children: [
        firstMarketplaceCount,
        " articles"
      ] }, void 0, true, {
        fileName: "app/routes/courses._index.tsx",
        lineNumber: 428,
        columnNumber: 33
      }, this) }, void 0, false, {
        fileName: "app/routes/courses._index.tsx",
        lineNumber: 427,
        columnNumber: 29
      }, this),
      firstMarketplaceCount === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-white rounded-lg shadow-md p-4 text-center text-gray-500", children: "Aucun article pour le supermarch\xE9" }, void 0, false, {
        fileName: "app/routes/courses._index.tsx",
        lineNumber: 431,
        columnNumber: 60
      }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-white rounded-lg shadow-md overflow-hidden", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", { className: "divide-y divide-gray-200", children: [
        categorizedItems.firstMarketplace.map((item) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ShoppingItemWithMarketplace, { item, onToggle: () => {
          toggleItemFetcher.submit({
            _action: "toggleItem",
            itemId: item.id,
            isChecked: item.isChecked.toString()
          }, {
            method: "post"
          });
        }, onRemove: () => {
          removeItemFetcher.submit({
            _action: "removeItem",
            itemId: item.id
          }, {
            method: "post"
          });
        }, onToggleMarketplace: () => {
          toggleMarketplaceFetcher.submit({
            _action: "toggleMarketplace",
            itemId: item.id,
            marketplace: item.marketplace.toString()
          }, {
            method: "post"
          });
        } }, item.id, false, {
          fileName: "app/routes/courses._index.tsx",
          lineNumber: 435,
          columnNumber: 88
        }, this)),
        categorizedItems.secondMarketplace.map((item) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ShoppingItemWithMarketplace, { item, onToggle: () => {
          toggleItemFetcher.submit({
            _action: "toggleItem",
            itemId: item.id,
            isChecked: item.isChecked.toString()
          }, {
            method: "post"
          });
        }, onRemove: () => {
          removeItemFetcher.submit({
            _action: "removeItem",
            itemId: item.id
          }, {
            method: "post"
          });
        }, onToggleMarketplace: () => {
          toggleMarketplaceFetcher.submit({
            _action: "toggleMarketplace",
            itemId: item.id,
            marketplace: item.marketplace.toString()
          }, {
            method: "post"
          });
        } }, item.id, false, {
          fileName: "app/routes/courses._index.tsx",
          lineNumber: 459,
          columnNumber: 89
        }, this))
      ] }, void 0, true, {
        fileName: "app/routes/courses._index.tsx",
        lineNumber: 434,
        columnNumber: 37
      }, this) }, void 0, false, {
        fileName: "app/routes/courses._index.tsx",
        lineNumber: 433,
        columnNumber: 42
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/courses._index.tsx",
      lineNumber: 426,
      columnNumber: 25
    }, this),
    categorizedItems.checked.length > 0 && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mb-8", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-lg font-semibold mb-3 text-gray-600", children: "Articles coch\xE9s" }, void 0, false, {
        fileName: "app/routes/courses._index.tsx",
        lineNumber: 489,
        columnNumber: 33
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-white rounded-lg shadow-md overflow-hidden", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", { className: "divide-y divide-gray-200", children: categorizedItems.checked.map((item) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ShoppingItem, { item, onToggle: () => {
        toggleItemFetcher.submit({
          _action: "toggleItem",
          itemId: item.id,
          isChecked: item.isChecked.toString()
        }, {
          method: "post"
        });
      }, onRemove: () => {
        removeItemFetcher.submit({
          _action: "removeItem",
          itemId: item.id
        }, {
          method: "post"
        });
      } }, item.id, false, {
        fileName: "app/routes/courses._index.tsx",
        lineNumber: 492,
        columnNumber: 79
      }, this)) }, void 0, false, {
        fileName: "app/routes/courses._index.tsx",
        lineNumber: 491,
        columnNumber: 37
      }, this) }, void 0, false, {
        fileName: "app/routes/courses._index.tsx",
        lineNumber: 490,
        columnNumber: 33
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/courses._index.tsx",
      lineNumber: 488,
      columnNumber: 65
    }, this),
    !showAddForm && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: () => setShowAddForm(true), className: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "w-5 h-5 mr-1", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M12 6v6m0 0v6m0-6h6m-6 0H6" }, void 0, false, {
        fileName: "app/routes/courses._index.tsx",
        lineNumber: 516,
        columnNumber: 41
      }, this) }, void 0, false, {
        fileName: "app/routes/courses._index.tsx",
        lineNumber: 515,
        columnNumber: 37
      }, this),
      "Ajouter un article"
    ] }, void 0, true, {
      fileName: "app/routes/courses._index.tsx",
      lineNumber: 514,
      columnNumber: 33
    }, this) }, void 0, false, {
      fileName: "app/routes/courses._index.tsx",
      lineNumber: 513,
      columnNumber: 42
    }, this),
    showAddForm && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-white rounded-lg shadow-md p-4 mt-6", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { className: "text-lg font-medium text-gray-900 mb-4", children: "Ajouter un article" }, void 0, false, {
        fileName: "app/routes/courses._index.tsx",
        lineNumber: 524,
        columnNumber: 33
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", { onSubmit: handleAddItem, children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "sm:col-span-3", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "name", className: "block text-sm font-medium text-gray-700", children: "Nom de l'article *" }, void 0, false, {
              fileName: "app/routes/courses._index.tsx",
              lineNumber: 528,
              columnNumber: 45
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-1", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "text", id: "name", name: "name", required: true, value: newItemName, onChange: (e) => setNewItemName(e.target.value), className: "shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm border-gray-300 rounded-md", placeholder: "Ex: Tomates" }, void 0, false, {
              fileName: "app/routes/courses._index.tsx",
              lineNumber: 532,
              columnNumber: 49
            }, this) }, void 0, false, {
              fileName: "app/routes/courses._index.tsx",
              lineNumber: 531,
              columnNumber: 45
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/courses._index.tsx",
            lineNumber: 527,
            columnNumber: 41
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "sm:col-span-2", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "quantity", className: "block text-sm font-medium text-gray-700", children: "Quantit\xE9" }, void 0, false, {
              fileName: "app/routes/courses._index.tsx",
              lineNumber: 537,
              columnNumber: 45
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-1", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "number", id: "quantity", name: "quantity", step: "0.01", min: "0", value: newItemQuantity, onChange: (e) => setNewItemQuantity(e.target.value), className: "shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm border-gray-300 rounded-md", placeholder: "Ex: 500" }, void 0, false, {
              fileName: "app/routes/courses._index.tsx",
              lineNumber: 541,
              columnNumber: 49
            }, this) }, void 0, false, {
              fileName: "app/routes/courses._index.tsx",
              lineNumber: 540,
              columnNumber: 45
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/courses._index.tsx",
            lineNumber: 536,
            columnNumber: 41
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "sm:col-span-1", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "unit", className: "block text-sm font-medium text-gray-700", children: "Unit\xE9" }, void 0, false, {
              fileName: "app/routes/courses._index.tsx",
              lineNumber: 546,
              columnNumber: 45
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-1", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "text", id: "unit", name: "unit", value: newItemUnit, onChange: (e) => setNewItemUnit(e.target.value), className: "shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm border-gray-300 rounded-md", placeholder: "Ex: g" }, void 0, false, {
              fileName: "app/routes/courses._index.tsx",
              lineNumber: 550,
              columnNumber: 49
            }, this) }, void 0, false, {
              fileName: "app/routes/courses._index.tsx",
              lineNumber: 549,
              columnNumber: 45
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/courses._index.tsx",
            lineNumber: 545,
            columnNumber: 41
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/courses._index.tsx",
          lineNumber: 526,
          columnNumber: 37
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-5 flex justify-end space-x-3", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "button", onClick: () => setShowAddForm(false), className: "px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500", children: "Annuler" }, void 0, false, {
            fileName: "app/routes/courses._index.tsx",
            lineNumber: 556,
            columnNumber: 41
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "submit", className: "inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500", children: "Ajouter" }, void 0, false, {
            fileName: "app/routes/courses._index.tsx",
            lineNumber: 559,
            columnNumber: 41
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/courses._index.tsx",
          lineNumber: 555,
          columnNumber: 37
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/courses._index.tsx",
        lineNumber: 525,
        columnNumber: 33
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/courses._index.tsx",
      lineNumber: 523,
      columnNumber: 41
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-center mt-8", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/menu", className: "inline-flex items-center text-teal-600 hover:text-teal-800", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "w-5 h-5 mr-1", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" }, void 0, false, {
        fileName: "app/routes/courses._index.tsx",
        lineNumber: 570,
        columnNumber: 37
      }, this) }, void 0, false, {
        fileName: "app/routes/courses._index.tsx",
        lineNumber: 569,
        columnNumber: 33
      }, this),
      "Retour au menu"
    ] }, void 0, true, {
      fileName: "app/routes/courses._index.tsx",
      lineNumber: 568,
      columnNumber: 29
    }, this) }, void 0, false, {
      fileName: "app/routes/courses._index.tsx",
      lineNumber: 567,
      columnNumber: 25
    }, this),
    showShareModal && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-white rounded-lg shadow-xl p-6 w-full max-w-md", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-lg font-bold mb-4", children: "Partager votre liste de courses" }, void 0, false, {
        fileName: "app/routes/courses._index.tsx",
        lineNumber: 579,
        columnNumber: 37
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(shareFetcher.Form, { method: "post", action: "/api/share", onSubmit: () => setShowShareModal(false), children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "_action", value: "shareMenu" }, void 0, false, {
          fileName: "app/routes/courses._index.tsx",
          lineNumber: 582,
          columnNumber: 41
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "shoppingListId", value: shoppingList.id }, void 0, false, {
          fileName: "app/routes/courses._index.tsx",
          lineNumber: 583,
          columnNumber: 41
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mb-4", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700 mb-1", children: "Adresse email" }, void 0, false, {
            fileName: "app/routes/courses._index.tsx",
            lineNumber: 587,
            columnNumber: 45
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "email", id: "email", name: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), className: "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500", placeholder: "exemple@email.com" }, void 0, false, {
            fileName: "app/routes/courses._index.tsx",
            lineNumber: 590,
            columnNumber: 45
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/courses._index.tsx",
          lineNumber: 586,
          columnNumber: 41
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex justify-end space-x-3", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "button", onClick: () => setShowShareModal(false), className: "px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50", children: "Annuler" }, void 0, false, {
            fileName: "app/routes/courses._index.tsx",
            lineNumber: 594,
            columnNumber: 45
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "submit", className: "px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500", children: "Partager" }, void 0, false, {
            fileName: "app/routes/courses._index.tsx",
            lineNumber: 597,
            columnNumber: 45
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/courses._index.tsx",
          lineNumber: 593,
          columnNumber: 41
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/courses._index.tsx",
        lineNumber: 581,
        columnNumber: 37
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/courses._index.tsx",
      lineNumber: 578,
      columnNumber: 33
    }, this) }, void 0, false, {
      fileName: "app/routes/courses._index.tsx",
      lineNumber: 577,
      columnNumber: 44
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/courses._index.tsx",
    lineNumber: 383,
    columnNumber: 30
  }, this) }, void 0, false, {
    fileName: "app/routes/courses._index.tsx",
    lineNumber: 380,
    columnNumber: 13
  }, this) }, void 0, false, {
    fileName: "app/routes/courses._index.tsx",
    lineNumber: 379,
    columnNumber: 10
  }, this);
}
_s(ShoppingList, "SsccXVQwbR/ZqXgIBUwqx3K5wHQ=", false, function() {
  return [useLoaderData, useFetcher, useFetcher, useFetcher, useFetcher, useFetcher, useFetcher];
});
_c = ShoppingList;
function ShoppingItemWithMarketplace({
  item,
  onToggle,
  onRemove,
  onToggleMarketplace
}) {
  _s2();
  const [itemInFocus, setItemInFocus] = (0, import_react2.useState)(false);
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { className: `px-4 py-3 flex items-center hover:bg-gray-50 relative ${item.marketplace ? "before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-green-500" : ""}`, onMouseEnter: () => setItemInFocus(true), onMouseLeave: () => setItemInFocus(false), onClick: onToggleMarketplace, children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "button", onClick: onToggle, className: "w-5 h-5 rounded-full border mr-3 flex items-center justify-center border-gray-300", "aria-label": "Cocher", children: item.isChecked && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "w-3 h-3 text-teal-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "3", d: "M5 13l4 4L19 7" }, void 0, false, {
        fileName: "app/routes/courses._index.tsx",
        lineNumber: 627,
        columnNumber: 25
      }, this) }, void 0, false, {
        fileName: "app/routes/courses._index.tsx",
        lineNumber: 626,
        columnNumber: 36
      }, this) }, void 0, false, {
        fileName: "app/routes/courses._index.tsx",
        lineNumber: 625,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex-grow", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "font-medium text-gray-700", children: item.ingredient.name }, void 0, false, {
          fileName: "app/routes/courses._index.tsx",
          lineNumber: 632,
          columnNumber: 17
        }, this),
        (item.quantity || item.unit) && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "ml-2 text-sm text-gray-500", children: [
          item.quantity && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: item.quantity }, void 0, false, {
            fileName: "app/routes/courses._index.tsx",
            lineNumber: 636,
            columnNumber: 43
          }, this),
          item.unit && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [
            " ",
            item.unit
          ] }, void 0, true, {
            fileName: "app/routes/courses._index.tsx",
            lineNumber: 637,
            columnNumber: 39
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/courses._index.tsx",
          lineNumber: 635,
          columnNumber: 50
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/courses._index.tsx",
        lineNumber: 631,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "button", onClick: onToggleMarketplace, className: `relative inline-flex h-6 w-11 items-center rounded-full mr-2 ${item.marketplace ? "bg-green-500 hover:bg-green-600" : "bg-gray-300 hover:bg-gray-400"}`, children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: `inline-block h-4 w-4 transform rounded-full bg-white transition ${item.marketplace ? "translate-x-6" : "translate-x-1"}` }, void 0, false, {
          fileName: "app/routes/courses._index.tsx",
          lineNumber: 644,
          columnNumber: 21
        }, this) }, void 0, false, {
          fileName: "app/routes/courses._index.tsx",
          lineNumber: 643,
          columnNumber: 17
        }, this),
        itemInFocus && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "button", onClick: onRemove, className: "text-gray-400 hover:text-red-500", "aria-label": "Supprimer", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }, void 0, false, {
          fileName: "app/routes/courses._index.tsx",
          lineNumber: 650,
          columnNumber: 29
        }, this) }, void 0, false, {
          fileName: "app/routes/courses._index.tsx",
          lineNumber: 649,
          columnNumber: 25
        }, this) }, void 0, false, {
          fileName: "app/routes/courses._index.tsx",
          lineNumber: 648,
          columnNumber: 33
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/courses._index.tsx",
        lineNumber: 641,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/courses._index.tsx",
      lineNumber: 624,
      columnNumber: 5
    }, this)
  );
}
_s2(ShoppingItemWithMarketplace, "Uj+BHE2rINk0Hf2e2WmjR0Lgadk=");
_c2 = ShoppingItemWithMarketplace;
function ShoppingItem({
  item,
  onToggle,
  onRemove
}) {
  _s3();
  const [itemInFocus, setItemInFocus] = (0, import_react2.useState)(false);
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { className: "px-4 py-3 flex items-center hover:bg-gray-50 bg-gray-50", onMouseEnter: () => setItemInFocus(true), onMouseLeave: () => setItemInFocus(false), children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "button", onClick: onToggle, className: "w-5 h-5 rounded-full border mr-3 flex items-center justify-center bg-teal-500 border-teal-500 text-white", "aria-label": "D\xE9cocher", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "w-3 h-3", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "3", d: "M5 13l4 4L19 7" }, void 0, false, {
      fileName: "app/routes/courses._index.tsx",
      lineNumber: 669,
      columnNumber: 21
    }, this) }, void 0, false, {
      fileName: "app/routes/courses._index.tsx",
      lineNumber: 668,
      columnNumber: 17
    }, this) }, void 0, false, {
      fileName: "app/routes/courses._index.tsx",
      lineNumber: 667,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex-grow", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "font-medium line-through text-gray-500", children: item.ingredient.name }, void 0, false, {
        fileName: "app/routes/courses._index.tsx",
        lineNumber: 674,
        columnNumber: 17
      }, this),
      (item.quantity || item.unit) && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "ml-2 text-sm text-gray-400", children: [
        item.quantity && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: item.quantity }, void 0, false, {
          fileName: "app/routes/courses._index.tsx",
          lineNumber: 678,
          columnNumber: 43
        }, this),
        item.unit && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [
          " ",
          item.unit
        ] }, void 0, true, {
          fileName: "app/routes/courses._index.tsx",
          lineNumber: 679,
          columnNumber: 39
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/courses._index.tsx",
        lineNumber: 677,
        columnNumber: 50
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/courses._index.tsx",
      lineNumber: 673,
      columnNumber: 13
    }, this),
    (itemInFocus || true) && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "button", onClick: onRemove, className: "text-gray-400 hover:text-red-500 ml-2", "aria-label": "Supprimer", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }, void 0, false, {
      fileName: "app/routes/courses._index.tsx",
      lineNumber: 685,
      columnNumber: 25
    }, this) }, void 0, false, {
      fileName: "app/routes/courses._index.tsx",
      lineNumber: 684,
      columnNumber: 21
    }, this) }, void 0, false, {
      fileName: "app/routes/courses._index.tsx",
      lineNumber: 683,
      columnNumber: 39
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/courses._index.tsx",
    lineNumber: 666,
    columnNumber: 10
  }, this);
}
_s3(ShoppingItem, "Uj+BHE2rINk0Hf2e2WmjR0Lgadk=");
_c3 = ShoppingItem;
var _c;
var _c2;
var _c3;
$RefreshReg$(_c, "ShoppingList");
$RefreshReg$(_c2, "ShoppingItemWithMarketplace");
$RefreshReg$(_c3, "ShoppingItem");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ShoppingList as default
};
//# sourceMappingURL=/build/routes/courses._index-WA3VNSEO.js.map
