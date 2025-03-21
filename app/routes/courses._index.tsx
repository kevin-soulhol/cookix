import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData, useFetcher } from "@remix-run/react";
import { useState } from "react";
import { prisma } from "~/utils/db.server";
import Layout from "~/components/Layout";
import { getUserId } from "./api.user";

// Action pour gérer les mises à jour de la liste de courses
export async function action({ request }: ActionFunctionArgs) {
    const userId = await getUserId(request);

    if (!userId) {
        return json({ success: false, message: "Il faut être connecté" }, { status: 400 });
    }

    const formData = await request.formData();
    const actionType = formData.get("_action");

    try {
        // Action pour cocher/décocher un élément
        if (actionType === "toggleItem") {
            const itemId = formData.get("itemId");
            const isChecked = formData.get("isChecked") === "true";

            if (!itemId) {
                return json({
                    success: false,
                    message: "ID de l'élément requis"
                }, { status: 400 });
            }

            // Mettre à jour l'état de l'élément
            await prisma.shoppingItem.update({
                where: {
                    id: parseInt(itemId.toString())
                },
                data: {
                    isChecked: !isChecked
                }
            });

            return json({
                success: true,
                message: "État de l'élément mis à jour"
            });
        }

        // Action pour supprimer un élément
        if (actionType === "removeItem") {
            const itemId = formData.get("itemId");

            if (!itemId) {
                return json({
                    success: false,
                    message: "ID de l'élément requis"
                }, { status: 400 });
            }

            // Supprimer l'élément
            await prisma.shoppingItem.delete({
                where: {
                    id: parseInt(itemId.toString())
                }
            });

            return json({
                success: true,
                message: "Élément supprimé de la liste"
            });
        }

        // Action pour ajouter un élément manuellement
        if (actionType === "addItem") {
            const name = formData.get("name");
            const quantity = formData.get("quantity");
            const unit = formData.get("unit");
            const listId = formData.get("listId");

            if (!name || !listId) {
                return json({
                    success: false,
                    message: "Nom de l'élément et ID de la liste requis"
                }, { status: 400 });
            }

            // Vérifier si l'ingrédient existe déjà
            let ingredient = await prisma.ingredient.findFirst({
                where: {
                    name: name.toString()
                }
            });

            // Créer l'ingrédient s'il n'existe pas
            if (!ingredient) {
                ingredient = await prisma.ingredient.create({
                    data: {
                        name: name.toString()
                    }
                });
            }

            // Ajouter l'élément à la liste de courses
            await prisma.shoppingItem.create({
                data: {
                    shoppingListId: parseInt(listId.toString()),
                    ingredientId: ingredient.id,
                    quantity: quantity ? parseFloat(quantity.toString()) : null,
                    unit: unit ? unit.toString() : null,
                    isChecked: false
                }
            });

            return json({
                success: true,
                message: "Élément ajouté à la liste"
            });
        }

        // Action pour vider les articles cochés
        if (actionType === "clearChecked") {
            const listId = formData.get("listId");

            if (!listId) {
                return json({
                    success: false,
                    message: "ID de la liste requis"
                }, { status: 400 });
            }

            // Supprimer tous les éléments cochés
            await prisma.shoppingItem.deleteMany({
                where: {
                    shoppingListId: parseInt(listId.toString()),
                    isChecked: true
                }
            });

            return json({
                success: true,
                message: "Éléments cochés supprimés"
            });
        }

        return json({
            success: false,
            message: "Action non reconnue"
        }, { status: 400 });

    } catch (error) {
        console.error("Erreur lors de l'action sur la liste de courses:", error);
        return json(
            { success: false, message: "Une erreur est survenue" },
            { status: 500 }
        );
    }
}

// Loader pour récupérer les données de la liste de courses
export async function loader({ request }: LoaderFunctionArgs) {
    const userId = await getUserId(request);

    if (!userId) {
        return json({ success: false, message: "Il faut être connecté" }, { status: 400 });
    }

    const url = new URL(request.url);
    const listId = url.searchParams.get("listId");

    try {
        // Récupérer la liste active ou celle spécifiée par l'ID
        let shoppingList;

        if (listId) {
            shoppingList = await prisma.shoppingList.findUnique({
                where: {
                    id: parseInt(listId)
                }
            });

            // Vérifier si la liste appartient à l'utilisateur
            if (shoppingList && shoppingList.userId !== userId) {
                return json(
                    {
                        error: "Vous n'avez pas accès à cette liste"
                    },
                    { status: 403 }
                );
            }
        } else {
            shoppingList = await prisma.shoppingList.findFirst({
                where: {
                    userId,
                }
            });
        }

        // Si aucune liste n'existe, en créer une nouvelle
        if (!shoppingList) {
            shoppingList = await prisma.shoppingList.create({
                data: {
                    userId,
                }
            });
        }

        // Récupérer les éléments de la liste
        const items = await prisma.shoppingItem.findMany({
            where: {
                shoppingListId: shoppingList.id
            },
            include: {
                ingredient: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: [
                { isChecked: 'asc' },
                {
                    ingredient: {
                        name: 'asc'
                    }
                },
            ]
        });

        return json({
            shoppingList,
            items,
            error: null
        });

    } catch (error) {
        console.error("Erreur lors du chargement de la liste de courses:", error);
        return json(
            {
                shoppingList: null,
                items: [],
                error: "Une erreur est survenue lors du chargement de la liste de courses"
            },
            { status: 500 }
        );
    }
}

export default function ShoppingList() {
    const { shoppingList, items, error } = useLoaderData<typeof loader>();
    const [showAddForm, setShowAddForm] = useState(false);
    const [newItemName, setNewItemName] = useState("");
    const [newItemQuantity, setNewItemQuantity] = useState("");
    const [newItemUnit, setNewItemUnit] = useState("");
    const [itemInFocus, setItemInFocus] = useState<number | null>(null);

    const toggleItemFetcher = useFetcher();
    const removeItemFetcher = useFetcher();
    const addItemFetcher = useFetcher();
    const clearCheckedFetcher = useFetcher();

    // Calculer le nombre d'articles cochés
    const checkedCount = items.filter(item => item.isChecked).length;

    // Calculer la progression
    const progress = items.length > 0 ? Math.round((checkedCount / items.length) * 100) : 0;

    // Gérer la soumission du formulaire d'ajout
    const handleAddItem = (e) => {
        e.preventDefault();

        if (!newItemName.trim()) return;

        addItemFetcher.submit(
            {
                _action: "addItem",
                name: newItemName,
                quantity: newItemQuantity,
                unit: newItemUnit,
                listId: shoppingList.id
            },
            { method: "post" }
        );

        // Réinitialiser le formulaire
        setNewItemName("");
        setNewItemQuantity("");
        setNewItemUnit("");
        setShowAddForm(false);
    };

    return (
        <Layout pageTitle="Liste de courses">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {error ? (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 mb-8">
                        {error}
                    </div>
                ) : (
                    <>
                        {/* En-tête de la liste */}
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold">Liste de courses</h1>

                            {checkedCount > 0 && (
                                <button
                                    onClick={() => {
                                        if (window.confirm("Voulez-vous supprimer tous les articles cochés ?")) {
                                            clearCheckedFetcher.submit(
                                                {
                                                    _action: "clearChecked",
                                                    listId: shoppingList.id
                                                },
                                                { method: "post" }
                                            );
                                        }
                                    }}
                                    className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    <svg
                                        className="w-5 h-5 mr-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                    </svg>
                                    Vider les cochés
                                </button>
                            )}
                        </div>

                        {/* Barre de progression */}
                        {items.length > 0 && (
                            <div className="mb-8">
                                <div className="flex justify-between text-sm text-gray-600 mb-1">
                                    <div>{checkedCount} sur {items.length} articles</div>
                                    <div>{progress}% complété</div>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className="bg-teal-500 h-2.5 rounded-full"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}

                        {/* Liste des courses */}
                        {items.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-lg shadow-md mb-8">
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
                                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                    />
                                </svg>
                                <h3 className="mt-2 text-lg font-medium text-gray-900">Votre liste est vide</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Ajoutez des articles manuellement ou depuis votre menu.
                                </p>
                                <div className="mt-6">
                                    <button
                                        onClick={() => setShowAddForm(true)}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                                    >
                                        Ajouter un article
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                                <ul className="divide-y divide-gray-200">
                                    {items.map(item => (
                                        <li
                                            key={item.id}
                                            className={`px-4 py-3 flex items-center hover:bg-gray-50 ${item.isChecked ? 'bg-gray-50' : ''
                                                }`}
                                            onMouseEnter={() => setItemInFocus(item.id)}
                                            onMouseLeave={() => setItemInFocus(null)}
                                        >
                                            <toggleItemFetcher.Form method="post">
                                                <input type="hidden" name="_action" value="toggleItem" />
                                                <input type="hidden" name="itemId" value={item.id} />
                                                <input type="hidden" name="isChecked" value={item.isChecked.toString()} />
                                                <button
                                                    type="submit"
                                                    className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${item.isChecked
                                                        ? 'bg-teal-500 border-teal-500 text-white'
                                                        : 'border-gray-300'
                                                        }`}
                                                    aria-label={item.isChecked ? "Décocher" : "Cocher"}
                                                >
                                                    {item.isChecked && (
                                                        <svg
                                                            className="w-3 h-3"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="3"
                                                                d="M5 13l4 4L19 7"
                                                            />
                                                        </svg>
                                                    )}
                                                </button>
                                            </toggleItemFetcher.Form>

                                            <div className="flex-grow">
                                                <span className={`font-medium ${item.isChecked ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                                                    {item.ingredient.name}
                                                </span>
                                                {(item.quantity || item.unit) && (
                                                    <span className={`ml-2 text-sm ${item.isChecked ? 'text-gray-400' : 'text-gray-500'
                                                        }`}>
                                                        {item.quantity && (
                                                            <span>{item.quantity}</span>
                                                        )}
                                                        {item.unit && (
                                                            <span> {item.unit}</span>
                                                        )}
                                                    </span>
                                                )}
                                            </div>

                                            {(itemInFocus === item.id || item.isChecked) && (
                                                <removeItemFetcher.Form method="post">
                                                    <input type="hidden" name="_action" value="removeItem" />
                                                    <input type="hidden" name="itemId" value={item.id} />
                                                    <button
                                                        type="submit"
                                                        className="text-gray-400 hover:text-red-500 ml-2"
                                                        aria-label="Supprimer"
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
                                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                            />
                                                        </svg>
                                                    </button>
                                                </removeItemFetcher.Form>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Bouton d'ajout d'article */}
                        {!showAddForm && (
                            <div className="text-center">
                                <button
                                    onClick={() => setShowAddForm(true)}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                                >
                                    <svg
                                        className="w-5 h-5 mr-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                        />
                                    </svg>
                                    Ajouter un article
                                </button>
                            </div>
                        )}

                        {/* Formulaire d'ajout d'article */}
                        {showAddForm && (
                            <div className="bg-white rounded-lg shadow-md p-4 mt-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Ajouter un article</h3>
                                <form onSubmit={handleAddItem}>
                                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                        <div className="sm:col-span-3">
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                                Nom de l'article *
                                            </label>
                                            <div className="mt-1">
                                                <input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    required
                                                    value={newItemName}
                                                    onChange={(e) => setNewItemName(e.target.value)}
                                                    className="shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                    placeholder="Ex: Tomates"
                                                />
                                            </div>
                                        </div>

                                        <div className="sm:col-span-2">
                                            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                                                Quantité
                                            </label>
                                            <div className="mt-1">
                                                <input
                                                    type="number"
                                                    id="quantity"
                                                    name="quantity"
                                                    step="0.01"
                                                    min="0"
                                                    value={newItemQuantity}
                                                    onChange={(e) => setNewItemQuantity(e.target.value)}
                                                    className="shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                    placeholder="Ex: 500"
                                                />
                                            </div>
                                        </div>

                                        <div className="sm:col-span-1">
                                            <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
                                                Unité
                                            </label>
                                            <div className="mt-1">
                                                <input
                                                    type="text"
                                                    id="unit"
                                                    name="unit"
                                                    value={newItemUnit}
                                                    onChange={(e) => setNewItemUnit(e.target.value)}
                                                    className="shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                    placeholder="Ex: g"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-5 flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={() => setShowAddForm(false)}
                                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            type="submit"
                                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                                        >
                                            Ajouter
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Lien vers le menu */}
                        <div className="text-center mt-8">
                            <Link
                                to="/menu"
                                className="inline-flex items-center text-teal-600 hover:text-teal-800"
                            >
                                <svg
                                    className="w-5 h-5 mr-1"
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
                                Retour au menu
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </Layout>
    );
}