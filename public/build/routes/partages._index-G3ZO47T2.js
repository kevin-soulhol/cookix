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
import "/build/_shared/chunk-7M6SC7J5.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// app/routes/partages._index.tsx
var import_node = __toESM(require_node(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/partages._index.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/partages._index.tsx"
  );
  import.meta.hot.lastModified = "1743068383846.0764";
}
function PartagesPage() {
  _s();
  const {
    pendingInvitations,
    sharedWithMe,
    sharedByMe,
    success,
    message
  } = useLoaderData();
  const deleteFetcher = useFetcher();
  const acceptFetcher = useFetcher();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Layout, { pageTitle: "Partages", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-2xl font-bold mb-8", children: "Mes partages" }, void 0, false, {
      fileName: "app/routes/partages._index.tsx",
      lineNumber: 52,
      columnNumber: 17
    }, this),
    !success && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-red-700", children: message }, void 0, false, {
      fileName: "app/routes/partages._index.tsx",
      lineNumber: 54,
      columnNumber: 30
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mb-12", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-xl font-semibold mb-4", children: "Invitations en attente" }, void 0, false, {
        fileName: "app/routes/partages._index.tsx",
        lineNumber: 60,
        columnNumber: 21
      }, this),
      pendingInvitations?.length > 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-white rounded-lg shadow-md overflow-hidden", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", { className: "divide-y divide-gray-200", children: pendingInvitations.map((invitation) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { className: "p-4 hover:bg-gray-50", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { className: "font-medium text-gray-900", children: [
            "Invitation de ",
            invitation.sharedByUser.email
          ] }, void 0, true, {
            fileName: "app/routes/partages._index.tsx",
            lineNumber: 67,
            columnNumber: 49
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm text-gray-500", children: invitation.includeShoppingList ? "Menu et liste de courses" : "Menu uniquement" }, void 0, false, {
            fileName: "app/routes/partages._index.tsx",
            lineNumber: 70,
            columnNumber: 49
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-xs text-gray-400", children: [
            "Re\xE7ue le ",
            new Date(invitation.createdAt).toLocaleDateString()
          ] }, void 0, true, {
            fileName: "app/routes/partages._index.tsx",
            lineNumber: 73,
            columnNumber: 49
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/partages._index.tsx",
          lineNumber: 66,
          columnNumber: 45
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex space-x-2", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(acceptFetcher.Form, { method: "post", action: "/api/share", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "_action", value: "acceptShare" }, void 0, false, {
              fileName: "app/routes/partages._index.tsx",
              lineNumber: 80,
              columnNumber: 53
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "token", value: invitation.token }, void 0, false, {
              fileName: "app/routes/partages._index.tsx",
              lineNumber: 81,
              columnNumber: 53
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "submit", className: "inline-flex items-center px-3 py-1.5 border border-green-500 text-xs font-medium rounded-md text-green-500 bg-white hover:bg-green-50", children: "Accepter" }, void 0, false, {
              fileName: "app/routes/partages._index.tsx",
              lineNumber: 82,
              columnNumber: 53
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/partages._index.tsx",
            lineNumber: 79,
            columnNumber: 49
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(deleteFetcher.Form, { method: "post", action: "/api/share", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "_action", value: "deleteShare" }, void 0, false, {
              fileName: "app/routes/partages._index.tsx",
              lineNumber: 88,
              columnNumber: 53
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "shareId", value: invitation.id }, void 0, false, {
              fileName: "app/routes/partages._index.tsx",
              lineNumber: 89,
              columnNumber: 53
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "submit", className: "inline-flex items-center px-3 py-1.5 border border-red-300 text-xs font-medium rounded-md text-red-500 bg-white hover:bg-red-50", children: "Refuser" }, void 0, false, {
              fileName: "app/routes/partages._index.tsx",
              lineNumber: 90,
              columnNumber: 53
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/partages._index.tsx",
            lineNumber: 87,
            columnNumber: 49
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/partages._index.tsx",
          lineNumber: 78,
          columnNumber: 45
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/partages._index.tsx",
        lineNumber: 65,
        columnNumber: 41
      }, this) }, invitation.id, false, {
        fileName: "app/routes/partages._index.tsx",
        lineNumber: 64,
        columnNumber: 71
      }, this)) }, void 0, false, {
        fileName: "app/routes/partages._index.tsx",
        lineNumber: 63,
        columnNumber: 29
      }, this) }, void 0, false, {
        fileName: "app/routes/partages._index.tsx",
        lineNumber: 62,
        columnNumber: 55
      }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-gray-500 bg-white p-6 rounded-lg shadow-md text-center", children: "Vous n'avez aucune invitation en attente." }, void 0, false, {
        fileName: "app/routes/partages._index.tsx",
        lineNumber: 98,
        columnNumber: 34
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/partages._index.tsx",
      lineNumber: 59,
      columnNumber: 17
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mb-12", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-xl font-semibold mb-4", children: "Partag\xE9s avec moi" }, void 0, false, {
        fileName: "app/routes/partages._index.tsx",
        lineNumber: 105,
        columnNumber: 21
      }, this),
      sharedWithMe?.length > 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-white rounded-lg shadow-md overflow-hidden", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", { className: "divide-y divide-gray-200", children: sharedWithMe.map((share) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { className: "p-4 hover:bg-gray-50", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { className: "font-medium text-gray-900", children: share.menu.name }, void 0, false, {
            fileName: "app/routes/partages._index.tsx",
            lineNumber: 112,
            columnNumber: 49
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm text-gray-500", children: [
            "Partag\xE9 par: ",
            share.sharedByUser.email
          ] }, void 0, true, {
            fileName: "app/routes/partages._index.tsx",
            lineNumber: 113,
            columnNumber: 49
          }, this),
          share.includeShoppingList && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800 mt-2", children: "Inclut la liste de courses" }, void 0, false, {
            fileName: "app/routes/partages._index.tsx",
            lineNumber: 116,
            columnNumber: 79
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/partages._index.tsx",
          lineNumber: 111,
          columnNumber: 45
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex space-x-2", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: `/menu?id=${share.menu.id}`, className: "inline-flex items-center px-3 py-1.5 border border-rose-500 text-xs font-medium rounded-md text-rose-500 bg-white hover:bg-rose-50", children: "Voir le menu" }, void 0, false, {
            fileName: "app/routes/partages._index.tsx",
            lineNumber: 122,
            columnNumber: 49
          }, this),
          share.includeShoppingList && share.shoppingList && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: `/courses?listId=${share.shoppingList.id}`, className: "inline-flex items-center px-3 py-1.5 border border-teal-500 text-xs font-medium rounded-md text-teal-500 bg-white hover:bg-teal-50", children: "Voir la liste" }, void 0, false, {
            fileName: "app/routes/partages._index.tsx",
            lineNumber: 126,
            columnNumber: 101
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(deleteFetcher.Form, { method: "post", action: "/api/share", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "_action", value: "deleteShare" }, void 0, false, {
              fileName: "app/routes/partages._index.tsx",
              lineNumber: 131,
              columnNumber: 53
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "shareId", value: share.id }, void 0, false, {
              fileName: "app/routes/partages._index.tsx",
              lineNumber: 132,
              columnNumber: 53
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "submit", className: "inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50", onClick: () => confirm("\xCAtes-vous s\xFBr de vouloir supprimer ce partage ?"), children: "Supprimer" }, void 0, false, {
              fileName: "app/routes/partages._index.tsx",
              lineNumber: 133,
              columnNumber: 53
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/partages._index.tsx",
            lineNumber: 130,
            columnNumber: 49
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/partages._index.tsx",
          lineNumber: 121,
          columnNumber: 45
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/partages._index.tsx",
        lineNumber: 110,
        columnNumber: 41
      }, this) }, share.id, false, {
        fileName: "app/routes/partages._index.tsx",
        lineNumber: 109,
        columnNumber: 60
      }, this)) }, void 0, false, {
        fileName: "app/routes/partages._index.tsx",
        lineNumber: 108,
        columnNumber: 29
      }, this) }, void 0, false, {
        fileName: "app/routes/partages._index.tsx",
        lineNumber: 107,
        columnNumber: 49
      }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-gray-500 bg-white p-6 rounded-lg shadow-md text-center", children: "Aucun menu n'est partag\xE9 avec vous pour le moment." }, void 0, false, {
        fileName: "app/routes/partages._index.tsx",
        lineNumber: 141,
        columnNumber: 34
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/partages._index.tsx",
      lineNumber: 104,
      columnNumber: 17
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-xl font-semibold mb-4", children: "Partag\xE9s par moi" }, void 0, false, {
        fileName: "app/routes/partages._index.tsx",
        lineNumber: 148,
        columnNumber: 21
      }, this),
      sharedByMe?.length > 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-white rounded-lg shadow-md overflow-hidden", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", { className: "divide-y divide-gray-200", children: sharedByMe.map((share) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { className: "p-4 hover:bg-gray-50", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm text-gray-500", children: [
            "Partag\xE9 avec: ",
            share.sharedWithEmail
          ] }, void 0, true, {
            fileName: "app/routes/partages._index.tsx",
            lineNumber: 155,
            columnNumber: 49
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex space-x-2 mt-1", children: [
            share.includeShoppingList && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800", children: "Inclut la liste de courses" }, void 0, false, {
              fileName: "app/routes/partages._index.tsx",
              lineNumber: 159,
              columnNumber: 83
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${share.isAccepted ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`, children: share.isAccepted ? "Accept\xE9" : "En attente" }, void 0, false, {
              fileName: "app/routes/partages._index.tsx",
              lineNumber: 163,
              columnNumber: 53
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/partages._index.tsx",
            lineNumber: 158,
            columnNumber: 49
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/partages._index.tsx",
          lineNumber: 154,
          columnNumber: 45
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(deleteFetcher.Form, { method: "post", action: "/api/share", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "_action", value: "deleteShare" }, void 0, false, {
            fileName: "app/routes/partages._index.tsx",
            lineNumber: 170,
            columnNumber: 49
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "shareId", value: share.id }, void 0, false, {
            fileName: "app/routes/partages._index.tsx",
            lineNumber: 171,
            columnNumber: 49
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "submit", className: "inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50", onClick: () => confirm("\xCAtes-vous s\xFBr de vouloir supprimer ce partage ?"), children: "Supprimer" }, void 0, false, {
            fileName: "app/routes/partages._index.tsx",
            lineNumber: 172,
            columnNumber: 49
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/partages._index.tsx",
          lineNumber: 169,
          columnNumber: 45
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/partages._index.tsx",
        lineNumber: 153,
        columnNumber: 41
      }, this) }, share.id, false, {
        fileName: "app/routes/partages._index.tsx",
        lineNumber: 152,
        columnNumber: 58
      }, this)) }, void 0, false, {
        fileName: "app/routes/partages._index.tsx",
        lineNumber: 151,
        columnNumber: 29
      }, this) }, void 0, false, {
        fileName: "app/routes/partages._index.tsx",
        lineNumber: 150,
        columnNumber: 47
      }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-gray-500 bg-white p-6 rounded-lg shadow-md text-center", children: "Vous n'avez partag\xE9 aucun menu pour le moment." }, void 0, false, {
        fileName: "app/routes/partages._index.tsx",
        lineNumber: 179,
        columnNumber: 34
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/partages._index.tsx",
      lineNumber: 147,
      columnNumber: 17
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/partages._index.tsx",
    lineNumber: 51,
    columnNumber: 13
  }, this) }, void 0, false, {
    fileName: "app/routes/partages._index.tsx",
    lineNumber: 50,
    columnNumber: 10
  }, this);
}
_s(PartagesPage, "V61VKl9UVLTBq2yozuIijchWAds=", false, function() {
  return [useLoaderData, useFetcher, useFetcher];
});
_c = PartagesPage;
var _c;
$RefreshReg$(_c, "PartagesPage");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  PartagesPage as default
};
//# sourceMappingURL=/build/routes/partages._index-G3ZO47T2.js.map
