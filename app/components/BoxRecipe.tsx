import { Link, useFetcher, useActionData, useOutletContext } from "@remix-run/react";
import { useEffect, useState } from "react";

type BoxLayoutProps = {
    recipe: RecipeType;
}

export type RecipeType = {
    id: number;
    difficulty: string;
    title: string;
    preparationTime: number;
    cookingTime: number;
    serving: number;
    note: number;
    description: string;
    imageUrl: string;
    isFavorite: boolean;
    isInMenu: boolean;
}

export default function BoxRecipe({ recipe }: BoxLayoutProps) {
    const { isAuthenticated } = useOutletContext<any>() || { isAuthenticated: false, user: null };
    const [isAddingToMenu, setIsAddingToMenu] = useState(false);
    const [inFavorites, setInFavorites] = useState(recipe.isFavorite);
    const [isAdded, setIsAdded] = useState(recipe.isInMenu);

    const menuFetcher = useFetcher();
    const favoriteFetcher = useFetcher();
    const actionData = useActionData();

    // État pour détecter si on est en train de traiter une requête
    const isAddingToMenuInProgress = menuFetcher.state === "submitting";
    const isTogglingFavoriteInProgress = favoriteFetcher.state === "submitting";

    // Gestion de l'ajout au menu
    const handleAddToMenu = async () => {
        setIsAddingToMenu(true);
        menuFetcher.submit(
            { recipeId: recipe.id.toString() },
            { method: "post", action: "/api/menu" }
        )
    };

    // Gestion du basculement des favoris
    const handleToggleFavorite = () => {
        setInFavorites(!inFavorites);
        favoriteFetcher.submit(
            { recipeId: recipe.id.toString(), action: inFavorites ? "remove" : "add" },
            { method: "post", action: "/api/favorites" }
        );
    };

    useEffect(() => {
        if (menuFetcher.state === "idle" && menuFetcher.data) {
            setIsAdded(true)
        }
    }, [menuFetcher])

    // Lorsque la requête est terminée, mettre à jour les states
    if (menuFetcher.state === "idle" && isAddingToMenu && isAddingToMenuInProgress) {
        setIsAddingToMenu(false);
    }

    return (
        <article className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-lg flex flex-col h-full">
            {/* Image de la recette avec badge de difficulté */}
            <div className="relative">
                {recipe.imageUrl ? (
                    <div
                        className="h-48 bg-cover bg-center"
                        style={{ backgroundImage: `url(${recipe.imageUrl})` }}
                    >
                        {recipe.difficulty && (
                            <span className="absolute top-4 right-4 bg-black bg-opacity-70 text-white text-xs font-semibold px-2 py-1 rounded">
                                {recipe.difficulty}
                            </span>
                        )}
                    </div>
                ) : (
                    <div className="h-48 bg-gray-200 flex items-center justify-center">
                        <svg
                            className="w-16 h-16 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        {recipe.difficulty && (
                            <span className="absolute top-4 right-4 bg-black bg-opacity-70 text-white text-xs font-semibold px-2 py-1 rounded">
                                {recipe.difficulty}
                            </span>
                        )}
                    </div>
                )}

                {/* Bouton Favori en superposition sur l'image */}
                {isAuthenticated && (
                    <button
                        onClick={handleToggleFavorite}
                        disabled={isTogglingFavoriteInProgress}
                        className="absolute top-4 left-4 bg-white bg-opacity-80 p-2 rounded-full shadow-md hover:bg-opacity-100 transition-all"
                        aria-label={inFavorites ? "Retirer des favoris" : "Ajouter aux favoris"}
                    >
                        {isTogglingFavoriteInProgress ? (
                            <svg className="w-5 h-5 animate-spin text-rose-500" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <svg
                                className={`w-5 h-5 ${inFavorites ? 'text-rose-500 fill-current' : 'text-gray-500'}`}
                                fill={inFavorites ? "currentColor" : "none"}
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                            </svg>
                        )}
                    </button>
                )}
            </div>

            {/* Contenu de la recette */}
            <div className="p-5 flex flex-col flex-grow">
                <h3 className="font-bold text-lg mb-2">
                    <Link to={`/recettes/${recipe.id}`} className="text-gray-900 hover:text-rose-500">
                        {recipe.title}
                    </Link>
                </h3>

                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    {recipe.preparationTime && (
                        <span className="flex items-center">
                            <svg
                                className="w-4 h-4 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            {recipe.preparationTime} min
                        </span>
                    )}

                    {recipe.note && (
                        <span className="flex items-center">
                            <svg
                                className="w-4 h-4 mr-1 text-yellow-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                                />
                            </svg>
                            {recipe.note}
                        </span>
                    )}
                </div>

                {recipe.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                        {recipe.description}
                    </p>
                )}

                <div className="mt-auto space-y-3">
                    {/* Bouton ajouter au menu */}
                    {!isAdded && isAuthenticated && (
                        <div className="w-full">
                            <button
                                onClick={handleAddToMenu}
                                disabled={isAddingToMenuInProgress}
                                className="w-full flex items-center justify-center px-3 py-2 border border-teal-500 text-teal-500 rounded-md hover:bg-teal-50 transition-colors text-sm font-medium"
                            >
                                {isAddingToMenuInProgress ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-teal-500" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Ajout en cours...
                                    </>
                                ) : (
                                    <>
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
                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                        Ajouter au menu
                                    </>
                                )}
                            </button>
                        </div>
                    )}


                    {/* Lien vers la recette */}
                    <Link
                        to={`/recettes/${recipe.id}`}
                        className="text-rose-500 hover:text-rose-700 font-medium text-sm inline-flex items-center"
                    >
                        Voir la recette
                        <svg
                            className="w-4 h-4 ml-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </Link>
                </div>
            </div>
        </article>
    );
}