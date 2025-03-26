import {
  require_db
} from "/build/_shared/chunk-KONDUBG3.js";
import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
  Form,
  useLoaderData
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

// app/routes/invitation.$token.tsx
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
    window.$RefreshRuntime$.register(type, '"app/routes/invitation.$token.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/invitation.$token.tsx"
  );
  import.meta.hot.lastModified = "1742653529970.773";
}
function InvitationPage() {
  _s();
  const {
    success,
    invitation,
    message,
    isLoggedIn
  } = useLoaderData();
  const [acceptingInvitation, setAcceptingInvitation] = (0, import_react2.useState)(false);
  if (!success) {
    return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "min-h-screen bg-gray-100 flex flex-col justify-center items-center p-6", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-white p-8 rounded-lg shadow-md max-w-md w-full", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "mx-auto h-12 w-12 text-red-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" }, void 0, false, {
        fileName: "app/routes/invitation.$token.tsx",
        lineNumber: 92,
        columnNumber: 29
      }, this) }, void 0, false, {
        fileName: "app/routes/invitation.$token.tsx",
        lineNumber: 91,
        columnNumber: 25
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "mt-3 text-lg font-medium text-gray-900", children: "Erreur" }, void 0, false, {
        fileName: "app/routes/invitation.$token.tsx",
        lineNumber: 94,
        columnNumber: 25
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-2 text-gray-600", children: message }, void 0, false, {
        fileName: "app/routes/invitation.$token.tsx",
        lineNumber: 95,
        columnNumber: 25
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-5", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", { href: "/", className: "inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500", children: "Retour \xE0 l'accueil" }, void 0, false, {
        fileName: "app/routes/invitation.$token.tsx",
        lineNumber: 98,
        columnNumber: 29
      }, this) }, void 0, false, {
        fileName: "app/routes/invitation.$token.tsx",
        lineNumber: 96,
        columnNumber: 25
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/invitation.$token.tsx",
      lineNumber: 90,
      columnNumber: 21
    }, this) }, void 0, false, {
      fileName: "app/routes/invitation.$token.tsx",
      lineNumber: 89,
      columnNumber: 17
    }, this) }, void 0, false, {
      fileName: "app/routes/invitation.$token.tsx",
      lineNumber: 88,
      columnNumber: 12
    }, this);
  }
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "min-h-screen bg-gray-100 flex flex-col justify-center items-center p-6", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-white p-8 rounded-lg shadow-md max-w-md w-full", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-center", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "mx-auto h-12 w-12 text-rose-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M12 6v6m0 0v6m0-6h6m-6 0H6" }, void 0, false, {
      fileName: "app/routes/invitation.$token.tsx",
      lineNumber: 110,
      columnNumber: 25
    }, this) }, void 0, false, {
      fileName: "app/routes/invitation.$token.tsx",
      lineNumber: 109,
      columnNumber: 21
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "mt-3 text-xl font-bold text-gray-900", children: "Invitation Cookix" }, void 0, false, {
      fileName: "app/routes/invitation.$token.tsx",
      lineNumber: 112,
      columnNumber: 21
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-2 text-gray-600", children: [
      invitation.sharedByUser.email,
      " a partag\xE9 ",
      invitation.includeShoppingList ? "un menu et une liste de courses" : "un menu",
      " avec vous."
    ] }, void 0, true, {
      fileName: "app/routes/invitation.$token.tsx",
      lineNumber: 114,
      columnNumber: 21
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-5 text-left", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { className: "font-medium text-gray-700", children: "D\xE9tails du menu:" }, void 0, false, {
        fileName: "app/routes/invitation.$token.tsx",
        lineNumber: 119,
        columnNumber: 25
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-1 text-gray-600", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "font-medium", children: "Nom:" }, void 0, false, {
          fileName: "app/routes/invitation.$token.tsx",
          lineNumber: 121,
          columnNumber: 29
        }, this),
        " ",
        invitation.menu.name
      ] }, void 0, true, {
        fileName: "app/routes/invitation.$token.tsx",
        lineNumber: 120,
        columnNumber: 25
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-gray-600", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "font-medium", children: "P\xE9riode:" }, void 0, false, {
          fileName: "app/routes/invitation.$token.tsx",
          lineNumber: 124,
          columnNumber: 29
        }, this),
        " ",
        new Date(invitation.menu.startDate).toLocaleDateString(),
        " - ",
        new Date(invitation.menu.endDate).toLocaleDateString()
      ] }, void 0, true, {
        fileName: "app/routes/invitation.$token.tsx",
        lineNumber: 123,
        columnNumber: 25
      }, this),
      invitation.includeShoppingList && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-3 p-2 bg-teal-50 border border-teal-200 rounded-md", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-teal-700 text-sm", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "inline-block w-4 h-4 mr-1", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" }, void 0, false, {
          fileName: "app/routes/invitation.$token.tsx",
          lineNumber: 130,
          columnNumber: 41
        }, this) }, void 0, false, {
          fileName: "app/routes/invitation.$token.tsx",
          lineNumber: 129,
          columnNumber: 37
        }, this),
        "La liste de courses associ\xE9e sera \xE9galement partag\xE9e avec vous."
      ] }, void 0, true, {
        fileName: "app/routes/invitation.$token.tsx",
        lineNumber: 128,
        columnNumber: 33
      }, this) }, void 0, false, {
        fileName: "app/routes/invitation.$token.tsx",
        lineNumber: 127,
        columnNumber: 60
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/invitation.$token.tsx",
      lineNumber: 118,
      columnNumber: 21
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-6", children: [
      isLoggedIn ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Form, { method: "post", action: "/api/share", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "_action", value: "acceptShare" }, void 0, false, {
          fileName: "app/routes/invitation.$token.tsx",
          lineNumber: 139,
          columnNumber: 33
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "token", value: invitation.token }, void 0, false, {
          fileName: "app/routes/invitation.$token.tsx",
          lineNumber: 140,
          columnNumber: 33
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "submit", className: "w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500", onClick: () => setAcceptingInvitation(true), disabled: acceptingInvitation, children: acceptingInvitation ? "Acceptation en cours..." : "Accepter l'invitation" }, void 0, false, {
          fileName: "app/routes/invitation.$token.tsx",
          lineNumber: 142,
          columnNumber: 33
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/invitation.$token.tsx",
        lineNumber: 138,
        columnNumber: 39
      }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mb-3 text-sm text-gray-600", children: "Vous devez vous connecter pour accepter cette invitation." }, void 0, false, {
          fileName: "app/routes/invitation.$token.tsx",
          lineNumber: 146,
          columnNumber: 33
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", { href: `/login?redirectTo=/invitation/${invitation.token}`, className: "w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500", children: "Se connecter" }, void 0, false, {
          fileName: "app/routes/invitation.$token.tsx",
          lineNumber: 147,
          columnNumber: 33
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/invitation.$token.tsx",
        lineNumber: 145,
        columnNumber: 39
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", { href: "/", className: "mt-3 w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500", children: "Retour \xE0 l'accueil" }, void 0, false, {
        fileName: "app/routes/invitation.$token.tsx",
        lineNumber: 153,
        columnNumber: 25
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/invitation.$token.tsx",
      lineNumber: 137,
      columnNumber: 21
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/invitation.$token.tsx",
    lineNumber: 108,
    columnNumber: 17
  }, this) }, void 0, false, {
    fileName: "app/routes/invitation.$token.tsx",
    lineNumber: 107,
    columnNumber: 13
  }, this) }, void 0, false, {
    fileName: "app/routes/invitation.$token.tsx",
    lineNumber: 106,
    columnNumber: 10
  }, this);
}
_s(InvitationPage, "53SEBOxBJCsnZWwtB66KX3aOy7I=", false, function() {
  return [useLoaderData];
});
_c = InvitationPage;
var _c;
$RefreshReg$(_c, "InvitationPage");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  InvitationPage as default
};
//# sourceMappingURL=/build/routes/invitation.$token-ALUQTYWP.js.map
