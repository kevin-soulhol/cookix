import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { Link, useFetcher, useLoaderData, useOutletContext } from "@remix-run/react";
import { useEffect, useState } from "react";
import Layout from "~/components/Layout";

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

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { recipeId } = params;

  if (!recipeId) {
    return json({ recipe: null, error: "ID de recette manquant" }, { status: 400 });
  }

  const apiUrl = new URL(`${request.url.split('/').slice(0, 3).join('/')}/api/recipes`);
  apiUrl.searchParams.append("id", recipeId);

  const cookies = request.headers.get("Cookie");
  try {
    const response = await fetch(apiUrl.toString(), {
      method: "GET",
      headers: {
        Cookie: cookies || "", // Transmettre les cookies pour l'authentification
      },
    });

    const apiResponse = await response.json();

    return json({
      recipe: apiResponse.recipe,
      error: false
    })


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
  const [inFavorites, setInFavorites] = useState(recipe.isFavorite);
  const [isAddingToMenu, setIsAddingToMenu] = useState(false);
  const [isAdded, setIsAdded] = useState(recipe.isInMenu);

  const favoriteFetcher = useFetcher();
  const isTogglingFavoriteInProgress = favoriteFetcher.state === "submitting";
  const menuFetcher = useFetcher();
  const isAddingToMenuInProgress = menuFetcher.state === "submitting";

  useEffect(() => {
    if (menuFetcher.state === "idle" && menuFetcher.data) {
      setIsAdded(true)
    }
  }, [menuFetcher])

  // Lorsque la requête est terminée, mettre à jour les states
  if (menuFetcher.state === "idle" && isAddingToMenu && isAddingToMenuInProgress) {
    setIsAddingToMenu(false);
  }

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
            to="/"
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
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                  {recipe.cookingTime ? `${recipe.cookingTime}` : 'Non spécifié'}
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
              <nav className="flex justify-between items-center">
                <div className="flex">
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
                </div>

                {/* Boutons d'action à droite */}
                {isAuthenticated && (
                  <div className="flex items-center gap-2 px-4">
                    <button
                      onClick={handleAddToMenu}
                      disabled={isAddingToMenuInProgress || isAdded}
                      className={`inline-flex items-center px-3 py-1.5 border border-teal-500 rounded-md text-teal-500 transition-colors text-sm ${isAdded ? 'bg-teal-600 text-white' : 'bg-white hover:bg-teal-50'}`}>
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
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {isAdded ? "Déjà dans le menu" : "Ajouter au menu"}
                    </button>
                  </div>
                )}
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

          {/* Source */}
          {recipe.sourceUrl && (
            <div className="p-4 text-sm text-center text-gray-500 border-t">
              Voir la recette sur <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-rose-500 hover:underline">{new URL(recipe.sourceUrl).hostname}</a>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}