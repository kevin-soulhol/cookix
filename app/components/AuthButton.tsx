import { useState, useRef, useEffect } from "react";
import { Link, useFetcher, useNavigate } from "@remix-run/react";

interface AuthButtonProps {
    isAuthenticated: boolean;
    user?: {
        id: number;
        email: string;
    } | null;
}

export default function AuthButton({ isAuthenticated, user }: AuthButtonProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const fetcher = useFetcher();
    const navigate = useNavigate();

    // Fermer le dropdown si on clique ailleurs
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Gérer la déconnexion
    const handleLogout = () => {
        fetcher.submit(
            { _action: "logout" },
            { method: "post", action: "/api/user" }
        );
        setIsDropdownOpen(false);
        // Redirection vers la page d'accueil après déconnexion
        navigate("/");
    };

    // Si non connecté, afficher le bouton de connexion
    if (!isAuthenticated) {
        return (
            <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
            >
                <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                </svg>
                Se connecter
            </Link>
        );
    }

    // Si connecté, afficher le dropdown
    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                id="user-menu-button"
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
            >
                <span className="inline-block h-8 w-8 rounded-full overflow-hidden bg-gray-100 mr-2">
                    <svg
                        className="h-full w-full text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                </span>
                {user?.email?.split('@')[0] || 'Mon compte'}
                <svg
                    className="-mr-1 ml-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>

            {/* Dropdown menu */}
            {isDropdownOpen && (
                <div
                    className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                    tabIndex={-1}
                >
                    <div className="py-1" role="none">
                        <Link
                            to="/profil"
                            className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
                            role="menuitem"
                            tabIndex={-1}
                            onClick={() => setIsDropdownOpen(false)}
                        >
                            <div className="flex items-center">
                                <svg
                                    className="mr-3 h-5 w-5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                                Mon profil
                            </div>
                        </Link>

                        <Link
                            to="/menu"
                            className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
                            role="menuitem"
                            tabIndex={-1}
                            onClick={() => setIsDropdownOpen(false)}
                        >
                            <div className="flex items-center">
                                <svg
                                    className="mr-3 h-5 w-5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                    />
                                </svg>
                                Mon menu
                            </div>
                        </Link>

                        <Link
                            to="/courses"
                            className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
                            role="menuitem"
                            tabIndex={-1}
                            onClick={() => setIsDropdownOpen(false)}
                        >
                            <div className="flex items-center">
                                <svg
                                    className="mr-3 h-5 w-5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                    />
                                </svg>
                                Ma liste de courses
                            </div>
                        </Link>

                        <div className="border-t border-gray-100 my-1"></div>

                        <button
                            type="button"
                            className="text-gray-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                            role="menuitem"
                            tabIndex={-1}
                            onClick={handleLogout}
                        >
                            <div className="flex items-center text-red-600">
                                <svg
                                    className="mr-3 h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                    />
                                </svg>
                                Se déconnecter
                            </div>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}