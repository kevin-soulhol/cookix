import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
  Form,
  Link,
  useActionData,
  useNavigation,
  useSearchParams
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

// app/routes/login._index.tsx
var import_node = __toESM(require_node(), 1);
var import_react2 = __toESM(require_react(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/login._index.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/login._index.tsx"
  );
  import.meta.hot.lastModified = "1743065375252.1443";
}
function Login() {
  _s();
  const actionData = useActionData();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";
  const navigation = useNavigation();
  const [activeView, setActiveView] = (0, import_react2.useState)("login");
  const [errors, setErrors] = (0, import_react2.useState)({});
  const loginFormRef = (0, import_react2.useRef)(null);
  const registerFormRef = (0, import_react2.useRef)(null);
  const resetFormRef = (0, import_react2.useRef)(null);
  const isSubmitting = navigation.state === "submitting";
  (0, import_react2.useEffect)(() => {
    console.log("\xC9tat de navigation actuel:", navigation.state);
    if (navigation.state === "loading" && actionData?.success) {
      console.log("Redirection en cours...");
    }
  }, [navigation.state, actionData]);
  (0, import_react2.useEffect)(() => {
    if (actionData?.errors) {
      setErrors(actionData.errors);
    } else {
      setErrors({});
    }
  }, [actionData]);
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "sm:mx-auto sm:w-full sm:max-w-md", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-center text-3xl font-extrabold text-gray-900", children: [
        activeView === "login" && "Connexion \xE0 votre compte",
        activeView === "register" && "Cr\xE9er un compte",
        activeView === "resetPassword" && "R\xE9initialiser votre mot de passe"
      ] }, void 0, true, {
        fileName: "app/routes/login._index.tsx",
        lineNumber: 119,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-2 text-center text-sm text-gray-600", children: [
        activeView === "login" && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
          "Ou",
          " ",
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "button", onClick: () => setActiveView("register"), className: "font-medium text-rose-500 hover:text-rose-400", children: "cr\xE9ez un nouveau compte" }, void 0, false, {
            fileName: "app/routes/login._index.tsx",
            lineNumber: 127,
            columnNumber: 29
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/login._index.tsx",
          lineNumber: 125,
          columnNumber: 48
        }, this),
        activeView === "register" && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
          "Vous avez d\xE9j\xE0 un compte ?",
          " ",
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "button", onClick: () => setActiveView("login"), className: "font-medium text-rose-500 hover:text-rose-400", children: "Connectez-vous" }, void 0, false, {
            fileName: "app/routes/login._index.tsx",
            lineNumber: 134,
            columnNumber: 29
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/login._index.tsx",
          lineNumber: 132,
          columnNumber: 51
        }, this),
        activeView === "resetPassword" && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
          "Vous vous souvenez de votre mot de passe ?",
          " ",
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "button", onClick: () => setActiveView("login"), className: "font-medium text-rose-500 hover:text-rose-400", children: "Connectez-vous" }, void 0, false, {
            fileName: "app/routes/login._index.tsx",
            lineNumber: 141,
            columnNumber: 29
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/login._index.tsx",
          lineNumber: 139,
          columnNumber: 56
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/login._index.tsx",
        lineNumber: 124,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/login._index.tsx",
      lineNumber: 118,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-8 sm:mx-auto sm:w-full sm:max-w-md", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10", children: [
      activeView === "login" && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Form, { ref: loginFormRef, method: "post", className: "space-y-6", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "_action", value: "login" }, void 0, false, {
          fileName: "app/routes/login._index.tsx",
          lineNumber: 152,
          columnNumber: 29
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "redirectTo", value: redirectTo }, void 0, false, {
          fileName: "app/routes/login._index.tsx",
          lineNumber: 153,
          columnNumber: 29
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "login-email", className: "block text-sm font-medium text-gray-700", children: "Adresse email" }, void 0, false, {
            fileName: "app/routes/login._index.tsx",
            lineNumber: 156,
            columnNumber: 33
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-1", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { id: "login-email", name: "email", type: "email", autoComplete: "email", required: true, className: `appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm ${errors.email ? "border-red-300" : "border-gray-300"}` }, void 0, false, {
              fileName: "app/routes/login._index.tsx",
              lineNumber: 160,
              columnNumber: 37
            }, this),
            errors.email && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-2 text-sm text-red-600", id: "email-error", children: errors.email }, void 0, false, {
              fileName: "app/routes/login._index.tsx",
              lineNumber: 161,
              columnNumber: 54
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/login._index.tsx",
            lineNumber: 159,
            columnNumber: 33
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/login._index.tsx",
          lineNumber: 155,
          columnNumber: 29
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "login-password", className: "block text-sm font-medium text-gray-700", children: "Mot de passe" }, void 0, false, {
            fileName: "app/routes/login._index.tsx",
            lineNumber: 168,
            columnNumber: 33
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-1", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { id: "login-password", name: "password", type: "password", autoComplete: "current-password", required: true, className: `appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm ${errors.password ? "border-red-300" : "border-gray-300"}` }, void 0, false, {
              fileName: "app/routes/login._index.tsx",
              lineNumber: 172,
              columnNumber: 37
            }, this),
            errors.password && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-2 text-sm text-red-600", id: "password-error", children: errors.password }, void 0, false, {
              fileName: "app/routes/login._index.tsx",
              lineNumber: 173,
              columnNumber: 57
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/login._index.tsx",
            lineNumber: 171,
            columnNumber: 33
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/login._index.tsx",
          lineNumber: 167,
          columnNumber: 29
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { id: "remember-me", name: "remember-me", type: "checkbox", className: "h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded" }, void 0, false, {
              fileName: "app/routes/login._index.tsx",
              lineNumber: 181,
              columnNumber: 37
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "remember-me", className: "ml-2 block text-sm text-gray-900", children: "Se souvenir de moi" }, void 0, false, {
              fileName: "app/routes/login._index.tsx",
              lineNumber: 182,
              columnNumber: 37
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/login._index.tsx",
            lineNumber: 180,
            columnNumber: 33
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-sm", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "button", onClick: () => setActiveView("resetPassword"), className: "font-medium text-rose-500 hover:text-rose-400", children: "Mot de passe oubli\xE9 ?" }, void 0, false, {
            fileName: "app/routes/login._index.tsx",
            lineNumber: 188,
            columnNumber: 37
          }, this) }, void 0, false, {
            fileName: "app/routes/login._index.tsx",
            lineNumber: 187,
            columnNumber: 33
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/login._index.tsx",
          lineNumber: 179,
          columnNumber: 29
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "submit", disabled: isSubmitting, className: "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50", children: isSubmitting ? "Connexion en cours..." : "Se connecter" }, void 0, false, {
          fileName: "app/routes/login._index.tsx",
          lineNumber: 195,
          columnNumber: 33
        }, this) }, void 0, false, {
          fileName: "app/routes/login._index.tsx",
          lineNumber: 194,
          columnNumber: 29
        }, this),
        actionData?.success === true && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-green-50 border-l-4 border-green-400 p-4", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex-shrink-0", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "h-5 w-5 text-green-400", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z", clipRule: "evenodd" }, void 0, false, {
            fileName: "app/routes/login._index.tsx",
            lineNumber: 204,
            columnNumber: 49
          }, this) }, void 0, false, {
            fileName: "app/routes/login._index.tsx",
            lineNumber: 203,
            columnNumber: 45
          }, this) }, void 0, false, {
            fileName: "app/routes/login._index.tsx",
            lineNumber: 202,
            columnNumber: 41
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "ml-3", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm text-green-700", children: actionData.message }, void 0, false, {
            fileName: "app/routes/login._index.tsx",
            lineNumber: 208,
            columnNumber: 45
          }, this) }, void 0, false, {
            fileName: "app/routes/login._index.tsx",
            lineNumber: 207,
            columnNumber: 41
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/login._index.tsx",
          lineNumber: 201,
          columnNumber: 37
        }, this) }, void 0, false, {
          fileName: "app/routes/login._index.tsx",
          lineNumber: 200,
          columnNumber: 62
        }, this),
        actionData?.success === false && !errors.email && !errors.password && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-red-50 border-l-4 border-red-400 p-4", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex-shrink-0", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "h-5 w-5 text-red-400", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z", clipRule: "evenodd" }, void 0, false, {
            fileName: "app/routes/login._index.tsx",
            lineNumber: 219,
            columnNumber: 49
          }, this) }, void 0, false, {
            fileName: "app/routes/login._index.tsx",
            lineNumber: 218,
            columnNumber: 45
          }, this) }, void 0, false, {
            fileName: "app/routes/login._index.tsx",
            lineNumber: 217,
            columnNumber: 41
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "ml-3", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm text-red-700", children: actionData.message }, void 0, false, {
            fileName: "app/routes/login._index.tsx",
            lineNumber: 223,
            columnNumber: 45
          }, this) }, void 0, false, {
            fileName: "app/routes/login._index.tsx",
            lineNumber: 222,
            columnNumber: 41
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/login._index.tsx",
          lineNumber: 216,
          columnNumber: 37
        }, this) }, void 0, false, {
          fileName: "app/routes/login._index.tsx",
          lineNumber: 215,
          columnNumber: 100
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/login._index.tsx",
        lineNumber: 151,
        columnNumber: 48
      }, this),
      activeView === "register" && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Form, { ref: registerFormRef, method: "post", className: "space-y-6", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "_action", value: "register" }, void 0, false, {
          fileName: "app/routes/login._index.tsx",
          lineNumber: 233,
          columnNumber: 29
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "redirectTo", value: redirectTo }, void 0, false, {
          fileName: "app/routes/login._index.tsx",
          lineNumber: 234,
          columnNumber: 29
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "register-email", className: "block text-sm font-medium text-gray-700", children: "Adresse email" }, void 0, false, {
            fileName: "app/routes/login._index.tsx",
            lineNumber: 237,
            columnNumber: 33
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-1", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { id: "register-email", name: "email", type: "email", autoComplete: "email", required: true, className: `appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm ${errors.email ? "border-red-300" : "border-gray-300"}` }, void 0, false, {
              fileName: "app/routes/login._index.tsx",
              lineNumber: 241,
              columnNumber: 37
            }, this),
            errors.email && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-2 text-sm text-red-600", id: "email-error", children: errors.email }, void 0, false, {
              fileName: "app/routes/login._index.tsx",
              lineNumber: 242,
              columnNumber: 54
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/login._index.tsx",
            lineNumber: 240,
            columnNumber: 33
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/login._index.tsx",
          lineNumber: 236,
          columnNumber: 29
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "register-password", className: "block text-sm font-medium text-gray-700", children: "Mot de passe" }, void 0, false, {
            fileName: "app/routes/login._index.tsx",
            lineNumber: 249,
            columnNumber: 33
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-1", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { id: "register-password", name: "password", type: "password", autoComplete: "new-password", required: true, className: `appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm ${errors.password ? "border-red-300" : "border-gray-300"}` }, void 0, false, {
              fileName: "app/routes/login._index.tsx",
              lineNumber: 253,
              columnNumber: 37
            }, this),
            errors.password && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-2 text-sm text-red-600", id: "password-error", children: errors.password }, void 0, false, {
              fileName: "app/routes/login._index.tsx",
              lineNumber: 254,
              columnNumber: 57
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/login._index.tsx",
            lineNumber: 252,
            columnNumber: 33
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/login._index.tsx",
          lineNumber: 248,
          columnNumber: 29
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "register-password-confirm", className: "block text-sm font-medium text-gray-700", children: "Confirmer le mot de passe" }, void 0, false, {
            fileName: "app/routes/login._index.tsx",
            lineNumber: 261,
            columnNumber: 33
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-1", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { id: "register-password-confirm", name: "passwordConfirm", type: "password", autoComplete: "new-password", required: true, className: `appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm ${errors.passwordConfirm ? "border-red-300" : "border-gray-300"}` }, void 0, false, {
              fileName: "app/routes/login._index.tsx",
              lineNumber: 265,
              columnNumber: 37
            }, this),
            errors.passwordConfirm && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-2 text-sm text-red-600", id: "password-confirm-error", children: errors.passwordConfirm }, void 0, false, {
              fileName: "app/routes/login._index.tsx",
              lineNumber: 266,
              columnNumber: 64
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/login._index.tsx",
            lineNumber: 264,
            columnNumber: 33
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/login._index.tsx",
          lineNumber: 260,
          columnNumber: 29
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "submit", disabled: isSubmitting, className: "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50", children: isSubmitting ? "Inscription en cours..." : "S'inscrire" }, void 0, false, {
          fileName: "app/routes/login._index.tsx",
          lineNumber: 273,
          columnNumber: 33
        }, this) }, void 0, false, {
          fileName: "app/routes/login._index.tsx",
          lineNumber: 272,
          columnNumber: 29
        }, this),
        actionData?.success === false && !errors.email && !errors.password && !errors.passwordConfirm && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-red-50 border-l-4 border-red-400 p-4", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex-shrink-0", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "h-5 w-5 text-red-400", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z", clipRule: "evenodd" }, void 0, false, {
            fileName: "app/routes/login._index.tsx",
            lineNumber: 282,
            columnNumber: 49
          }, this) }, void 0, false, {
            fileName: "app/routes/login._index.tsx",
            lineNumber: 281,
            columnNumber: 45
          }, this) }, void 0, false, {
            fileName: "app/routes/login._index.tsx",
            lineNumber: 280,
            columnNumber: 41
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "ml-3", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm text-red-700", children: actionData.message }, void 0, false, {
            fileName: "app/routes/login._index.tsx",
            lineNumber: 286,
            columnNumber: 45
          }, this) }, void 0, false, {
            fileName: "app/routes/login._index.tsx",
            lineNumber: 285,
            columnNumber: 41
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/login._index.tsx",
          lineNumber: 279,
          columnNumber: 37
        }, this) }, void 0, false, {
          fileName: "app/routes/login._index.tsx",
          lineNumber: 278,
          columnNumber: 127
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/login._index.tsx",
        lineNumber: 232,
        columnNumber: 51
      }, this),
      activeView === "resetPassword" && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Form, { ref: resetFormRef, method: "post", className: "space-y-6", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "hidden", name: "_action", value: "resetPassword" }, void 0, false, {
          fileName: "app/routes/login._index.tsx",
          lineNumber: 296,
          columnNumber: 29
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm text-gray-600 mb-4", children: "Saisissez votre adresse email et nous vous enverrons un lien pour r\xE9initialiser votre mot de passe." }, void 0, false, {
            fileName: "app/routes/login._index.tsx",
            lineNumber: 299,
            columnNumber: 33
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "reset-email", className: "block text-sm font-medium text-gray-700", children: "Adresse email" }, void 0, false, {
            fileName: "app/routes/login._index.tsx",
            lineNumber: 303,
            columnNumber: 33
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-1", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { id: "reset-email", name: "email", type: "email", autoComplete: "email", required: true, className: `appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm ${errors.email ? "border-red-300" : "border-gray-300"}` }, void 0, false, {
              fileName: "app/routes/login._index.tsx",
              lineNumber: 307,
              columnNumber: 37
            }, this),
            errors.email && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-2 text-sm text-red-600", id: "email-error", children: errors.email }, void 0, false, {
              fileName: "app/routes/login._index.tsx",
              lineNumber: 308,
              columnNumber: 54
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/login._index.tsx",
            lineNumber: 306,
            columnNumber: 33
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/login._index.tsx",
          lineNumber: 298,
          columnNumber: 29
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "submit", disabled: isSubmitting, className: "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50", children: isSubmitting ? "Envoi en cours..." : "Envoyer le lien de r\xE9initialisation" }, void 0, false, {
          fileName: "app/routes/login._index.tsx",
          lineNumber: 315,
          columnNumber: 33
        }, this) }, void 0, false, {
          fileName: "app/routes/login._index.tsx",
          lineNumber: 314,
          columnNumber: 29
        }, this),
        actionData?.success === true && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-green-50 border-l-4 border-green-400 p-4", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex-shrink-0", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "h-5 w-5 text-green-400", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z", clipRule: "evenodd" }, void 0, false, {
            fileName: "app/routes/login._index.tsx",
            lineNumber: 324,
            columnNumber: 49
          }, this) }, void 0, false, {
            fileName: "app/routes/login._index.tsx",
            lineNumber: 323,
            columnNumber: 45
          }, this) }, void 0, false, {
            fileName: "app/routes/login._index.tsx",
            lineNumber: 322,
            columnNumber: 41
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "ml-3", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm text-green-700", children: actionData.message }, void 0, false, {
            fileName: "app/routes/login._index.tsx",
            lineNumber: 328,
            columnNumber: 45
          }, this) }, void 0, false, {
            fileName: "app/routes/login._index.tsx",
            lineNumber: 327,
            columnNumber: 41
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/login._index.tsx",
          lineNumber: 321,
          columnNumber: 37
        }, this) }, void 0, false, {
          fileName: "app/routes/login._index.tsx",
          lineNumber: 320,
          columnNumber: 62
        }, this),
        actionData?.success === false && !errors.email && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-red-50 border-l-4 border-red-400 p-4", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex-shrink-0", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "h-5 w-5 text-red-400", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z", clipRule: "evenodd" }, void 0, false, {
            fileName: "app/routes/login._index.tsx",
            lineNumber: 339,
            columnNumber: 49
          }, this) }, void 0, false, {
            fileName: "app/routes/login._index.tsx",
            lineNumber: 338,
            columnNumber: 45
          }, this) }, void 0, false, {
            fileName: "app/routes/login._index.tsx",
            lineNumber: 337,
            columnNumber: 41
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "ml-3", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm text-red-700", children: actionData.message }, void 0, false, {
            fileName: "app/routes/login._index.tsx",
            lineNumber: 343,
            columnNumber: 45
          }, this) }, void 0, false, {
            fileName: "app/routes/login._index.tsx",
            lineNumber: 342,
            columnNumber: 41
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/login._index.tsx",
          lineNumber: 336,
          columnNumber: 37
        }, this) }, void 0, false, {
          fileName: "app/routes/login._index.tsx",
          lineNumber: 335,
          columnNumber: 80
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/login._index.tsx",
        lineNumber: 295,
        columnNumber: 56
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-6", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "relative", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "absolute inset-0 flex items-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "w-full border-t border-gray-300" }, void 0, false, {
            fileName: "app/routes/login._index.tsx",
            lineNumber: 355,
            columnNumber: 33
          }, this) }, void 0, false, {
            fileName: "app/routes/login._index.tsx",
            lineNumber: 354,
            columnNumber: 29
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "relative flex justify-center text-sm", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "px-2 bg-white text-gray-500", children: "Ou" }, void 0, false, {
            fileName: "app/routes/login._index.tsx",
            lineNumber: 358,
            columnNumber: 33
          }, this) }, void 0, false, {
            fileName: "app/routes/login._index.tsx",
            lineNumber: 357,
            columnNumber: 29
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/login._index.tsx",
          lineNumber: 353,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-6", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/", className: "w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500", children: "Retour \xE0 l'accueil" }, void 0, false, {
          fileName: "app/routes/login._index.tsx",
          lineNumber: 365,
          columnNumber: 29
        }, this) }, void 0, false, {
          fileName: "app/routes/login._index.tsx",
          lineNumber: 364,
          columnNumber: 25
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/login._index.tsx",
        lineNumber: 352,
        columnNumber: 21
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/login._index.tsx",
      lineNumber: 149,
      columnNumber: 17
    }, this) }, void 0, false, {
      fileName: "app/routes/login._index.tsx",
      lineNumber: 148,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/login._index.tsx",
    lineNumber: 117,
    columnNumber: 10
  }, this);
}
_s(Login, "rkUkCWexPzjoLaIA3kGOH2lxfLs=", false, function() {
  return [useActionData, useSearchParams, useNavigation];
});
_c = Login;
var _c;
$RefreshReg$(_c, "Login");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  Login as default
};
//# sourceMappingURL=/build/routes/login._index-P5C73X4A.js.map
