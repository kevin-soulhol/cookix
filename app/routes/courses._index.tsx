/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { json, MetaFunction, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData, useFetcher, useSearchParams } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
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
            const affectAllRelated = formData.get("affectAllRelated") === "true";

            if (!itemId) {
                return json({
                    success: false,
                    message: "ID de l'élément requis"
                }, { status: 400 });
            }

            // Trouver l'élément concerné pour obtenir ses détails
            const item = await prisma.shoppingItem.findUnique({
                where: { id: parseInt(itemId.toString()) }
            });

            if (!item) {
                return json({
                    success: false,
                    message: "Élément non trouvé"
                }, { status: 404 });
            }

            if (affectAllRelated) {
                // Mettre à jour tous les éléments avec le même ingrédient et la même unité
                await prisma.shoppingItem.updateMany({
                    where: {
                        shoppingListId: item.shoppingListId,
                        ingredientId: item.ingredientId,
                        unit: item.unit
                    },
                    data: {
                        isChecked: !isChecked
                    }
                });
            } else {
                // Mettre à jour seulement l'élément spécifique
                await prisma.shoppingItem.update({
                    where: { id: parseInt(itemId.toString()) },
                    data: {
                        isChecked: !isChecked
                    }
                });
            }

            return json({
                success: true,
                message: "État de l'élément mis à jour"
            });
        }

        // Action pour supprimer un élément
        if (actionType === "removeItem") {
            const itemId = formData.get("itemId");
            const removeAllRelated = formData.get("removeAllRelated") === "true";

            if (!itemId) {
                return json({
                    success: false,
                    message: "ID de l'élément requis"
                }, { status: 400 });
            }

            // Trouver l'élément à supprimer pour obtenir ses détails
            const item = await prisma.shoppingItem.findUnique({
                where: { id: parseInt(itemId.toString()) }
            });

            if (!item) {
                return json({
                    success: false,
                    message: "Élément non trouvé"
                }, { status: 404 });
            }

            if (removeAllRelated) {
                // Supprimer tous les éléments avec le même ingrédient et la même unité
                await prisma.shoppingItem.deleteMany({
                    where: {
                        shoppingListId: item.shoppingListId,
                        ingredientId: item.ingredientId,
                        unit: item.unit
                    }
                });

                return json({
                    success: true,
                    message: "Tous les éléments similaires ont été supprimés de la liste"
                });
            } else {
                // Supprimer uniquement l'élément spécifique
                await prisma.shoppingItem.delete({
                    where: { id: parseInt(itemId.toString()) }
                });

                return json({
                    success: true,
                    message: "Élément supprimé de la liste"
                });
            }
        }

        // Action pour ajouter un élément manuellement
        if (actionType === "addItem") {
            const name = formData.get("name");
            const quantity = formData.get("quantity");
            const unit = formData.get("unit");
            const listId = formData.get("listId");
            const marketplace = formData.get("marketplace") === "true";

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

            // Vérifier si un élément manuel avec le même ingrédient et la même unité existe déjà
            const existingManualItem = await prisma.shoppingItem.findFirst({
                where: {
                    shoppingListId: parseInt(listId.toString()),
                    ingredientId: ingredient.id,
                    unit: unit ? unit.toString() : null,
                    recipeId: null // Élément ajouté manuellement
                }
            });

            if (existingManualItem) {
                // Mettre à jour l'élément existant
                await prisma.shoppingItem.update({
                    where: { id: existingManualItem.id },
                    data: {
                        quantity: quantity
                            ? (existingManualItem.quantity || 0) + parseFloat(quantity.toString())
                            : existingManualItem.quantity,
                        marketplace
                    }
                });
            } else {
                // Ajouter l'élément à la liste de courses sans recipeId (ajout manuel)
                await prisma.shoppingItem.create({
                    data: {
                        shoppingListId: parseInt(listId.toString()),
                        ingredientId: ingredient.id,
                        quantity: quantity ? parseFloat(quantity.toString()) : null,
                        unit: unit ? unit.toString() : null,
                        marketplace,
                        recipeId: null, // Explicitement null pour indiquer un ajout manuel
                        isChecked: false
                    }
                });
            }

            return json({
                success: true,
                message: "Élément ajouté à la liste"
            });
        }

        // Action pour vider les articles cochés
        if (actionType === "clearChecked") {
            const listId = formData.get("listId");
            const preserveRecipes = formData.get("preserveRecipes") === "true";

            if (!listId) {
                return json({
                    success: false,
                    message: "ID de la liste requis"
                }, { status: 400 });
            }

            if (preserveRecipes) {
                // Option 1: Décocher les articles plutôt que les supprimer
                // Utile si l'utilisateur veut conserver l'historique des articles de ses recettes
                await prisma.shoppingItem.updateMany({
                    where: {
                        shoppingListId: parseInt(listId.toString()),
                        isChecked: true,
                        recipeId: { not: null } // Seulement les articles liés aux recettes
                    },
                    data: {
                        isChecked: false // Décocher plutôt que supprimer
                    }
                });

                // Supprimer les articles manuels cochés (sans recette associée)
                await prisma.shoppingItem.deleteMany({
                    where: {
                        shoppingListId: parseInt(listId.toString()),
                        isChecked: true,
                        recipeId: null // Articles ajoutés manuellement
                    }
                });

                return json({
                    success: true,
                    message: "Articles cochés des recettes décochés, articles manuels supprimés"
                });
            } else {
                // Option 2: Supprimer tous les articles cochés
                await prisma.shoppingItem.deleteMany({
                    where: {
                        shoppingListId: parseInt(listId.toString()),
                        isChecked: true
                    }
                });

                return json({
                    success: true,
                    message: "Articles cochés supprimés"
                });
            }
        }

        // Action pour passer l'article comme achetable au marché
        if (actionType === "toggleMarketplace") {
            const itemId = formData.get("itemId");
            const currentMarketplace = formData.get("marketplace") === "true";
            const affectAllRelated = formData.get("affectAllRelated") === "true";

            if (!itemId) {
                return json({
                    success: false,
                    message: "ID de l'élément requis"
                }, { status: 400 });
            }

            // Trouver l'élément concerné pour obtenir ses détails
            const item = await prisma.shoppingItem.findUnique({
                where: { id: parseInt(itemId.toString()) }
            });

            if (!item) {
                return json({
                    success: false,
                    message: "Élément non trouvé"
                }, { status: 404 });
            }

            if (affectAllRelated) {
                // Mettre à jour tous les éléments avec le même ingrédient et la même unité
                await prisma.shoppingItem.updateMany({
                    where: {
                        shoppingListId: item.shoppingListId,
                        ingredientId: item.ingredientId,
                        unit: item.unit
                    },
                    data: {
                        marketplace: !currentMarketplace
                    }
                });
            } else {
                // Mettre à jour seulement l'élément spécifique
                await prisma.shoppingItem.update({
                    where: { id: parseInt(itemId.toString()) },
                    data: {
                        marketplace: !currentMarketplace
                    }
                });
            }

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
    const groupByRecipe = url.searchParams.get("groupBy") === "recipe";

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
                },
                recipe: {
                    select: {
                        id: true,
                        title: true,
                        imageUrl: true
                    }
                }
            },
            orderBy: groupByRecipe
                ? [
                    { recipeId: 'asc' }, // D'abord trier par ID de recette
                    { isChecked: 'asc' },
                    { marketplace: 'asc' },
                    {
                        ingredient: {
                            name: 'asc'
                        }
                    }
                ]
                : [
                    { isChecked: 'asc' },
                    { marketplace: 'asc' },
                    {
                        ingredient: {
                            name: 'asc'
                        }
                    }
                ]
        });

        let groupedItems;

        if (groupByRecipe) {
            // Grouper par recette
            groupedItems = groupShoppingItemsByRecipe(items);
        } else {
            // Grouper par ingrédient (comportement existant)
            groupedItems = groupShoppingItemsByIngredient(items);
        }

        const checkedItems = groupedItems.filter(item => item.isChecked);
        const firstMarketplaceItems = groupedItems.filter(item => !item.isChecked && !item.marketplace);
        const secondMarketplaceItems = groupedItems.filter(item => !item.isChecked && item.marketplace);


        return json({
            shoppingList,
            items: groupedItems,
            originalItems: items,
            categorizedItems: {
                checked: checkedItems,
                firstMarketplace: firstMarketplaceItems,
                secondMarketplace: secondMarketplaceItems
            },
            groupByRecipe,
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

function groupShoppingItemsByIngredient(items) {
    // Créer un Map pour regrouper par ingredientId et unit
    const groupedMap = new Map();

    items.forEach(item => {
        const key = `${item.ingredientId}-${item.unit || 'none'}`;

        if (!groupedMap.has(key)) {
            // Premier élément pour cet ingrédient+unité
            groupedMap.set(key, {
                ...item,
                recipeDetails: item.recipe ? [{ id: item.recipe.id, title: item.recipe.title }] : [],
                quantity: item.quantity || 0,
                originalItems: [item]
            });
        } else {
            // Regrouper avec des éléments existants
            const existingItem = groupedMap.get(key);

            // Ajouter la quantité
            existingItem.quantity += (item.quantity || 0);

            // Ajouter la référence à la recette si elle existe et n'est pas déjà incluse
            if (item.recipe && !existingItem.recipeDetails.some(r => r.id === item.recipe.id)) {
                existingItem.recipeDetails.push({ id: item.recipe.id, title: item.recipe.title });
            }

            // Conserver la référence à l'item original
            existingItem.originalItems.push(item);

            // Tout ingrédient est considéré comme non-coché si au moins un de ses composants ne l'est pas
            existingItem.isChecked = existingItem.isChecked && item.isChecked;

            // Pour le marketplace, on prend la valeur la plus fréquente
            // Ce serait plus précis de le calculer sur tous les items, mais cette approche simple devrait suffire
            existingItem.marketplace = existingItem.marketplace || item.marketplace;
        }
    });

    // Convertir le Map en tableau
    return Array.from(groupedMap.values());
}

function groupShoppingItemsByRecipe(items) {
    // Créer une map pour stocker les recettes et les éléments "sans recette"
    const recipeGroups = new Map();

    // Groupe spécial pour les éléments sans recette
    const manualItemsKey = "manual";
    recipeGroups.set(manualItemsKey, {
        id: manualItemsKey,
        title: "Ajouts manuels",
        imageUrl: null,
        items: []
    });

    // Parcourir tous les articles
    items.forEach(item => {
        if (item.recipeId) {
            // Articles provenant d'une recette
            const recipeId = item.recipeId.toString();

            if (!recipeGroups.has(recipeId)) {
                recipeGroups.set(recipeId, {
                    id: item.recipeId,
                    title: item.recipe.title,
                    imageUrl: item.recipe.imageUrl,
                    items: []
                });
            }

            // Ajouter l'article au groupe de recette correspondant
            recipeGroups.get(recipeId).items.push(item);
        } else {
            // Articles ajoutés manuellement
            recipeGroups.get(manualItemsKey).items.push(item);
        }
    });

    // Convertir en tableau de groupes
    const result = Array.from(recipeGroups.values())
        .filter(group => group.items.length > 0) // Exclure les groupes vides
        .sort((a, b) => {
            // Placer les ajouts manuels en dernier
            if (a.id === manualItemsKey) return 1;
            if (b.id === manualItemsKey) return -1;
            return a.title.localeCompare(b.title);
        });

    return result;
}

export default function ShoppingList() {
    const { shoppingList, items, categorizedItems, error } = useLoaderData<typeof loader>();
    const [showAddModal, setShowAddModal] = useState(false);
    const [newItemName, setNewItemName] = useState("");
    const [newItemQuantity, setNewItemQuantity] = useState("");
    const [newItemUnit, setNewItemUnit] = useState("");
    const [showShareModal, setShowShareModal] = useState(false);
    const [showClearCheckedDialog, setShowClearCheckedDialog] = useState(false);
    const [preserveRecipes, setPreserveRecipes] = useState(true); // Par défaut, préserver les articles des recettes
    const [email, setEmail] = useState("");
    const shareFetcher = useFetcher();
    const toggleGroupingFetcher = useFetcher();

    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestionsRef = useRef(null);
    const ingredientsFetcher = useFetcher();

    const toggleItemFetcher = useFetcher();
    const removeItemFetcher = useFetcher();
    const toggleMarketplaceFetcher = useFetcher();
    const addItemFetcher = useFetcher();
    const clearCheckedFetcher = useFetcher();

    const firstMarketplaceCount = categorizedItems?.firstMarketplace?.length || 0;
    const secondMarketplaceCount = categorizedItems?.secondMarketplace?.length || 0;
    const checkedCount = categorizedItems.checked?.length || 0;
    const totalCount = firstMarketplaceCount + secondMarketplaceCount;

    const [searchParams, setSearchParams] = useSearchParams();
    const groupByRecipe = searchParams.get("groupBy") === "recipe";


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

    //Gérer la saisie d'un nouvel ingrédient
    const handleIngredientInput = (e) => {
        const value = e.target.value;
        setNewItemName(value);

        if (value.length >= 2) {
            ingredientsFetcher.load(`/api/ingredients?search=${encodeURIComponent(value)}`);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    //Selectionne un ingrédient
    const selectSuggestion = (suggestion) => {
        setNewItemName(suggestion.name);
        setSuggestions([]);
        setShowSuggestions(false);
    };

    //Traiter les résultats de l'API
    useEffect(() => {
        if (ingredientsFetcher.data && ingredientsFetcher.data.ingredients) {
            setSuggestions(ingredientsFetcher.data.ingredients);
        }
    }, [ingredientsFetcher.data]);

    //Gérer les clics en dehors de la liste de suggestion
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    function onToggleItem(item: any, applyToAll: boolean) {
        toggleItemFetcher.submit(
            {
                _action: "toggleItem",
                itemId: item.id,
                isChecked: item.isChecked.toString(),
                affectAllRelated: applyToAll.toString()
            },
            { method: "post" }
        );
    }

    function onToggleMarketPlace(item: any, applyToAll: boolean) {
        toggleMarketplaceFetcher.submit(
            {
                _action: "toggleMarketplace",
                itemId: item.id,
                marketplace: item.marketplace.toString(),
                affectAllRelated: applyToAll.toString()
            },
            { method: "post" }
        );
    }

    const toggleGroupBy = () => {
        const newParams = new URLSearchParams(searchParams);
        if (groupByRecipe) {
            newParams.delete("groupBy"); // Revenir au mode par défaut
        } else {
            newParams.set("groupBy", "recipe");
        }
        setSearchParams(newParams);
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
                                        onClick={() => setShowClearCheckedDialog(true)} // Utilisons un état pour contrôler le dialogue
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

                                {/* Bouton pour basculer entre les modes de groupement */}
                                <button
                                    onClick={toggleGroupBy}
                                    type="submit"
                                    className="group relative inline-flex items-center p-2 bg-white border border-indigo-500 text-indigo-500 rounded-full hover:bg-indigo-50 transition-colors"
                                    title={groupByRecipe ? "Grouper par ingrédient" : "Grouper par recette"}
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        {groupByRecipe ? (
                                            // Icône pour le groupement par ingrédient
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M4 6h16M4 12h16m-7 6h7"
                                            />
                                        ) : (
                                            // Icône pour le groupement par recette
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                            />
                                        )}
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
                        {groupByRecipe ? (
                            <RecipeGroupedView
                                recipeGroups={items}
                                onToggle={toggleItemFetcher}
                                onRemove={removeItemFetcher}
                                onToggleMarketplace={toggleMarketplaceFetcher}
                            />
                        ) : (
                            <div className="mb-8">
                                <h2 className="text-lg font-semibold mb-3 flex items-center">
                                    <span className="text-gray-600">{totalCount} articles</span>
                                    {secondMarketplaceCount > 0 && (
                                        <span className="ml-2 text-sm text-teal-600">
                                            {secondMarketplaceCount} du marché
                                        </span>
                                    )}
                                    {firstMarketplaceCount > 0 && (
                                        <span className="ml-2 text-sm text-indigo-600">
                                            {firstMarketplaceCount} autres
                                        </span>
                                    )}
                                </h2>

                                {totalCount === 0 ? (
                                    <div className="bg-white rounded-lg shadow-md p-4 text-center text-gray-500">
                                        Aucun article pour le supermarché
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                        <ul className="divide-y divide-gray-200">
                                            {categorizedItems.secondMarketplace.map(item => (
                                                <ShoppingItemWithMarketplace
                                                    key={item.id}
                                                    item={item}
                                                    onToggle={(applyToAll) => {
                                                        onToggleItem(item, applyToAll)
                                                    }}
                                                    onRemove={(removeAllRelated) => {
                                                        removeItemFetcher.submit(
                                                            {
                                                                _action: "removeItem",
                                                                itemId: item.id,
                                                                removeAllRelated: removeAllRelated.toString()
                                                            },
                                                            { method: "post" }
                                                        );
                                                    }}
                                                    onToggleMarketplace={(applyToAll) => {
                                                        onToggleMarketPlace(item, applyToAll)
                                                    }}
                                                />
                                            ))}
                                            {categorizedItems.firstMarketplace.map(item => (
                                                <ShoppingItemWithMarketplace
                                                    key={item.id}
                                                    item={item}
                                                    onToggle={(applyToAll) => {
                                                        onToggleItem(item, applyToAll)
                                                    }}
                                                    onRemove={(removeAllRelated) => {
                                                        removeItemFetcher.submit(
                                                            {
                                                                _action: "removeItem",
                                                                itemId: item.id,
                                                                removeAllRelated: removeAllRelated.toString()
                                                            },
                                                            { method: "post" }
                                                        );
                                                    }}
                                                    onToggleMarketplace={(applyToAll) => {
                                                        onToggleMarketPlace(item, applyToAll)
                                                    }}
                                                />
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}


                        {/* Liste des courses - Articles cochés */}
                        {categorizedItems.checked.length > 0 && (
                            <div className="mb-8">
                                <h2 className="text-lg font-semibold mb-3 text-gray-600">Articles cochés</h2>
                                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                    <ul className="divide-y divide-gray-200">
                                        {categorizedItems.checked.map(item => (
                                            <ShoppingItemWithMarketplace
                                                key={item.id}
                                                item={item}
                                                onToggle={(applyToAll) => {
                                                    onToggleItem(item, applyToAll)
                                                }}
                                                onRemove={(removeAllRelated) => {
                                                    removeItemFetcher.submit(
                                                        {
                                                            _action: "removeItem",
                                                            itemId: item.id,
                                                            removeAllRelated: removeAllRelated.toString()
                                                        },
                                                        { method: "post" }
                                                    );
                                                }}
                                                onToggleMarketplace={(applyToAll) => {
                                                    onToggleMarketPlace(item, applyToAll)
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
                                                <div className="relative">
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
                                                        onChange={handleIngredientInput}
                                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                                                        placeholder="Ex: Tomates"
                                                        autoComplete="off"
                                                    />
                                                    {showSuggestions && suggestions.length > 0 && (
                                                        <div
                                                            ref={suggestionsRef}
                                                            className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm"
                                                        >
                                                            {suggestions.map((suggestion) => (
                                                                <div
                                                                    key={suggestion.id}
                                                                    onClick={() => selectSuggestion(suggestion)}
                                                                    className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100"
                                                                >
                                                                    {suggestion.name}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
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

                        {/* Dialogue de confirmation clearCheckes */}
                        {showClearCheckedDialog && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                                <div className="bg-white p-5 rounded-lg shadow-xl max-w-md w-full">
                                    <h3 className="text-lg font-medium mb-3">Supprimer les articles cochés</h3>
                                    <p className="mb-4 text-gray-600">
                                        Comment souhaitez-vous gérer les articles cochés provenant de vos recettes?
                                    </p>

                                    <div className="space-y-2 mb-4">
                                        <label className="flex items-start">
                                            <input
                                                type="radio"
                                                name="clearOption"
                                                checked={preserveRecipes}
                                                onChange={() => setPreserveRecipes(true)}
                                                className="mt-1 mr-2"
                                            />
                                            <div>
                                                <span className="font-medium">Décocher les articles des recettes</span>
                                                <p className="text-xs text-gray-500">
                                                    Les articles ajoutés manuellement seront supprimés, ceux des recettes seront simplement décochés
                                                </p>
                                            </div>
                                        </label>

                                        <label className="flex items-start">
                                            <input
                                                type="radio"
                                                name="clearOption"
                                                checked={!preserveRecipes}
                                                onChange={() => setPreserveRecipes(false)}
                                                className="mt-1 mr-2"
                                            />
                                            <div>
                                                <span className="font-medium">Tout supprimer</span>
                                                <p className="text-xs text-gray-500">
                                                    Tous les articles cochés seront supprimés, y compris ceux provenant des recettes
                                                </p>
                                            </div>
                                        </label>
                                    </div>

                                    <div className="flex justify-end space-x-3">
                                        <button
                                            onClick={() => setShowClearCheckedDialog(false)}
                                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            onClick={() => {
                                                clearCheckedFetcher.submit(
                                                    {
                                                        _action: "clearChecked",
                                                        listId: shoppingList.id,
                                                        preserveRecipes: preserveRecipes.toString()
                                                    },
                                                    { method: "post" }
                                                );
                                                setShowClearCheckedDialog(false);
                                            }}
                                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                        >
                                            Confirmer
                                        </button>
                                    </div>
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
function ShoppingItemWithMarketplace({ item, onToggle, onRemove, onToggleMarketplace, showRecipeDetails = true }) {
    const [showRecipes, setShowRecipes] = useState(false);
    const [applyToAll, setApplyToAll] = useState(true);

    // Fonction de suppression avec confirmation
    const handleRemove = () => {
        onRemove(true);
    };

    const handleToggle = () => {
        onToggle(applyToAll);
    };

    const handleToggleMarketplace = () => {
        onToggleMarketplace(applyToAll);
    };

    // Définir les icônes et couleurs pour chaque catégorie
    const marketplaceInfo = item.marketplace
        ? {
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
            color: "bg-green-100 text-green-700 border-green-300"
        }
        : {
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
            ),
            color: "bg-gray-100 text-gray-700 border-gray-300"
        };

    return (
        <li className={`px-4 relative ${item.marketplace ? 'before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-green-500' : ''} ${item.isChecked && "bg-gray-50"}`}>
            <div className="flex items-center py-3">
                {/* Bouton de check */}
                <button
                    type="button"
                    onClick={onToggle}
                    className="flex-shrink-0 mr-3"
                >
                    <span
                        className="w-5 h-5 rounded-full border flex items-center justify-center border-gray-300"
                        aria-hidden="true"
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
                    </span>
                </button>

                <div className="flex-grow min-w-0 mr-2">
                    <div className="flex items-center">
                        <span className={`font-medium text-gray-700 truncate ${item.isChecked && "line-through text-gray-500"}`}>
                            {item.ingredient.name}
                        </span>
                        {(item.quantity || item.unit) && (
                            <span className="ml-1 text-sm text-gray-500 flex-shrink-0">
                                {item.quantity && <span>{item.quantity}</span>}
                                {item.unit && <span> {item.unit}</span>}
                            </span>
                        )}
                    </div>

                    {/* Afficher les recettes associées si disponibles */}
                    {item.recipeDetails && item.recipeDetails.length > 0 && (
                        <div>
                            <button
                                onClick={() => setShowRecipes(!showRecipes)}
                                className="text-xs text-rose-500 mt-1 flex items-center"
                            >
                                <span>{showRecipes ? "Masquer" : "Voir"} les recettes ({item.recipeDetails.length})</span>
                                <svg
                                    className={`ml-1 w-3 h-3 transition-transform ${showRecipes ? "rotate-180" : ""}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {showRecipes && (
                                <div className="mt-1 pl-2 border-l-2 border-rose-200">
                                    {item.recipeDetails.map((recipe, idx) => (
                                        <div key={idx} className="text-xs text-gray-500">
                                            • {recipe.title}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Boutons d'action */}
                <div className="flex items-center space-x-2 flex-shrink-0">
                    {/* Bouton pour changer la catégorie */}
                    <button
                        type="button"
                        onClick={onToggleMarketplace}
                        className={`p-1 rounded-full ${marketplaceInfo.color} hover:opacity-80 transition-colors `}
                        aria-label={item.marketplace ? "Déplacer vers le supermarché" : "Déplacer vers le marché"}
                        title={item.marketplace ? "Marché" : "Supermarché"}
                    >
                        {marketplaceInfo.icon}
                    </button>

                    {/* Bouton de supression */}
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="text-gray-400 p-1 hover:text-red-500"
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
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </li>
    );

}

//Composant d'affichage regroupé par recipe
function RecipeGroupedView({ recipeGroups, onToggle, onRemove, onToggleMarketplace }) {
    return (
        <div className="space-y-8">
            {recipeGroups.map((group) => (
                <div key={group.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* En-tête du groupe de recette */}
                    <div className="bg-gray-50 p-4 border-b border-gray-200 flex items-center">
                        {group.imageUrl ? (
                            <div
                                className="w-12 h-12 rounded-md bg-cover bg-center mr-3 flex-shrink-0"
                                style={{ backgroundImage: `url(${group.imageUrl})` }}
                            />
                        ) : (
                            <div className="w-12 h-12 rounded-md bg-gray-200 flex items-center justify-center mr-3 flex-shrink-0">
                                <svg
                                    className="w-6 h-6 text-gray-400"
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
                            </div>
                        )}

                        <div>
                            <h3 className="font-semibold text-gray-900">{group.title}</h3>
                            <p className="text-xs text-gray-500">{group.items.length} ingrédient{group.items.length > 1 ? 's' : ''}</p>
                        </div>
                    </div>

                    {/* Liste des ingrédients pour cette recette */}
                    <ul className="divide-y divide-gray-200">
                        {group.items.map((item) => (
                            <ShoppingItemWithMarketplace
                                key={item.id}
                                item={item}
                                onToggle={(applyToAll) => {
                                    onToggle.submit(
                                        {
                                            _action: "toggleItem",
                                            itemId: item.id,
                                            isChecked: item.isChecked.toString(),
                                            affectAllRelated: applyToAll.toString()
                                        },
                                        { method: "post" }
                                    );
                                }}
                                onRemove={(removeAllRelated) => {
                                    onRemove.submit(
                                        {
                                            _action: "removeItem",
                                            itemId: item.id,
                                            removeAllRelated: removeAllRelated.toString()
                                        },
                                        { method: "post" }
                                    );
                                }}
                                onToggleMarketplace={(applyToAll) => {
                                    onToggleMarketplace.submit(
                                        {
                                            _action: "toggleMarketplace",
                                            itemId: item.id,
                                            marketplace: item.marketplace.toString(),
                                            affectAllRelated: applyToAll.toString()
                                        },
                                        { method: "post" }
                                    );
                                }}
                                showRecipeDetails={false} // Pas besoin de montrer les détails de recette ici
                            />
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}