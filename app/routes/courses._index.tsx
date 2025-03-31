import { json, MetaFunction, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData, useFetcher } from "@remix-run/react";
import { useState } from "react";
import { prisma } from "~/utils/db.server";
import Layout from "~/components/Layout";
import { getUserId } from "./api.user";


export const meta: MetaFunction = () => {
    return [
        { title: "Votre liste de course - Cookix" },
    ];
};

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
                    marketplace: formData.get("marketplace") === "true",
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

        // Action pour passer l'article comme achetable au marché
        if (actionType === "toggleMarketplace") {
            const itemId = formData.get("itemId");
            const currentMarketplace = formData.get("marketplace") === "true";

            if (!itemId) {
                return json({
                    success: false,
                    message: "ID de l'élément requis"
                }, { status: 400 });
            }

            // Mettre à jour le marketplace de l'élément
            await prisma.shoppingItem.update({
                where: {
                    id: parseInt(itemId.toString())
                },
                data: {
                    marketplace: !currentMarketplace
                }
            });

            return json({
                success: true,
                message: "Magasin de l'élément mis à jour"
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


            // Vérifier si l'utilisateur est propriétaire du menu ou s'il a un partage accepté
            const hasAccess = shoppingList.userId === userId || await prisma.menuShare.findFirst({
                where: {
                    shoppingListId: parseInt(listId),
                    OR: [
                        { sharedWithUserId: userId },
                        { sharedWithEmail: { equals: (await prisma.user.findUnique({ where: { id: userId } }))?.email } }
                    ],
                    isAccepted: true
                }
            });

            if (!hasAccess) {
                return json({ success: false, message: "Vous n'avez pas accès à cette liste" }, { status: 403 });
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
                { marketplace: 'asc' },
                {
                    ingredient: {
                        name: 'asc'
                    }
                },
            ]
        });

        const checkedItems = items.filter(item => item.isChecked);
        const firstMarketplaceItems = items.filter(item => !item.isChecked && !item.marketplace);
        const secondMarketplaceItems = items.filter(item => !item.isChecked && item.marketplace);


        return json({
            shoppingList,
            items,
            categorizedItems: {
                checked: checkedItems,
                firstMarketplace: firstMarketplaceItems,
                secondMarketplace: secondMarketplaceItems
            },
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
    const { shoppingList, items, categorizedItems, error } = useLoaderData<typeof loader>();
    const [showAddModal, setShowAddModal] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newItemName, setNewItemName] = useState("");
    const [newItemQuantity, setNewItemQuantity] = useState("");
    const [newItemUnit, setNewItemUnit] = useState("");
    const [itemInFocus, setItemInFocus] = useState<number | null>(null);
    const [showShareModal, setShowShareModal] = useState(false);
    const [email, setEmail] = useState("");
    const shareFetcher = useFetcher();

    const toggleItemFetcher = useFetcher();
    const removeItemFetcher = useFetcher();
    const toggleMarketplaceFetcher = useFetcher();
    const addItemFetcher = useFetcher();
    const clearCheckedFetcher = useFetcher();

    const firstMarketplaceCount = categorizedItems.firstMarketplace?.length || 0;
    const secondMarketplaceCount = categorizedItems.secondMarketplace?.length || 0;
    const checkedCount = categorizedItems.checked?.length || 0;
    const totalCount = firstMarketplaceCount + secondMarketplaceCount + checkedCount;

    // Calculer la progression
    const progress = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

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
        setShowAddModal(false);
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
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex items-center space-x-4">
                                {/* Bouton de suppression des articles cochés */}
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
                                        className="group relative inline-flex items-center p-2 bg-white border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors"
                                    >
                                        <svg
                                            className="w-5 h-5 transition-transform group-hover:rotate-6"
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
                                )}

                                {/* Bouton de partage élégant */}
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
                            </div>

                            {/* Bouton d'ajout d'article */}
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
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

                        {/* Barre de progression */}
                        {items.length > 0 && (
                            <div className="fixed bottom-[77px] left-0 right-0 z-40">
                                <div className="w-full bg-gray-200 h-3">
                                    <div
                                        className="bg-teal-500 h-3 transition-all duration-300 ease-in-out"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}

                        {/* Liste des courses */}
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold mb-3 flex items-center">
                                <span className="text-gray-600">{firstMarketplaceCount} articles</span>
                            </h2>

                            {firstMarketplaceCount === 0 ? (
                                <div className="bg-white rounded-lg shadow-md p-4 text-center text-gray-500">
                                    Aucun article pour le supermarché
                                </div>
                            ) : (
                                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                    <ul className="divide-y divide-gray-200">
                                        {categorizedItems.firstMarketplace.map(item => (
                                            <ShoppingItemWithMarketplace
                                                key={item.id}
                                                item={item}
                                                onToggle={() => {
                                                    toggleItemFetcher.submit(
                                                        {
                                                            _action: "toggleItem",
                                                            itemId: item.id,
                                                            isChecked: item.isChecked.toString()
                                                        },
                                                        { method: "post" }
                                                    );
                                                }}
                                                onRemove={() => {
                                                    removeItemFetcher.submit(
                                                        {
                                                            _action: "removeItem",
                                                            itemId: item.id
                                                        },
                                                        { method: "post" }
                                                    );
                                                }}
                                                onToggleMarketplace={() => {
                                                    toggleMarketplaceFetcher.submit(
                                                        {
                                                            _action: "toggleMarketplace",
                                                            itemId: item.id,
                                                            marketplace: item.marketplace.toString()
                                                        },
                                                        { method: "post" }
                                                    );
                                                }}
                                            />
                                        ))}
                                        {categorizedItems.secondMarketplace.map(item => (
                                            <ShoppingItemWithMarketplace
                                                key={item.id}
                                                item={item}
                                                onToggle={() => {
                                                    toggleItemFetcher.submit(
                                                        {
                                                            _action: "toggleItem",
                                                            itemId: item.id,
                                                            isChecked: item.isChecked.toString()
                                                        },
                                                        { method: "post" }
                                                    );
                                                }}
                                                onRemove={() => {
                                                    removeItemFetcher.submit(
                                                        {
                                                            _action: "removeItem",
                                                            itemId: item.id
                                                        },
                                                        { method: "post" }
                                                    );
                                                }}
                                                onToggleMarketplace={() => {
                                                    toggleMarketplaceFetcher.submit(
                                                        {
                                                            _action: "toggleMarketplace",
                                                            itemId: item.id,
                                                            marketplace: item.marketplace.toString()
                                                        },
                                                        { method: "post" }
                                                    );
                                                }}
                                            />
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Liste des courses - Articles cochés */}
                        {categorizedItems.checked.length > 0 && (
                            <div className="mb-8">
                                <h2 className="text-lg font-semibold mb-3 text-gray-600">Articles cochés</h2>
                                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                    <ul className="divide-y divide-gray-200">
                                        {categorizedItems.checked.map(item => (
                                            <ShoppingItem
                                                key={item.id}
                                                item={item}
                                                onToggle={() => {
                                                    toggleItemFetcher.submit(
                                                        {
                                                            _action: "toggleItem",
                                                            itemId: item.id,
                                                            isChecked: item.isChecked.toString()
                                                        },
                                                        { method: "post" }
                                                    );
                                                }}
                                                onRemove={() => {
                                                    removeItemFetcher.submit(
                                                        {
                                                            _action: "removeItem",
                                                            itemId: item.id
                                                        },
                                                        { method: "post" }
                                                    );
                                                }}
                                            />
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {showAddModal && (
                            <div
                                className="fixed inset-x-0 bottom-0 z-50 transition-all duration-300 ease-in-out"
                                onClick={(e) => {
                                    // Fermer la modale si on clique en dehors du contenu
                                    if (e.target === e.currentTarget) {
                                        setShowAddModal(false);
                                    }
                                }}
                            >
                                <div
                                    className="bg-white rounded-t-xl shadow-2xl max-w-md mx-auto transform transition-transform duration-300 ease-in-out"
                                    onClick={(e) => e.stopPropagation()} // Empêcher la fermeture quand on clique sur le contenu
                                >
                                    <div className="p-6 shadow-lg">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Ajouter un article</h3>
                                        <form onSubmit={handleAddItem}>
                                            <div className="space-y-4">
                                                <div>
                                                    <label
                                                        htmlFor="name"
                                                        className="block text-sm font-medium text-gray-700 mb-1"
                                                    >
                                                        Nom de l'article *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="name"
                                                        name="name"
                                                        required
                                                        value={newItemName}
                                                        onChange={(e) => setNewItemName(e.target.value)}
                                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                                                        placeholder="Ex: Tomates"
                                                    />
                                                </div>

                                                <div className="grid grid-cols-3 gap-3">
                                                    <div>
                                                        <label
                                                            htmlFor="quantity"
                                                            className="block text-sm font-medium text-gray-700 mb-1"
                                                        >
                                                            Quantité
                                                        </label>
                                                        <input
                                                            type="number"
                                                            id="quantity"
                                                            name="quantity"
                                                            step="0.01"
                                                            min="0"
                                                            value={newItemQuantity}
                                                            onChange={(e) => setNewItemQuantity(e.target.value)}
                                                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                                                            placeholder="Ex: 500"
                                                        />
                                                    </div>

                                                    <div className="col-span-2">
                                                        <label
                                                            htmlFor="unit"
                                                            className="block text-sm font-medium text-gray-700 mb-1"
                                                        >
                                                            Unité
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="unit"
                                                            name="unit"
                                                            value={newItemUnit}
                                                            onChange={(e) => setNewItemUnit(e.target.value)}
                                                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                                                            placeholder="Ex: g"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex justify-end space-x-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowAddModal(false)}
                                                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                                    >
                                                        Annuler
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700"
                                                    >
                                                        Ajouter
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Modal de partage */}
                        {showShareModal && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                                    <h2 className="text-lg font-bold mb-4">Partager votre liste de courses</h2>

                                    <shareFetcher.Form method="post" action="/api/share" onSubmit={() => setShowShareModal(false)}>
                                        <input type="hidden" name="_action" value="shareMenu" />
                                        <input type="hidden" name="shoppingListId" value={shoppingList.id} />
                                        {/* Laissez menuId vide - dans l'API nous allons gérer ce cas spécial */}

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
                    </>
                )}
            </div>
        </Layout>
    );
}

// Composant pour les articles non cochés (avec switch de marketplace)
function ShoppingItemWithMarketplace({ item, onToggle, onRemove, onToggleMarketplace }) {
    const [itemInFocus, setItemInFocus] = useState(false);

    return (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events
        <li
            className={`px-4 py-3 flex items-center hover:bg-gray-50 relative ${item.marketplace ? 'before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-green-500' : ''}`}
            onMouseEnter={() => setItemInFocus(true)}
            onMouseLeave={() => setItemInFocus(false)}
            onClick={onToggleMarketplace}
        >
            <button
                type="button"
                onClick={onToggle}
                className="w-5 h-5 rounded-full border mr-3 flex items-center justify-center border-gray-300"
                aria-label="Cocher"
            >
                {item.isChecked && (
                    <svg
                        className="w-3 h-3 text-teal-500"
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

            <div className="flex-grow">
                <span className="font-medium text-gray-700">
                    {item.ingredient.name}
                </span>
                {(item.quantity || item.unit) && (
                    <span className="ml-2 text-sm text-gray-500">
                        {item.quantity && <span>{item.quantity}</span>}
                        {item.unit && <span> {item.unit}</span>}
                    </span>
                )}
            </div>

            <div className="flex items-center">
                {/* Switch pour changer de magasin - toujours visible */}
                <button
                    type="button"
                    onClick={onToggleMarketplace}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full mr-2 ${item.marketplace
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                >
                    <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${item.marketplace ? 'translate-x-6' : 'translate-x-1'
                            }`}
                    />
                </button>

                {/* Bouton de suppression - apparaît uniquement au focus */}
                {itemInFocus && (
                    <button
                        type="button"
                        onClick={onRemove}
                        className="text-gray-400 hover:text-red-500"
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
                )}
            </div>
        </li>
    );
}


function ShoppingItem({ item, onToggle, onRemove }) {
    const [itemInFocus, setItemInFocus] = useState(false);

    return (
        <li
            className="px-4 py-3 flex items-center hover:bg-gray-50 bg-gray-50"
            onMouseEnter={() => setItemInFocus(true)}
            onMouseLeave={() => setItemInFocus(false)}
        >
            <button
                type="button"
                onClick={onToggle}
                className="w-5 h-5 rounded-full border mr-3 flex items-center justify-center bg-teal-500 border-teal-500 text-white"
                aria-label="Décocher"
            >
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
            </button>

            <div className="flex-grow">
                <span className="font-medium line-through text-gray-500">
                    {item.ingredient.name}
                </span>
                {(item.quantity || item.unit) && (
                    <span className="ml-2 text-sm text-gray-400">
                        {item.quantity && <span>{item.quantity}</span>}
                        {item.unit && <span> {item.unit}</span>}
                    </span>
                )}
            </div>

            {(itemInFocus || true) && (
                <button
                    type="button"
                    onClick={onRemove}
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
            )}
        </li>
    );
}