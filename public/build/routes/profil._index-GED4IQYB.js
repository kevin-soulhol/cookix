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
  Form,
  useActionData,
  useLoaderData,
  useNavigation
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

// app/routes/profil._index.tsx
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
    window.$RefreshRuntime$.register(type, '"app/routes/profil._index.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/profil._index.tsx"
  );
  import.meta.hot.lastModified = "1742575085017.028";
}
function Profile() {
  _s();
  const {
    user,
    stats
  } = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const [showUpdateEmailForm, setShowUpdateEmailForm] = (0, import_react2.useState)(false);
  const [showUpdatePasswordForm, setShowUpdatePasswordForm] = (0, import_react2.useState)(false);
  const [showDeleteAccountForm, setShowDeleteAccountForm] = (0, import_react2.useState)(false);
  const updateEmailFormRef = (0, import_react2.useRef)(null);
  const updatePasswordFormRef = (0, import_react2.useRef)(null);
  const deleteAccountFormRef = (0, import_react2.useRef)(null);
  const isSubmitting = navigation.state === "submitting";
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Layout, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-3xl font-bold text-gray-900 mb-8", children: "Mon profil" }, void 0, false, {
      fileName: "app/routes/profil._index.tsx",
      lineNumber: 120,
      columnNumber: 17
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-white shadow overflow-hidden sm:rounded-lg mb-8", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "px-4 py-5 sm:px-6 flex justify-between items-center", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-lg leading-6 font-medium text-gray-900", children: "Informations personnelles" }, void 0, false, {
            fileName: "app/routes/profil._index.tsx",
            lineNumber: 126,
            columnNumber: 29
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-1 max-w-2xl text-sm text-gray-500", children: "D\xE9tails et param\xE8tres de votre compte" }, void 0, false, {
            fileName: "app/routes/profil._index.tsx",
            lineNumber: 127,
            columnNumber: 29
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/profil._index.tsx",
          lineNumber: 125,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "button", onClick: () => setShowUpdateEmailForm(!showUpdateEmailForm), className: "inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500", children: "Modifier" }, void 0, false, {
          fileName: "app/routes/profil._index.tsx",
          lineNumber: 131,
          columnNumber: 25
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/profil._index.tsx",
        lineNumber: 124,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "border-t border-gray-200 px-4 py-5 sm:p-0", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("dl", { className: "sm:divide-y sm:divide-gray-200", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("dt", { className: "text-sm font-medium text-gray-500", children: "Adresse email" }, void 0, false, {
            fileName: "app/routes/profil._index.tsx",
            lineNumber: 138,
            columnNumber: 33
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("dd", { className: "mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2", children: user.email }, void 0, false, {
            fileName: "app/routes/profil._index.tsx",
            lineNumber: 139,
            columnNumber: 33
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/profil._index.tsx",
          lineNumber: 137,
          columnNumber: 29
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("dt", { className: "text-sm font-medium text-gray-500", children: "Mot de passe" }, void 0, false, {
            fileName: "app/routes/profil._index.tsx",
            lineNumber: 142,
            columnNumber: 33
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("dd", { className: "mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2", children: [
            "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "button", onClick: () => setShowUpdatePasswordForm(!showUpdatePasswordForm), className: "ml-4 text-rose-500 hover:text-rose-600 underline", children: "Modifier le mot de passe" }, void 0, false, {
              fileName: "app/routes/profil._index.tsx",
              lineNumber: 145,
              columnNumber: 37
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/profil._index.tsx",
            lineNumber: 143,
            columnNumber: 33
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/profil._index.tsx",
          lineNumber: 141,
          columnNumber: 29
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/profil._index.tsx",
        lineNumber: 136,
        columnNumber: 25
      }, this) }, void 0, false, {
        fileName: "app/routes/profil._index.tsx",
        lineNumber: 135,
        columnNumber: 21
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/profil._index.tsx",
      lineNumber: 123,
      columnNumber: 17
    }, this),
    showUpdateEmailForm && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-white shadow overflow-hidden sm:rounded-lg mb-8", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "px-4 py-5 sm:px-6", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { className: "text-lg leading-6 font-medium text-gray-900", children: "Modifier votre adresse email" }, void 0, false, {
        fileName: "app/routes/profil._index.tsx",
        lineNumber: 157,
        columnNumber: 29
      }, this) }, void 0, false, {
        fileName: "app/routes/profil._index.tsx",
        lineNumber: 156,
        columnNumber: 25
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "border-t border-gray-200 px-4 py-5 sm:p-6", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Form, { ref: updateEmailFormRef, method: "post", className: "space-y-6", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "_action", value: "updateProfile" }, void 0, false, {
          fileName: "app/routes/profil._index.tsx",
          lineNumber: 161,
          columnNumber: 33
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700", children: "Nouvelle adresse email" }, void 0, false, {
            fileName: "app/routes/profil._index.tsx",
            lineNumber: 164,
            columnNumber: 37
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-1", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { id: "email", name: "email", type: "email", autoComplete: "email", defaultValue: user.email, required: true, className: "appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm" }, void 0, false, {
              fileName: "app/routes/profil._index.tsx",
              lineNumber: 168,
              columnNumber: 41
            }, this),
            actionData?.errors?.email && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-2 text-sm text-red-600", children: actionData.errors.email }, void 0, false, {
              fileName: "app/routes/profil._index.tsx",
              lineNumber: 169,
              columnNumber: 71
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/profil._index.tsx",
            lineNumber: 167,
            columnNumber: 37
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/profil._index.tsx",
          lineNumber: 163,
          columnNumber: 33
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex justify-end space-x-3", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "button", onClick: () => setShowUpdateEmailForm(false), className: "px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500", children: "Annuler" }, void 0, false, {
            fileName: "app/routes/profil._index.tsx",
            lineNumber: 174,
            columnNumber: 37
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "submit", disabled: isSubmitting, className: "px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50", children: isSubmitting ? "Enregistrement..." : "Enregistrer" }, void 0, false, {
            fileName: "app/routes/profil._index.tsx",
            lineNumber: 177,
            columnNumber: 37
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/profil._index.tsx",
          lineNumber: 173,
          columnNumber: 33
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/profil._index.tsx",
        lineNumber: 160,
        columnNumber: 29
      }, this) }, void 0, false, {
        fileName: "app/routes/profil._index.tsx",
        lineNumber: 159,
        columnNumber: 25
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/profil._index.tsx",
      lineNumber: 155,
      columnNumber: 41
    }, this),
    showUpdatePasswordForm && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-white shadow overflow-hidden sm:rounded-lg mb-8", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "px-4 py-5 sm:px-6", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { className: "text-lg leading-6 font-medium text-gray-900", children: "Modifier votre mot de passe" }, void 0, false, {
        fileName: "app/routes/profil._index.tsx",
        lineNumber: 188,
        columnNumber: 29
      }, this) }, void 0, false, {
        fileName: "app/routes/profil._index.tsx",
        lineNumber: 187,
        columnNumber: 25
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "border-t border-gray-200 px-4 py-5 sm:p-6", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Form, { ref: updatePasswordFormRef, method: "post", className: "space-y-6", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "_action", value: "updateProfile" }, void 0, false, {
          fileName: "app/routes/profil._index.tsx",
          lineNumber: 192,
          columnNumber: 33
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "currentPassword", className: "block text-sm font-medium text-gray-700", children: "Mot de passe actuel" }, void 0, false, {
            fileName: "app/routes/profil._index.tsx",
            lineNumber: 195,
            columnNumber: 37
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-1", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { id: "currentPassword", name: "currentPassword", type: "password", autoComplete: "current-password", required: true, className: "appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm" }, void 0, false, {
              fileName: "app/routes/profil._index.tsx",
              lineNumber: 199,
              columnNumber: 41
            }, this),
            actionData?.errors?.currentPassword && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-2 text-sm text-red-600", children: actionData.errors.currentPassword }, void 0, false, {
              fileName: "app/routes/profil._index.tsx",
              lineNumber: 200,
              columnNumber: 81
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/profil._index.tsx",
            lineNumber: 198,
            columnNumber: 37
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/profil._index.tsx",
          lineNumber: 194,
          columnNumber: 33
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "newPassword", className: "block text-sm font-medium text-gray-700", children: "Nouveau mot de passe" }, void 0, false, {
            fileName: "app/routes/profil._index.tsx",
            lineNumber: 205,
            columnNumber: 37
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-1", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { id: "newPassword", name: "newPassword", type: "password", autoComplete: "new-password", required: true, className: "appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm" }, void 0, false, {
              fileName: "app/routes/profil._index.tsx",
              lineNumber: 209,
              columnNumber: 41
            }, this),
            actionData?.errors?.newPassword && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-2 text-sm text-red-600", children: actionData.errors.newPassword }, void 0, false, {
              fileName: "app/routes/profil._index.tsx",
              lineNumber: 210,
              columnNumber: 77
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/profil._index.tsx",
            lineNumber: 208,
            columnNumber: 37
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/profil._index.tsx",
          lineNumber: 204,
          columnNumber: 33
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "newPasswordConfirm", className: "block text-sm font-medium text-gray-700", children: "Confirmer le nouveau mot de passe" }, void 0, false, {
            fileName: "app/routes/profil._index.tsx",
            lineNumber: 215,
            columnNumber: 37
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-1", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { id: "newPasswordConfirm", name: "newPasswordConfirm", type: "password", autoComplete: "new-password", required: true, className: "appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm" }, void 0, false, {
              fileName: "app/routes/profil._index.tsx",
              lineNumber: 219,
              columnNumber: 41
            }, this),
            actionData?.errors?.newPasswordConfirm && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-2 text-sm text-red-600", children: actionData.errors.newPasswordConfirm }, void 0, false, {
              fileName: "app/routes/profil._index.tsx",
              lineNumber: 220,
              columnNumber: 84
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/profil._index.tsx",
            lineNumber: 218,
            columnNumber: 37
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/profil._index.tsx",
          lineNumber: 214,
          columnNumber: 33
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex justify-end space-x-3", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "button", onClick: () => setShowUpdatePasswordForm(false), className: "px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500", children: "Annuler" }, void 0, false, {
            fileName: "app/routes/profil._index.tsx",
            lineNumber: 225,
            columnNumber: 37
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "submit", disabled: isSubmitting, className: "px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50", children: isSubmitting ? "Enregistrement..." : "Enregistrer" }, void 0, false, {
            fileName: "app/routes/profil._index.tsx",
            lineNumber: 228,
            columnNumber: 37
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/profil._index.tsx",
          lineNumber: 224,
          columnNumber: 33
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/profil._index.tsx",
        lineNumber: 191,
        columnNumber: 29
      }, this) }, void 0, false, {
        fileName: "app/routes/profil._index.tsx",
        lineNumber: 190,
        columnNumber: 25
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/profil._index.tsx",
      lineNumber: 186,
      columnNumber: 44
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-white shadow overflow-hidden sm:rounded-lg mb-8", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "px-4 py-5 sm:px-6", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-lg leading-6 font-medium text-gray-900", children: "Statistiques de votre compte" }, void 0, false, {
          fileName: "app/routes/profil._index.tsx",
          lineNumber: 239,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-1 max-w-2xl text-sm text-gray-500", children: "R\xE9capitulatif de votre activit\xE9 sur Cookix" }, void 0, false, {
          fileName: "app/routes/profil._index.tsx",
          lineNumber: 240,
          columnNumber: 25
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/profil._index.tsx",
        lineNumber: 238,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "border-t border-gray-200", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-200", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "px-6 py-5 text-center", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("dt", { className: "text-sm font-medium text-gray-500", children: "Menus cr\xE9\xE9s" }, void 0, false, {
            fileName: "app/routes/profil._index.tsx",
            lineNumber: 247,
            columnNumber: 33
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("dd", { className: "mt-1 text-3xl font-semibold text-rose-500", children: stats.menusCount }, void 0, false, {
            fileName: "app/routes/profil._index.tsx",
            lineNumber: 248,
            columnNumber: 33
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/profil._index.tsx",
          lineNumber: 246,
          columnNumber: 29
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "px-6 py-5 text-center", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("dt", { className: "text-sm font-medium text-gray-500", children: "Listes de courses" }, void 0, false, {
            fileName: "app/routes/profil._index.tsx",
            lineNumber: 251,
            columnNumber: 33
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("dd", { className: "mt-1 text-3xl font-semibold text-rose-500", children: stats.shoppingListsCount }, void 0, false, {
            fileName: "app/routes/profil._index.tsx",
            lineNumber: 252,
            columnNumber: 33
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/profil._index.tsx",
          lineNumber: 250,
          columnNumber: 29
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "px-6 py-5 text-center", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("dt", { className: "text-sm font-medium text-gray-500", children: "Recettes favorites" }, void 0, false, {
            fileName: "app/routes/profil._index.tsx",
            lineNumber: 255,
            columnNumber: 33
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("dd", { className: "mt-1 text-3xl font-semibold text-rose-500", children: stats.favoritesCount }, void 0, false, {
            fileName: "app/routes/profil._index.tsx",
            lineNumber: 256,
            columnNumber: 33
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/profil._index.tsx",
          lineNumber: 254,
          columnNumber: 29
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/profil._index.tsx",
        lineNumber: 245,
        columnNumber: 25
      }, this) }, void 0, false, {
        fileName: "app/routes/profil._index.tsx",
        lineNumber: 244,
        columnNumber: 21
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/profil._index.tsx",
      lineNumber: 237,
      columnNumber: 17
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-white shadow overflow-hidden sm:rounded-lg mb-8", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "px-4 py-5 sm:px-6", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-lg leading-6 font-medium text-gray-900", children: "Supprimer mon compte" }, void 0, false, {
          fileName: "app/routes/profil._index.tsx",
          lineNumber: 265,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-1 max-w-2xl text-sm text-gray-500", children: "Cette action est irr\xE9versible et supprimera toutes vos donn\xE9es" }, void 0, false, {
          fileName: "app/routes/profil._index.tsx",
          lineNumber: 266,
          columnNumber: 25
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/profil._index.tsx",
        lineNumber: 264,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "border-t border-gray-200 px-4 py-5 sm:p-6", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm text-gray-500 mb-4", children: "La suppression de votre compte entra\xEEnera la perte d\xE9finitive de toutes vos donn\xE9es, y compris vos menus, listes de courses et recettes favorites." }, void 0, false, {
          fileName: "app/routes/profil._index.tsx",
          lineNumber: 271,
          columnNumber: 25
        }, this),
        !showDeleteAccountForm ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "button", onClick: () => setShowDeleteAccountForm(true), className: "inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500", children: "Supprimer mon compte" }, void 0, false, {
          fileName: "app/routes/profil._index.tsx",
          lineNumber: 275,
          columnNumber: 51
        }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-red-50 border-l-4 border-red-400 p-4 mb-4", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex-shrink-0", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "h-5 w-5 text-red-400", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z", clipRule: "evenodd" }, void 0, false, {
              fileName: "app/routes/profil._index.tsx",
              lineNumber: 281,
              columnNumber: 45
            }, this) }, void 0, false, {
              fileName: "app/routes/profil._index.tsx",
              lineNumber: 280,
              columnNumber: 41
            }, this) }, void 0, false, {
              fileName: "app/routes/profil._index.tsx",
              lineNumber: 279,
              columnNumber: 37
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "ml-3", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { className: "text-sm font-medium text-red-800", children: "Attention : Cette action est irr\xE9versible" }, void 0, false, {
                fileName: "app/routes/profil._index.tsx",
                lineNumber: 285,
                columnNumber: 41
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-2 text-sm text-red-700", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: "Pour confirmer la suppression de votre compte, veuillez saisir votre mot de passe." }, void 0, false, {
                fileName: "app/routes/profil._index.tsx",
                lineNumber: 287,
                columnNumber: 45
              }, this) }, void 0, false, {
                fileName: "app/routes/profil._index.tsx",
                lineNumber: 286,
                columnNumber: 41
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/profil._index.tsx",
              lineNumber: 284,
              columnNumber: 37
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/profil._index.tsx",
            lineNumber: 278,
            columnNumber: 33
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Form, { ref: deleteAccountFormRef, method: "post", className: "mt-4", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "_action", value: "deleteAccount" }, void 0, false, {
              fileName: "app/routes/profil._index.tsx",
              lineNumber: 293,
              columnNumber: 37
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mb-4", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "confirmPassword", className: "block text-sm font-medium text-gray-700", children: "Confirmez votre mot de passe" }, void 0, false, {
                fileName: "app/routes/profil._index.tsx",
                lineNumber: 296,
                columnNumber: 41
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-1", children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { id: "confirmPassword", name: "confirmPassword", type: "password", autoComplete: "current-password", required: true, className: "appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" }, void 0, false, {
                  fileName: "app/routes/profil._index.tsx",
                  lineNumber: 300,
                  columnNumber: 45
                }, this),
                actionData?.errors?.confirmPassword && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-2 text-sm text-red-600", children: actionData.errors.confirmPassword }, void 0, false, {
                  fileName: "app/routes/profil._index.tsx",
                  lineNumber: 301,
                  columnNumber: 85
                }, this)
              ] }, void 0, true, {
                fileName: "app/routes/profil._index.tsx",
                lineNumber: 299,
                columnNumber: 41
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/profil._index.tsx",
              lineNumber: 295,
              columnNumber: 37
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex justify-end space-x-3", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "button", onClick: () => setShowDeleteAccountForm(false), className: "px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500", children: "Annuler" }, void 0, false, {
                fileName: "app/routes/profil._index.tsx",
                lineNumber: 306,
                columnNumber: 41
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "submit", disabled: isSubmitting, className: "px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50", children: isSubmitting ? "Suppression..." : "Supprimer d\xE9finitivement" }, void 0, false, {
                fileName: "app/routes/profil._index.tsx",
                lineNumber: 309,
                columnNumber: 41
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/profil._index.tsx",
              lineNumber: 305,
              columnNumber: 37
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/profil._index.tsx",
            lineNumber: 292,
            columnNumber: 33
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/profil._index.tsx",
          lineNumber: 277,
          columnNumber: 41
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/profil._index.tsx",
        lineNumber: 270,
        columnNumber: 21
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/profil._index.tsx",
      lineNumber: 263,
      columnNumber: 17
    }, this),
    actionData?.success && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-green-50 border-l-4 border-green-400 p-4 mb-8", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex-shrink-0", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "h-5 w-5 text-green-400", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z", clipRule: "evenodd" }, void 0, false, {
        fileName: "app/routes/profil._index.tsx",
        lineNumber: 323,
        columnNumber: 37
      }, this) }, void 0, false, {
        fileName: "app/routes/profil._index.tsx",
        lineNumber: 322,
        columnNumber: 33
      }, this) }, void 0, false, {
        fileName: "app/routes/profil._index.tsx",
        lineNumber: 321,
        columnNumber: 29
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "ml-3", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm text-green-700", children: actionData.message }, void 0, false, {
        fileName: "app/routes/profil._index.tsx",
        lineNumber: 327,
        columnNumber: 33
      }, this) }, void 0, false, {
        fileName: "app/routes/profil._index.tsx",
        lineNumber: 326,
        columnNumber: 29
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/profil._index.tsx",
      lineNumber: 320,
      columnNumber: 25
    }, this) }, void 0, false, {
      fileName: "app/routes/profil._index.tsx",
      lineNumber: 319,
      columnNumber: 41
    }, this),
    actionData?.success === false && !actionData?.errors && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-red-50 border-l-4 border-red-400 p-4 mb-8", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex-shrink-0", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "h-5 w-5 text-red-400", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z", clipRule: "evenodd" }, void 0, false, {
        fileName: "app/routes/profil._index.tsx",
        lineNumber: 337,
        columnNumber: 37
      }, this) }, void 0, false, {
        fileName: "app/routes/profil._index.tsx",
        lineNumber: 336,
        columnNumber: 33
      }, this) }, void 0, false, {
        fileName: "app/routes/profil._index.tsx",
        lineNumber: 335,
        columnNumber: 29
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "ml-3", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm text-red-700", children: actionData.message }, void 0, false, {
        fileName: "app/routes/profil._index.tsx",
        lineNumber: 341,
        columnNumber: 33
      }, this) }, void 0, false, {
        fileName: "app/routes/profil._index.tsx",
        lineNumber: 340,
        columnNumber: 29
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/profil._index.tsx",
      lineNumber: 334,
      columnNumber: 25
    }, this) }, void 0, false, {
      fileName: "app/routes/profil._index.tsx",
      lineNumber: 333,
      columnNumber: 74
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/profil._index.tsx",
    lineNumber: 119,
    columnNumber: 13
  }, this) }, void 0, false, {
    fileName: "app/routes/profil._index.tsx",
    lineNumber: 118,
    columnNumber: 10
  }, this);
}
_s(Profile, "uuL5bvJtn1vYvWvmPHUexbQicbU=", false, function() {
  return [useLoaderData, useActionData, useNavigation];
});
_c = Profile;
var _c;
$RefreshReg$(_c, "Profile");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  Profile as default
};
//# sourceMappingURL=/build/routes/profil._index-GED4IQYB.js.map
