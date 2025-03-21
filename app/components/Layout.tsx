import { Link, useOutletContext } from "@remix-run/react";
import { useState } from "react";
import Footer from "./Footer";
import AuthButton from "./AuthButton";

type LayoutProps = {
  children: React.ReactNode;
  showHomeLink?: boolean;
  pageTitle?: string;
};

export default function Layout({ children, showHomeLink = false, pageTitle }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user } = useOutletContext<any>() || { isAuthenticated: false, user: null };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              {showHomeLink ? (
                <Link to="/" className="flex items-center text-rose-500 hover:text-rose-700">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Retour à l'accueil
                </Link>
              ) : (
                <Link to="/" className="text-2xl font-bold text-rose-500">Cookix</Link>
              )}
            </div>

            {pageTitle && (
              <h1 className="text-xl font-bold text-gray-900">{pageTitle}</h1>
            )}

            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/recettes"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-rose-500 transition-colors"
              >
                Toutes les recettes
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    to="/menu"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-rose-500 transition-colors"
                  >
                    Menu de la semaine
                  </Link>
                  <Link
                    to="/courses"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-rose-500 transition-colors"
                  >
                    Liste de courses
                  </Link>
                </>
              )}

              < AuthButton isAuthenticated={isAuthenticated} user={user} />
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-rose-500 hover:bg-gray-100 focus:outline-none"
                aria-expanded={isMenuOpen}
              >
                <span className="sr-only">Ouvrir le menu</span>
                {/* Icon when menu is closed */}
                <svg
                  className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                {/* Icon when menu is open */}
                <svg
                  className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-md">
            <Link
              to="/recettes"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-rose-500"
              onClick={() => setIsMenuOpen(false)}
            >
              Toutes les recettes
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/menu"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-rose-500"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Menu de la semaine
                </Link>
                <Link
                  to="/courses"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-rose-500"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Liste de courses
                </Link>
                <Link
                  to="/profil"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-rose-500"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Mon profil
                </Link>
                <button
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-100"
                  onClick={() => {
                    setIsMenuOpen(false);
                    // Ici vous devriez soumettre une requête pour la déconnexion
                  }}
                >
                  Se déconnecter
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-rose-600 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Se connecter
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}