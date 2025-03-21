import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { Link, useLoaderData, useOutletContext } from "@remix-run/react";
import { PrismaClient } from "@prisma/client";
import { useState } from "react";
import { prisma } from "~/utils/db.server";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.recipe) {
    return [
      { title: "Recette non trouvée - Cookix" },
      { name: "description", content: "Cette recette n'existe pas ou a été supprimée." },
    ];
  }

  return [
    { title: `${data.recipe.title} - Cookix` },
    { name: "description", content: data.recipe.description || `Découvrez la recette de ${data.recipe.title}` },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const { recipeId } = params;

  if (!recipeId) {
    return json({ recipe: null, error: "ID de recette manquant" }, { status: 400 });
  }

  try {
    const recipe = await prisma.recipe.findUnique({
      where: { id: parseInt(recipeId) },
      include: {
        steps: {
          orderBy: {
            stepNumber: 'asc'
          }
        },
        ingredients: {
          include: {
            ingredient: true
          }
        }
      }
    });

    if (!recipe) {
      return json({ recipe: null, error: "Recette non trouvée" }, { status: 404 });
    }

    return json({ recipe, error: null });

  } catch (error) {
    console.error("Erreur lors du chargement de la recette:", error);
    return json({
      recipe: null,
      error: "Impossible de charger les détails de la recette"
    }, { status: 500 });
  }
}

export default function RecipeDetail() {
  const { isAuthenticated } = useOutletContext<any>() || { isAuthenticated: false };
  const { recipe, error } = useLoaderData<typeof loader>();
  const [selectedTab, setSelectedTab] = useState<'ingredients' | 'instructions' | 'description'>('ingredients');

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-xl w-full text-center">
          <svg
            className="w-16 h-16 text-rose-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{error}</h1>
          <p className="text-gray-600 mb-6">
            La recette que vous recherchez n'existe pas ou a été supprimée.
          </p>
          <Link
            to="/recettes"
            className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-sm"
          >
            Voir toutes les recettes
          </Link>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return null; // Ne devrait jamais se produire avec la gestion d'erreur ci-dessus
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec retour */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <Link
              to="/recettes"
              className="flex items-center text-rose-500 hover:text-rose-700"
            >
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
              Retour aux recettes
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Hero image et info de base */}
          <div className="relative">
            {recipe.imageUrl ? (
              <div
                className="h-64 sm:h-96 w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${recipe.imageUrl})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black opacity-60"></div>
              </div>
            ) : (
              <div className="h-64 sm:h-96 w-full bg-gray-200 flex items-center justify-center">
                <svg
                  className="w-24 h-24 text-gray-400"
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

            {/* Info recette en overlay */}
            <div className="absolute bottom-0 left-0 w-full p-6 text-white">
              <h1 className="text-3xl font-bold mb-2 text-shadow">{recipe.title}</h1>
            </div>
          </div>

          {/* Metadata */}
          <div className="border-b border-gray-200">
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-gray-200">
              <div className="p-4 text-center">
                <span className="block text-sm text-gray-500">Préparation</span>
                <span className="text-lg font-semibold">
                  {recipe.preparationTime ? `${recipe.preparationTime} min` : 'Non spécifié'}
                </span>
              </div>
              <div className="p-4 text-center">
                <span className="block text-sm text-gray-500">Cuisson</span>
                <span className="text-lg font-semibold">
                  {recipe.cookingTime ? `${recipe.cookingTime} min` : 'Non spécifié'}
                </span>
              </div>
              <div className="p-4 text-center">
                <span className="block text-sm text-gray-500">Difficulté</span>
                <span className="text-lg font-semibold">
                  {recipe.difficulty || 'Non spécifiée'}
                </span>
              </div>
              <div className="p-4 text-center">
                <span className="block text-sm text-gray-500">Portions</span>
                <span className="text-lg font-semibold">
                  {recipe.servings ? `${recipe.servings}` : 'Non spécifié'}
                </span>
              </div>
            </div>
          </div>

          {/* Tabs pour ingrédients et instructions */}
          <div>
            <div className="border-b border-gray-200">
              <nav className="flex">
                <button
                  onClick={() => setSelectedTab('ingredients')}
                  className={`py-4 px-6 font-medium text-sm focus:outline-none ${selectedTab === 'ingredients'
                    ? 'border-b-2 border-rose-500 text-rose-500'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  Ingrédients
                </button>
                <button
                  onClick={() => setSelectedTab('instructions')}
                  className={`py-4 px-6 font-medium text-sm focus:outline-none ${selectedTab === 'instructions'
                    ? 'border-b-2 border-rose-500 text-rose-500'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  Instructions
                </button>
                <button
                  onClick={() => setSelectedTab('description')}
                  className={`py-4 px-6 font-medium text-sm focus:outline-none ${selectedTab === 'description'
                    ? 'border-b-2 border-rose-500 text-rose-500'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  Description
                </button>
              </nav>
            </div>

            {/* Contenu de l'onglet actif */}
            <div className="p-6">
              {selectedTab === 'ingredients' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Ingrédients</h2>
                  {recipe.ingredients && recipe.ingredients.length > 0 ? (
                    <ul className="space-y-2">
                      {recipe.ingredients.map((item, index) => (
                        <li key={index} className="flex items-center p-2 border-b border-gray-100 last:border-0">
                          <svg
                            className="w-5 h-5 text-rose-500 mr-3 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span>
                            {item.quantity && <span className="font-medium">{item.quantity} </span>}
                            {item.unit && <span>{item.unit} de </span>}
                            {item.ingredient.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic">Aucun ingrédient n'est spécifié pour cette recette.</p>
                  )}
                </div>
              )}

              {selectedTab === 'instructions' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Instructions</h2>
                  {recipe.steps && recipe.steps.length > 0 ? (
                    <ol className="space-y-6">
                      {recipe.steps.map((step) => (
                        <li key={step.id} className="flex">
                          <span className="flex-shrink-0 w-8 h-8 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center font-bold mr-4">
                            {step.stepNumber}
                          </span>
                          <div className="pt-1">
                            <p className="text-gray-700">{step.instruction}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="text-gray-500 italic">Aucune instruction n'est spécifiée pour cette recette.</p>
                  )}
                </div>
              )}

              {selectedTab === 'description' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Description</h2>
                  {recipe.description ? (
                    <p className="text-m mb-3">{recipe.description}</p>
                  ) : (
                    <p className="text-gray-500 italic">Aucune description n'est spécifiée pour cette recette.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          {isAuthenticated && (
            <div className="bg-gray-50 p-6 flex flex-wrap gap-4 justify-between">
              <div className="flex flex-wrap gap-2">
                <button className="inline-flex items-center px-4 py-2 border border-rose-500 rounded-md text-rose-500 bg-white hover:bg-rose-50 transition-colors">
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
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  Ajouter aux favoris
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-teal-500 rounded-md text-teal-500 bg-white hover:bg-teal-50 transition-colors">
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
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Ajouter au menu
                </button>
              </div>
              <div>
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
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
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                  Partager
                </button>
              </div>
            </div>
          )}

          {/* Source */}
          {recipe.sourceUrl && (
            <div className="p-4 text-sm text-center text-gray-500 border-t">
              Voir la recette sur <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-rose-500 hover:underline">{new URL(recipe.sourceUrl).hostname}</a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}