import { Link, useOutletContext, Form } from "@remix-run/react";
import { useState } from "react";
import Footer from "./Footer";
import AuthButton, { AuthButtonProps } from "./AuthButton";
import MobileNavBar from "./MobileNavBar";

type LayoutProps = {
  children: React.ReactNode;
  showHomeLink?: boolean;
  pageTitle?: string;
};

export default function Layout({ children, showHomeLink = false, pageTitle }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user } = useOutletContext<AuthButtonProps>() || { isAuthenticated: false, user: null };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14 sm:h-16 items-center">
            {/* Logo plus petit sur mobile */}
            <div className="flex items-center">
              {showHomeLink ? (
                <Link to="/" className="flex items-center text-rose-500 hover:text-rose-700">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2"
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
                  <span className="text-sm sm:text-base">Retour</span>
                </Link>
              ) : (
                <Link to="/" className="text-xl sm:text-2xl font-bold text-rose-500">Cookix</Link>
              )}
            </div>

            {/* Titre de page plus petit sur mobile */}
            {pageTitle && (
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate max-w-[150px] sm:max-w-xs">
                {pageTitle}
              </h1>
            )}

            {/* Menu bureau inchangé */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/"
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

            {/* Bouton de profil pour mobile (à la place du menu hamburger) */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-rose-500 hover:bg-gray-100 focus:outline-none"
                aria-expanded={isMenuOpen}
              >
                {isAuthenticated ? (
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Menu déroulant simplifié */}
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-md">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {!isAuthenticated ? (
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-rose-600 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Se connecter
                </Link>
              ) : (
                <>
                  <Link
                    to="/profil"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-rose-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mon profil
                  </Link>
                  <Form method="post" action="/api/user">
                    <input type="hidden" name="_action" value="logout" />
                    <button
                      type="submit"
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Se déconnecter
                    </button>
                  </Form>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main content - avec padding bottom pour éviter que le contenu soit caché par la navbar mobile */}
      <main className="flex-grow pb-16 sm:pb-0">
        {children}
      </main>

      {/* Navigation mobile (visible uniquement sur mobile) */}
      {isAuthenticated && <MobileNavBar />}

      {/* Footer - caché sur mobile si la navbar mobile est visible */}
      <div className="hidden sm:block">
        <Footer />
      </div>
    </div>
  );
}