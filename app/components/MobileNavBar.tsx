// Créez un nouveau composant MobileNavBar.tsx
import { Link, useLocation } from "@remix-run/react";

export default function MobileNavBar() {
    const location = useLocation();

    // Fonction pour déterminer si un lien est actif
    const isActive = (path: string) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-10 sm:hidden">
            <div className="flex justify-around items-center">
                <Link
                    to="/"
                    className={`flex flex-col items-center p-2 ${isActive('/') ? 'text-rose-500' : 'text-gray-500'}`}
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                    <span className="text-xs mt-1">Explorer</span>
                </Link>

                <Link
                    to="/menu"
                    className={`flex flex-col items-center p-2 ${isActive('/menu') ? 'text-rose-500' : 'text-gray-500'}`}
                >
                    <svg
                        className="w-6 h-6"
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
                    <span className="text-xs mt-1">Mon menu</span>
                </Link>

                <Link
                    to="/courses"
                    className={`flex flex-col items-center p-2 ${isActive('/courses') ? 'text-rose-500' : 'text-gray-500'}`}
                >
                    <svg
                        className="w-6 h-6"
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
                    <span className="text-xs mt-1">Liste courses</span>
                </Link>
            </div>
        </div>
    );
}