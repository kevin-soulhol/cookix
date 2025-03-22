import {
  Link,
  useFetcher,
  useNavigate,
  useOutletContext
} from "/build/_shared/chunk-S75R672J.js";
import {
  require_jsx_dev_runtime
} from "/build/_shared/chunk-XGOTYLZ5.js";
import {
  require_react
} from "/build/_shared/chunk-7M6SC7J5.js";
import {
  createHotContext
} from "/build/_shared/chunk-MCH5QMAS.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// app/components/Layout.tsx
var import_react5 = __toESM(require_react(), 1);

// app/components/Footer.tsx
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/components/Footer.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/components/Footer.tsx"
  );
  import.meta.hot.lastModified = "1742450333274.2869";
}
function Footer() {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("footer", { className: "bg-gray-800 text-white py-12", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "col-span-1 lg:col-span-2", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-rose-500 text-2xl font-bold mb-4", children: "Cookix" }, void 0, false, {
          fileName: "app/components/Footer.tsx",
          lineNumber: 27,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-gray-300 mb-4 max-w-md", children: "Votre assistant culinaire pour Monsieur Cuisine Smart. D\xE9couvrez de nouvelles recettes, planifiez vos repas et simplifiez vos courses." }, void 0, false, {
          fileName: "app/components/Footer.tsx",
          lineNumber: 28,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/Footer.tsx",
        lineNumber: 26,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { className: "text-lg font-semibold mb-4", children: "Navigation" }, void 0, false, {
          fileName: "app/components/Footer.tsx",
          lineNumber: 34,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", { className: "space-y-2", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/", className: "text-gray-300 hover:text-white transition-colors", children: "Accueil" }, void 0, false, {
            fileName: "app/components/Footer.tsx",
            lineNumber: 36,
            columnNumber: 19
          }, this) }, void 0, false, {
            fileName: "app/components/Footer.tsx",
            lineNumber: 36,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/recettes", className: "text-gray-300 hover:text-white transition-colors", children: "Recettes" }, void 0, false, {
            fileName: "app/components/Footer.tsx",
            lineNumber: 37,
            columnNumber: 19
          }, this) }, void 0, false, {
            fileName: "app/components/Footer.tsx",
            lineNumber: 37,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/menu", className: "text-gray-300 hover:text-white transition-colors", children: "Menu hebdomadaire" }, void 0, false, {
            fileName: "app/components/Footer.tsx",
            lineNumber: 38,
            columnNumber: 19
          }, this) }, void 0, false, {
            fileName: "app/components/Footer.tsx",
            lineNumber: 38,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/courses", className: "text-gray-300 hover:text-white transition-colors", children: "Liste de courses" }, void 0, false, {
            fileName: "app/components/Footer.tsx",
            lineNumber: 39,
            columnNumber: 19
          }, this) }, void 0, false, {
            fileName: "app/components/Footer.tsx",
            lineNumber: 39,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/Footer.tsx",
          lineNumber: 35,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/Footer.tsx",
        lineNumber: 33,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { className: "text-lg font-semibold mb-4", children: "\xC0 propos" }, void 0, false, {
          fileName: "app/components/Footer.tsx",
          lineNumber: 44,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", { className: "space-y-2", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/a-propos", className: "text-gray-300 hover:text-white transition-colors", children: "\xC0 propos de Cookix" }, void 0, false, {
            fileName: "app/components/Footer.tsx",
            lineNumber: 46,
            columnNumber: 19
          }, this) }, void 0, false, {
            fileName: "app/components/Footer.tsx",
            lineNumber: 46,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/contact", className: "text-gray-300 hover:text-white transition-colors", children: "Contact" }, void 0, false, {
            fileName: "app/components/Footer.tsx",
            lineNumber: 47,
            columnNumber: 19
          }, this) }, void 0, false, {
            fileName: "app/components/Footer.tsx",
            lineNumber: 47,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/mentions-legales", className: "text-gray-300 hover:text-white transition-colors", children: "Mentions l\xE9gales" }, void 0, false, {
            fileName: "app/components/Footer.tsx",
            lineNumber: 48,
            columnNumber: 19
          }, this) }, void 0, false, {
            fileName: "app/components/Footer.tsx",
            lineNumber: 48,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/Footer.tsx",
          lineNumber: 45,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/Footer.tsx",
        lineNumber: 43,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/Footer.tsx",
      lineNumber: 25,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "border-t border-gray-700 pt-8 text-center text-gray-400 text-sm", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: [
      "\xA9 ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      " Cookix - Tous droits r\xE9serv\xE9s"
    ] }, void 0, true, {
      fileName: "app/components/Footer.tsx",
      lineNumber: 54,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "app/components/Footer.tsx",
      lineNumber: 53,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/Footer.tsx",
    lineNumber: 24,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "app/components/Footer.tsx",
    lineNumber: 23,
    columnNumber: 10
  }, this);
}
_c = Footer;
var _c;
$RefreshReg$(_c, "Footer");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/components/AuthButton.tsx
var import_react2 = __toESM(require_react(), 1);
var import_jsx_dev_runtime2 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/components/AuthButton.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/components/AuthButton.tsx"
  );
  import.meta.hot.lastModified = "1742566882119.2976";
}
function AuthButton({
  isAuthenticated,
  user
}) {
  _s();
  const [isDropdownOpen, setIsDropdownOpen] = (0, import_react2.useState)(false);
  const dropdownRef = (0, import_react2.useRef)(null);
  const fetcher = useFetcher();
  const navigate = useNavigate();
  (0, import_react2.useEffect)(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleLogout = () => {
    fetcher.submit({
      _action: "logout"
    }, {
      method: "post",
      action: "/api/user"
    });
    setIsDropdownOpen(false);
    navigate("/");
  };
  if (!isAuthenticated) {
    return /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(Link, { to: "/login", className: "inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("svg", { className: "w-4 h-4 mr-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" }, void 0, false, {
        fileName: "app/components/AuthButton.tsx",
        lineNumber: 62,
        columnNumber: 21
      }, this) }, void 0, false, {
        fileName: "app/components/AuthButton.tsx",
        lineNumber: 61,
        columnNumber: 17
      }, this),
      "Se connecter"
    ] }, void 0, true, {
      fileName: "app/components/AuthButton.tsx",
      lineNumber: 60,
      columnNumber: 12
    }, this);
  }
  return /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "relative inline-block text-left", ref: dropdownRef, children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("button", { type: "button", onClick: () => setIsDropdownOpen(!isDropdownOpen), className: "flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500", id: "user-menu-button", "aria-expanded": isDropdownOpen, "aria-haspopup": "true", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("span", { className: "inline-block h-8 w-8 rounded-full overflow-hidden bg-gray-100 mr-2", children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("svg", { className: "h-full w-full text-gray-400", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("path", { d: "M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" }, void 0, false, {
        fileName: "app/components/AuthButton.tsx",
        lineNumber: 73,
        columnNumber: 25
      }, this) }, void 0, false, {
        fileName: "app/components/AuthButton.tsx",
        lineNumber: 72,
        columnNumber: 21
      }, this) }, void 0, false, {
        fileName: "app/components/AuthButton.tsx",
        lineNumber: 71,
        columnNumber: 17
      }, this),
      user?.email?.split("@")[0] || "Mon compte",
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("svg", { className: "-mr-1 ml-2 h-5 w-5", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("path", { fillRule: "evenodd", d: "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z", clipRule: "evenodd" }, void 0, false, {
        fileName: "app/components/AuthButton.tsx",
        lineNumber: 78,
        columnNumber: 21
      }, this) }, void 0, false, {
        fileName: "app/components/AuthButton.tsx",
        lineNumber: 77,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/AuthButton.tsx",
      lineNumber: 70,
      columnNumber: 13
    }, this),
    isDropdownOpen && /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50", role: "menu", "aria-orientation": "vertical", "aria-labelledby": "user-menu-button", tabIndex: -1, children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "py-1", role: "none", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(Link, { to: "/profil", className: "text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100", role: "menuitem", tabIndex: -1, onClick: () => setIsDropdownOpen(false), children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "flex items-center", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("svg", { className: "mr-3 h-5 w-5 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" }, void 0, false, {
          fileName: "app/components/AuthButton.tsx",
          lineNumber: 88,
          columnNumber: 37
        }, this) }, void 0, false, {
          fileName: "app/components/AuthButton.tsx",
          lineNumber: 87,
          columnNumber: 33
        }, this),
        "Mon profil"
      ] }, void 0, true, {
        fileName: "app/components/AuthButton.tsx",
        lineNumber: 86,
        columnNumber: 29
      }, this) }, void 0, false, {
        fileName: "app/components/AuthButton.tsx",
        lineNumber: 85,
        columnNumber: 25
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(Link, { to: "/menu", className: "text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100", role: "menuitem", tabIndex: -1, onClick: () => setIsDropdownOpen(false), children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "flex items-center", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("svg", { className: "mr-3 h-5 w-5 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" }, void 0, false, {
          fileName: "app/components/AuthButton.tsx",
          lineNumber: 97,
          columnNumber: 37
        }, this) }, void 0, false, {
          fileName: "app/components/AuthButton.tsx",
          lineNumber: 96,
          columnNumber: 33
        }, this),
        "Mon menu"
      ] }, void 0, true, {
        fileName: "app/components/AuthButton.tsx",
        lineNumber: 95,
        columnNumber: 29
      }, this) }, void 0, false, {
        fileName: "app/components/AuthButton.tsx",
        lineNumber: 94,
        columnNumber: 25
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(Link, { to: "/courses", className: "text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100", role: "menuitem", tabIndex: -1, onClick: () => setIsDropdownOpen(false), children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "flex items-center", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("svg", { className: "mr-3 h-5 w-5 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" }, void 0, false, {
          fileName: "app/components/AuthButton.tsx",
          lineNumber: 106,
          columnNumber: 37
        }, this) }, void 0, false, {
          fileName: "app/components/AuthButton.tsx",
          lineNumber: 105,
          columnNumber: 33
        }, this),
        "Ma liste de courses"
      ] }, void 0, true, {
        fileName: "app/components/AuthButton.tsx",
        lineNumber: 104,
        columnNumber: 29
      }, this) }, void 0, false, {
        fileName: "app/components/AuthButton.tsx",
        lineNumber: 103,
        columnNumber: 25
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "border-t border-gray-100 my-1" }, void 0, false, {
        fileName: "app/components/AuthButton.tsx",
        lineNumber: 112,
        columnNumber: 25
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("button", { type: "button", className: "text-gray-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100", role: "menuitem", tabIndex: -1, onClick: handleLogout, children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "flex items-center text-red-600", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("svg", { className: "mr-3 h-5 w-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" }, void 0, false, {
          fileName: "app/components/AuthButton.tsx",
          lineNumber: 117,
          columnNumber: 37
        }, this) }, void 0, false, {
          fileName: "app/components/AuthButton.tsx",
          lineNumber: 116,
          columnNumber: 33
        }, this),
        "Se d\xE9connecter"
      ] }, void 0, true, {
        fileName: "app/components/AuthButton.tsx",
        lineNumber: 115,
        columnNumber: 29
      }, this) }, void 0, false, {
        fileName: "app/components/AuthButton.tsx",
        lineNumber: 114,
        columnNumber: 25
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/AuthButton.tsx",
      lineNumber: 84,
      columnNumber: 21
    }, this) }, void 0, false, {
      fileName: "app/components/AuthButton.tsx",
      lineNumber: 83,
      columnNumber: 32
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/AuthButton.tsx",
    lineNumber: 69,
    columnNumber: 10
  }, this);
}
_s(AuthButton, "G+8vyMgM1JwoZd+K9gSFCf0tsfE=", false, function() {
  return [useFetcher, useNavigate];
});
_c2 = AuthButton;
var _c2;
$RefreshReg$(_c2, "AuthButton");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/components/Layout.tsx
var import_jsx_dev_runtime3 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/components/Layout.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s2 = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/components/Layout.tsx"
  );
  import.meta.hot.lastModified = "1742579621619.6345";
}
function Layout({
  children,
  showHomeLink = false,
  pageTitle
}) {
  _s2();
  const [isMenuOpen, setIsMenuOpen] = (0, import_react5.useState)(false);
  const {
    isAuthenticated,
    user
  } = useOutletContext() || {
    isAuthenticated: false,
    user: null
  };
  return /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("header", { className: "bg-white shadow-md sticky top-0 z-50", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", { className: "flex justify-between h-16 items-center", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", { className: "flex items-center", children: showHomeLink ? /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(Link, { to: "/", className: "flex items-center text-rose-500 hover:text-rose-700", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("svg", { className: "w-5 h-5 mr-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M10 19l-7-7m0 0l7-7m-7 7h18" }, void 0, false, {
            fileName: "app/components/Layout.tsx",
            lineNumber: 48,
            columnNumber: 21
          }, this) }, void 0, false, {
            fileName: "app/components/Layout.tsx",
            lineNumber: 47,
            columnNumber: 19
          }, this),
          "Retour \xE0 l'accueil"
        ] }, void 0, true, {
          fileName: "app/components/Layout.tsx",
          lineNumber: 46,
          columnNumber: 31
        }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(Link, { to: "/", className: "text-2xl font-bold text-rose-500", children: "Cookix" }, void 0, false, {
          fileName: "app/components/Layout.tsx",
          lineNumber: 51,
          columnNumber: 27
        }, this) }, void 0, false, {
          fileName: "app/components/Layout.tsx",
          lineNumber: 45,
          columnNumber: 13
        }, this),
        pageTitle && /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("h1", { className: "text-xl font-bold text-gray-900", children: pageTitle }, void 0, false, {
          fileName: "app/components/Layout.tsx",
          lineNumber: 54,
          columnNumber: 27
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", { className: "hidden md:flex items-center space-x-4", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(Link, { to: "/recettes", className: "px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-rose-500 transition-colors", children: "Toutes les recettes" }, void 0, false, {
            fileName: "app/components/Layout.tsx",
            lineNumber: 57,
            columnNumber: 15
          }, this),
          isAuthenticated && /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(import_jsx_dev_runtime3.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(Link, { to: "/menu", className: "px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-rose-500 transition-colors", children: "Menu de la semaine" }, void 0, false, {
              fileName: "app/components/Layout.tsx",
              lineNumber: 61,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(Link, { to: "/courses", className: "px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-rose-500 transition-colors", children: "Liste de courses" }, void 0, false, {
              fileName: "app/components/Layout.tsx",
              lineNumber: 64,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/Layout.tsx",
            lineNumber: 60,
            columnNumber: 35
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(AuthButton, { isAuthenticated, user }, void 0, false, {
            fileName: "app/components/Layout.tsx",
            lineNumber: 69,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/Layout.tsx",
          lineNumber: 56,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", { className: "md:hidden flex items-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("button", { onClick: () => setIsMenuOpen(!isMenuOpen), className: "inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-rose-500 hover:bg-gray-100 focus:outline-none", "aria-expanded": isMenuOpen, children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("span", { className: "sr-only", children: "Ouvrir le menu" }, void 0, false, {
            fileName: "app/components/Layout.tsx",
            lineNumber: 74,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("svg", { className: `${isMenuOpen ? "hidden" : "block"} h-6 w-6`, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M4 6h16M4 12h16M4 18h16" }, void 0, false, {
            fileName: "app/components/Layout.tsx",
            lineNumber: 77,
            columnNumber: 19
          }, this) }, void 0, false, {
            fileName: "app/components/Layout.tsx",
            lineNumber: 76,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("svg", { className: `${isMenuOpen ? "block" : "hidden"} h-6 w-6`, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M6 18L18 6M6 6l12 12" }, void 0, false, {
            fileName: "app/components/Layout.tsx",
            lineNumber: 81,
            columnNumber: 19
          }, this) }, void 0, false, {
            fileName: "app/components/Layout.tsx",
            lineNumber: 80,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/Layout.tsx",
          lineNumber: 73,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "app/components/Layout.tsx",
          lineNumber: 72,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/Layout.tsx",
        lineNumber: 44,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "app/components/Layout.tsx",
        lineNumber: 43,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", { className: `${isMenuOpen ? "block" : "hidden"} md:hidden`, children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", { className: "px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-md", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(Link, { to: "/recettes", className: "block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-rose-500", onClick: () => setIsMenuOpen(false), children: "Toutes les recettes" }, void 0, false, {
          fileName: "app/components/Layout.tsx",
          lineNumber: 91,
          columnNumber: 13
        }, this),
        isAuthenticated ? /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(import_jsx_dev_runtime3.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(Link, { to: "/menu", className: "block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-rose-500", onClick: () => setIsMenuOpen(false), children: "Menu de la semaine" }, void 0, false, {
            fileName: "app/components/Layout.tsx",
            lineNumber: 96,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(Link, { to: "/courses", className: "block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-rose-500", onClick: () => setIsMenuOpen(false), children: "Liste de courses" }, void 0, false, {
            fileName: "app/components/Layout.tsx",
            lineNumber: 99,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(Link, { to: "/profil", className: "block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-rose-500", onClick: () => setIsMenuOpen(false), children: "Mon profil" }, void 0, false, {
            fileName: "app/components/Layout.tsx",
            lineNumber: 102,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("button", { className: "block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-100", onClick: () => {
            setIsMenuOpen(false);
          }, children: "Se d\xE9connecter" }, void 0, false, {
            fileName: "app/components/Layout.tsx",
            lineNumber: 105,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/Layout.tsx",
          lineNumber: 95,
          columnNumber: 32
        }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(import_jsx_dev_runtime3.Fragment, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(Link, { to: "/login", className: "block px-3 py-2 rounded-md text-base font-medium text-rose-600 hover:bg-gray-100", onClick: () => setIsMenuOpen(false), children: "Se connecter" }, void 0, false, {
          fileName: "app/components/Layout.tsx",
          lineNumber: 112,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "app/components/Layout.tsx",
          lineNumber: 111,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/Layout.tsx",
        lineNumber: 90,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "app/components/Layout.tsx",
        lineNumber: 89,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/Layout.tsx",
      lineNumber: 42,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("main", { className: "flex-grow", children }, void 0, false, {
      fileName: "app/components/Layout.tsx",
      lineNumber: 121,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(Footer, {}, void 0, false, {
      fileName: "app/components/Layout.tsx",
      lineNumber: 126,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/Layout.tsx",
    lineNumber: 40,
    columnNumber: 10
  }, this);
}
_s2(Layout, "beLWX9mI3W9vn6/y+AvGmlM5NW8=", false, function() {
  return [useOutletContext];
});
_c3 = Layout;
var _c3;
$RefreshReg$(_c3, "Layout");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

export {
  Layout
};
//# sourceMappingURL=/build/_shared/chunk-XAMQJL7P.js.map
