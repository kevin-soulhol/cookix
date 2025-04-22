import { json, MetaFunction, type LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData, useFetcher } from "@remix-run/react";
import { useState } from "react";
import BoxRecipe, { RecipeType } from "~/components/BoxRecipe";
import Layout from "~/components/Layout";
import { TypeMenuItem } from "./api.menu";


export const meta: MetaFunction = () => {
  return [
    { title: "Votre Menu - Cookix" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  // Récupérer l'ID du menu depuis les paramètres de requête
  const url = new URL(request.url);
  const menuId = url.searchParams.get("id");

  // Construire l'URL de l'API avec l'ID du menu si fourni
  const apiUrl = new URL(`${request.url.split('/').slice(0, 3).join('/')}/api/menu`);

  // Ajouter l'ID du menu comme paramètre si présent
  if (menuId) {
    apiUrl.searchParams.append("id", menuId);
  }

  const cookies = request.headers.get("Cookie");
  const response = await fetch(apiUrl.toString(), {
    method: "GET",
    headers: {
      Cookie: cookies || "", // Transmettre les cookies
    },
  });

  const dataMenu = await response.json();

  //récupéré les menus partagés

  const apiShareUrl = new URL(`${request.url.split('/').slice(0, 3).join('/')}/api/share`);
  const responseShare = await fetch(apiShareUrl.toString(), {
    method: "GET",
    headers: {
      Cookie: cookies || "", // Transmettre les cookies
    },
  });
  const dataShare = await responseShare.json();


  return json({
    ...dataMenu,
    ...dataShare
  });
}

export default function WeeklyMenu() {
  const {
    menu,
    menuItems,
    favoriteRecipes,
    shoppingListCount,
    shoppingListId,
    menuShares,
    sharedWithMe,
    pendingInvitations,
    isSharedMenu,
    canEdit,
    error
  } = useLoaderData<typeof loader>();

  const [showShareModal, setShowShareModal] = useState(false);
  const [email, setEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const shareFetcher = useFetcher();
  const removeItemFetcher = useFetcher();


  const deleteFetcher = useFetcher();
  const acceptFetcher = useFetcher();

  // Transformer les éléments du menu pour affichage
  const recipes = menuItems.map((item: TypeMenuItem) => item.recipe);

  // Filtrer les recettes si une recherche est en cours
  const filteredRecipes = recipes.filter((recipe: RecipeType) =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout pageTitle="Menu de la semaine" optionelClass={isSharedMenu && 'bg-blue-50'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isSharedMenu && (
          <div className="mb-4 bg-blue-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  Vous visualisez un menu partagé avec vous. {!canEdit && "Vous ne pouvez pas le modifier."}
                </p>
              </div>
            </div>
          </div>
        )}

        {error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 mb-8">
            {error}
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center space-x-4">
                {/* Bouton Liste de courses avec badge */}
                <Link
                  to={`/courses?listId=${shoppingListId}`}
                  className="relative inline-flex items-center p-2 bg-white border border-teal-500 text-teal-500 rounded-full hover:bg-teal-50 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
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
                  {shoppingListCount > 0 && (
                    <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-teal-500 rounded-full">
                      {shoppingListCount}
                    </span>
                  )}
                </Link>

                {/* Bouton de partage élégant */}
                {!isSharedMenu && (
                  <button
                    onClick={() => setShowShareModal(true)}
                    className="group relative inline-flex items-center p-2 bg-white border border-rose-500 text-rose-500 rounded-full hover:bg-rose-50 transition-colors"
                  >
                    <svg
                      className="w-5 h-5 transition-transform group-hover:rotate-12"
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
                  </button>
                )}

              </div>

              {/* Recherche dans le menu */}
              {menuItems.length > 0 && (
                <div className="flex-grow mx-4">
                  <div className="relative rounded-full shadow-sm">
                    <input
                      type="text"
                      placeholder="Rechercher dans votre menu..."
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-rose-500 focus:border-rose-500"
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
            </div>

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
                    to="/"
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
              <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-12">
                {filteredRecipes.map((recipe: RecipeType) => (
                  <div key={recipe.id} className="relative">
                    <BoxRecipe recipe={recipe} readOnly={true} compact={true} />

                    {/* Bouton suppression */}
                    {canEdit && (
                      <button
                        onClick={() => {
                          removeItemFetcher.submit(
                            { recipeId: recipe.id },
                            { method: "delete", action: "/api/menu" }
                          );
                        }}
                        className="delete-btn absolute top-3 right-3 bg-white bg-opacity-80 p-2 rounded-full shadow-md hover:bg-opacity-100 transition-all"
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
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Partagés avec moi */}
            {!isSharedMenu && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Partagés avec moi</h2>

                {sharedWithMe?.length > 0 ? (
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <ul className="divide-y divide-gray-200">
                      {sharedWithMe.map((share) => (
                        <li key={share.id} className="relative hover:bg-gray-50 group">
                          {/* Lien englobant vers le menu */}
                          <Link
                            to={`/menu?id=${share.menu.id}`}
                            className="block p-4"
                          >
                            <div className="flex items-center justify-between"> {/* Espace pour le bouton de suppression */}
                              <h3 className="font-medium text-gray-900 inline-flex w-full">{share.sharedByUser.email}</h3>

                              {share.includeShoppingList && (
                                <div className="flex flex-shrink-0 ">
                                  {share.shoppingList && (
                                    <div
                                      className="px-2.5 py-0.5 text-xs hover:text-teal-600 rounded-full text-xs font-medium bg-teal-100 text-teal-800"
                                    >
                                      Inclut la liste
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Bouton de suppression (icône) */}
                              <deleteFetcher.Form
                                method="post"
                                action="/api/share"
                                className="right-3"
                              >
                                <input type="hidden" name="_action" value="deleteShare" />
                                <input type="hidden" name="shareId" value={share.id} />
                                <button
                                  type="submit"
                                  className="p-1.5 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (!confirm("Êtes-vous sûr de vouloir supprimer ce partage ?")) {
                                      e.preventDefault();
                                    }
                                  }}
                                  aria-label="Supprimer"
                                >
                                  <svg
                                    className="w-4 h-4"
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
                              </deleteFetcher.Form>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-gray-500 bg-white p-6 rounded-lg shadow-md text-center">
                    Aucun menu n'est partagé avec vous pour le moment.
                  </p>
                )}
              </div>
            )}


            {/* Suggestions de recettes favorites */}
            {!isSharedMenu && favoriteRecipes.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-semibold mb-4">Ajouter depuis vos favoris</h2>
                <div className="grid grid-cols-3 md:grid-cols-3 gap-3">
                  {favoriteRecipes.map((recipe: RecipeType) => (
                    <BoxRecipe key={recipe.id} recipe={recipe} compact={true} />
                  ))}
                </div>
              </div>
            )}


            {/* Invitations en attente */}
            {!isSharedMenu && (
              <div className="mb-12">
                <h2 className="text-xl font-semibold mb-4">Invitations en attente</h2>

                {pendingInvitations?.length > 0 ? (
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <ul className="divide-y divide-gray-200">
                      {pendingInvitations.map((invitation) => (
                        <li key={invitation.id} className="p-4 hover:bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium text-gray-900">
                                Invitation de {invitation.sharedByUser.email}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {invitation.includeShoppingList
                                  ? "Menu et liste de courses"
                                  : "Menu uniquement"}
                              </p>
                              <p className="text-xs text-gray-400">
                                Reçue le {new Date(invitation.createdAt).toLocaleDateString()}
                              </p>
                            </div>

                            <div className="flex space-x-2">
                              <acceptFetcher.Form method="post" action="/api/share">
                                <input type="hidden" name="_action" value="acceptShare" />
                                <input type="hidden" name="token" value={invitation.token} />
                                <button
                                  type="submit"
                                  className="inline-flex items-center px-3 py-1.5 border border-green-500 text-xs font-medium rounded-md text-green-500 bg-white hover:bg-green-50"
                                >
                                  Accepter
                                </button>
                              </acceptFetcher.Form>

                              <deleteFetcher.Form method="post" action="/api/share">
                                <input type="hidden" name="_action" value="deleteShare" />
                                <input type="hidden" name="shareId" value={invitation.id} />
                                <button
                                  type="submit"
                                  className="inline-flex items-center px-3 py-1.5 border border-red-300 text-xs font-medium rounded-md text-red-500 bg-white hover:bg-red-50"
                                >
                                  Refuser
                                </button>
                              </deleteFetcher.Form>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-gray-500 bg-white p-6 rounded-lg shadow-md text-center">
                    Vous n'avez aucune invitation en attente.
                  </p>
                )}
              </div>
            )}


            {/* Liste des partages actifs */}
            {!isSharedMenu && menuShares.length > 0 && (
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
          </>
        )}
      </div>

      {/* Modal de partage */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Partager votre menu</h2>

            <shareFetcher.Form method="post" action="/api/share" onSubmit={() => setShowShareModal(false)}>
              <input type="hidden" name="_action" value="shareMenu" />
              <input type="hidden" name="menuId" value={menu?.id} />
              <input type="hidden" name="shoppingListId" value={shoppingListId} />

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

              <div className="mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="includeShoppingList"
                    name="includeShoppingList"
                    value="true"
                    defaultChecked={true}
                    className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
                  />
                  <label htmlFor="includeShoppingList" className="ml-2 block text-sm text-gray-700">
                    Inclure la liste de courses
                  </label>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Les ingrédients seront automatiquement ajoutés à la liste de courses de l'autre utilisateur.
                </p>
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