import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData, useFetcher } from "@remix-run/react";
import { useState } from "react";
import BoxRecipe, { RecipeType } from "~/components/BoxRecipe";
import Layout from "~/components/Layout";
import { TypeMenuItem } from "./api.menu";


// Fonction pour partager le menu par email
export async function action() {
  /*
  // Pour un vrai système d'authentification, vous devriez récupérer l'userId depuis la session
  const userId = 1; // ID utilisateur fictif
  
  const formData = await request.formData();
  const actionType = formData.get("_action");
  
  try {
    // Action pour partager le menu
    if (actionType === "share") {
      const email = formData.get("email");
      const menuId = formData.get("menuId");
      
      if (!email || !menuId) {
        return json({ 
          success: false, 
          message: "Email et ID du menu requis" 
        }, { status: 400 });
      }
      
      // Dans une vraie implémentation, vous enverriez un email ou créeriez une invitation
      // Ici, nous simulons un partage en créant une entrée dans une table "MenuShare"
      await prisma.menuShare.create({
        data: {
          menuId: parseInt(menuId.toString()),
          sharedByUserId: userId,
          sharedWithEmail: email.toString(),
          token: Math.random().toString(36).substring(2, 15),
          isAccepted: false
        }
      });
      
      return json({ 
        success: true, 
        message: `Menu partagé avec ${email}` 
      });
    }
    
    // Action pour supprimer un élément du menu
    if (actionType === "removeItem") {
      const menuItemId = formData.get("menuItemId");
      
      if (!menuItemId) {
        return json({ 
          success: false, 
          message: "ID de l'élément du menu requis" 
        }, { status: 400 });
      }
      
      // Supprimer l'élément du menu
      await prisma.menuItem.delete({
        where: {
          id: parseInt(menuItemId.toString())
        }
      });
      
      return json({ 
        success: true, 
        message: "Élément supprimé du menu" 
      });
    }
    
    return json({ 
      success: false, 
      message: "Action non reconnue" 
    }, { status: 400 });
    
  } catch (error) {
    console.error("Erreur lors de l'action sur le menu:", error);
    return json(
      { success: false, message: "Une erreur est survenue" },
      { status: 500 }
    );
  }
    */
}

export async function loader({ request }: LoaderFunctionArgs) {
  // Appeler l'API menus
  const apiUrl = new URL(`${request.url.split('/').slice(0, 3).join('/')}/api/menu`);
  const cookies = request.headers.get("Cookie");
  const response = await fetch(apiUrl.toString(), {
    method: "GET",
    headers: {
      Cookie: cookies || "", // Transmettre les cookies
    },
  });

  const data = await response.json();
  console.log("__________________menuItems", data)
  return json(data)
}

export default function WeeklyMenu() {
  const {
    menu,
    menuItems,
    favoriteRecipes,
    shoppingListCount,
    shoppingListId,
    menuShares,
    error
  } = useLoaderData<typeof loader>();

  const [showShareModal, setShowShareModal] = useState(false);
  const [email, setEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const shareFetcher = useFetcher();
  const removeItemFetcher = useFetcher();

  // Transformer les éléments du menu pour affichage
  const recipes = menuItems.map((item: TypeMenuItem) => item.recipe);

  // Filtrer les recettes si une recherche est en cours
  const filteredRecipes = recipes.filter((recipe: RecipeType) =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout pageTitle="Menu de la semaine">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 mb-8">
            {error}
          </div>
        ) : (
          <>
            {/* En-tête du menu */}
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold">Menu de la semaine</h1>

              <div className="flex space-x-4">
                {/* Bouton liste de courses */}
                <Link
                  to={`/courses?listId=${shoppingListId}`}
                  className="inline-flex items-center px-4 py-2 border border-teal-500 rounded-md text-teal-500 bg-white hover:bg-teal-50 transition-colors"
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
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  Liste de courses
                  {shoppingListCount > 0 && (
                    <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-teal-500 rounded-full">
                      {shoppingListCount}
                    </span>
                  )}
                </Link>

                {/* Bouton partager */}
                <button
                  onClick={() => setShowShareModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
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
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                  Partager
                </button>
              </div>
            </div>

            {/* Recherche dans le menu */}
            {menuItems.length > 0 && (
              <div className="mb-6">
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="text"
                    placeholder="Rechercher dans votre menu..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
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
                  </div>
                </div>
              </div>
            )}

            {/* Liste des recettes du menu */}
            {menuItems.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-md mb-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
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
                <h3 className="mt-2 text-lg font-medium text-gray-900">Votre menu est vide</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Commencez à ajouter des recettes à votre menu pour planifier vos repas.
                </p>
                <div className="mt-6">
                  <Link
                    to="/recettes"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                  >
                    Explorer les recettes
                  </Link>
                </div>
              </div>
            ) : filteredRecipes.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-lg shadow-md mb-12">
                <p className="text-gray-500">Aucune recette ne correspond à votre recherche.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {filteredRecipes.map((recipe: RecipeType) => (
                  <div key={recipe.id} className="relative">
                    <BoxRecipe recipe={recipe} />

                    {/* Bouton suppression */}
                    <button
                      onClick={() => {
                        removeItemFetcher.submit(
                          { recipeId: recipe.id },
                          { method: "delete", action: "/api/menu" }
                        );
                      }}
                      className="absolute top-3 right-3 bg-white bg-opacity-80 p-2 rounded-full shadow-md hover:bg-opacity-100 transition-all"
                      aria-label="Retirer du menu"
                    >
                      <svg
                        className="w-5 h-5 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Liste des partages actifs */}
            {menuShares.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-semibold mb-4">Menu partagé avec</h2>
                <div className="bg-white rounded-lg shadow-md p-4">
                  <ul className="divide-y divide-gray-200">
                    {menuShares.map(share => (
                      <li key={share.id} className="py-3 flex justify-between items-center">
                        <div className="flex items-center">
                          <svg
                            className="w-5 h-5 text-gray-400 mr-3"
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
                          <span>{share.sharedWithEmail}</span>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${share.isAccepted
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                          }`}>
                          {share.isAccepted ? 'Accepté' : 'En attente'}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Suggestions de recettes favorites */}
            {favoriteRecipes.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Ajouter depuis vos favoris</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {favoriteRecipes.map((recipe: RecipeType) => (
                    <BoxRecipe key={recipe.id} recipe={recipe} />
                  ))}
                </div>
                {favoriteRecipes.length > 3 && (
                  <div className="text-center mt-6">
                    <Link
                      to="/favoris"
                      className="text-rose-500 hover:text-rose-700 font-medium"
                    >
                      Voir tous vos favoris
                    </Link>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de partage */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Partager votre menu</h2>

            <shareFetcher.Form method="post" onSubmit={() => setShowShareModal(false)}>
              <input type="hidden" name="_action" value="share" />
              <input type="hidden" name="menuId" value={menu?.id} />

              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                  placeholder="exemple@email.com"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowShareModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                >
                  Partager
                </button>
              </div>
            </shareFetcher.Form>
          </div>
        </div>
      )}
    </Layout>
  );
}