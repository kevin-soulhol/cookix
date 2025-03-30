import { useState } from "react";
import { useOutletContext } from "@remix-run/react";
import RecipeModal from "./RecipeModal";

export type RecipeType = {
    id: number;
    title: string;
    preparationTime?: number;
    cookingTime?: number;
    servings?: number;
    difficulty?: string;
    description?: string;
    imageUrl?: string;
    note?: number;
    isFavorite?: boolean;
    isInMenu?: boolean;
};

type BoxRecipeProps = {
    recipe: RecipeType;
    readOnly?: boolean;
};

export default function BoxRecipe({ recipe, readOnly = false }: BoxRecipeProps) {
    // Nouvel état pour contrôler l'ouverture/fermeture du modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { isAuthenticated } = useOutletContext<any>() || { isAuthenticated: false };

    return (
        <>
            <div
                className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setIsModalOpen(true)} // Ouvrir le modal au clic
            >
                {/* Image de la recette */}
                <div className="relative h-44">
                    {recipe.imageUrl ? (
                        <div
                            className="h-full w-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${recipe.imageUrl})` }}
                        ></div>
                    ) : (
                        <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                            <svg
                                className="w-12 h-12 text-gray-400"
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
                        </div>
                    )}

                    {/* Badge de notation */}
                    {recipe.note && (
                        <div className="absolute top-2 left-2 bg-white bg-opacity-90 text-amber-500 font-semibold text-sm rounded-md px-2 py-1 flex items-center">
                            <svg
                                className="w-4 h-4 mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            {recipe.note}
                        </div>
                    )}
                </div>

                {/* Informations de la recette */}
                <div className="p-4 flex-1 flex flex-col">
                    <h3 className="text-lg font-semibold mb-1 text-gray-900">{recipe.title}</h3>

                    {recipe.description && (
                        <div className="text-sm text-gray-600 mb-3 line-clamp-2" dangerouslySetInnerHTML={{ __html: recipe.description }} />
                    )}

                    <div className="mt-auto flex justify-between text-xs text-gray-500">
                        <div>
                            {recipe.preparationTime && <span>{recipe.preparationTime} min</span>}
                        </div>
                        <div>{recipe.difficulty}</div>
                    </div>
                </div>
            </div>

            {/* Modal pour afficher les détails de la recette */}
            {isModalOpen && (
                <RecipeModal
                    recipeId={recipe.id}
                    basicRecipe={recipe}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    isAuthenticated={isAuthenticated}
                />
            )}
        </>
    );
}