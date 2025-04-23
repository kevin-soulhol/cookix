/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { json, MetaFunction, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData, useFetcher, useSearchParams } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { prisma } from "~/utils/db.server";
import Layout from "~/components/Layout";
import { getUserId } from "./api.user";
import AutocompleteUnits from "~/components/AutocompleteUnits";

// Types pour les données des ingrédients et listes de courses
interface Ingredient {
    id: number;
    name: string;
}

interface Recipe {
    id: number;
    title: string;
    imageUrl: string | null;
}

interface ShoppingItem {
    id: number;
    shoppingListId: number;
    ingredientId: number;
    recipeId: number | null;
    quantity: number | null;
    unit: string | null;
    isChecked: boolean;
    marketplace: boolean;
    ingredient: {
        name: string;
    };
    recipe?: Recipe;
    // Champs ajoutés après regroupement
    recipeDetails?: Array<{ id: number; title: string }>;
    originalItems?: ShoppingItem[];
}

interface ShoppingList {
    id: number;
    userId: number;
    createdAt: Date;
}

interface RecipeGroup {
    id: number | string;
    title: string;
    imageUrl: string | null;
    items: ShoppingItem[];
}

interface CategorizedItems {
    checked: ShoppingItem[];
    firstMarketplace: ShoppingItem[];
    secondMarketplace: ShoppingItem[];
}

interface LoaderData {
    shoppingList: ShoppingList;
    items: RecipeGroup[] | ShoppingItem[];
    originalItems: ShoppingItem[];
    categorizedItems: CategorizedItems;
    groupByRecipe: boolean;
    error: string | null;
}

// Props pour les composants
interface ShoppingItemWithMarketplaceProps {
    item: ShoppingItem;
    onToggle: (applyToAll: boolean) => void;
    onRemove: (removeAllRelated: boolean) => void;
    onToggleMarketplace: (applyToAll: boolean) => void;
    showRecipeDetails?: boolean;
}

interface RecipeGroupedViewProps {
    recipeGroups: RecipeGroup[];
    onToggle: ReturnType<typeof useFetcher>;
    onRemove: ReturnType<typeof useFetcher>;
    onToggleMarketplace: ReturnType<typeof useFetcher>;
}

export const meta: MetaFunction = () => {
    return [
        { title: "Votre liste de course - Cookix" },
    ];
};

/**
 * Regroupe les articles de courses par ingrédient et unité
 */
function groupShoppingItemsByIngredient(items: ShoppingItem[]): ShoppingItem[] {
    // Créer un Map pour regrouper par ingredientId et unit
    const groupedMap = new Map<string, ShoppingItem>();

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
            const existingItem = groupedMap.get(key)!;

            // Ajouter la quantité
            existingItem.quantity = (existingItem.quantity || 0) + (item.quantity || 0);

            // Ajouter la référence à la recette si elle existe et n'est pas déjà incluse
            if (item.recipe &&
                !existingItem.recipeDetails?.some(r => r.id === item.recipe!.id)) {
                existingItem.recipeDetails!.push({
                    id: item.recipe.id,
                    title: item.recipe.title
                });
            }

            // Conserver la référence à l'item original
            existingItem.originalItems!.push(item);

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

/**
 * Regroupe les articles de courses par recette
 */
function groupShoppingItemsByRecipe(items: ShoppingItem[]): RecipeGroup[] {
    // Créer une map pour stocker les recettes et les éléments "sans recette"
    const recipeGroups = new Map<string, RecipeGroup>();

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
                    title: item.recipe?.title || "Recette inconnue",
                    imageUrl: item.recipe?.imageUrl || null,
                    items: []
                });
            }

            // Ajouter l'article au groupe de recette correspondant
            recipeGroups.get(recipeId)!.items.push(item);
        } else {
            // Articles ajoutés manuellement
            recipeGroups.get(manualItemsKey)!.items.push(item);
        }
    });

    // Convertir en tableau de groupes
    return Array.from(recipeGroups.values())
        .filter(group => group.items.length > 0) // Exclure les groupes vides
        .sort((a, b) => {
            // Placer les ajouts manuels en dernier
            if (a.id === manualItemsKey) return 1;
            if (b.id === manualItemsKey) return -1;
            return a.title.localeCompare(b.title);
        });
}

// Loader pour récupérer les données de la liste de courses
export async function loader({ request }: LoaderFunctionArgs): Promise<Response> {
    const userId = await getUserId(request);

    if (!userId) {
        return json({ success: false, message: "Il faut être connecté" }, { status: 400 });
    }

    const url = new URL(request.url);
    const listId = url.searchParams.get("listId");
    const groupByRecipe = url.searchParams.get("groupBy") === "recipe";

    try {
        // Récupérer la liste active ou celle spécifiée par l'ID
        let shoppingList: ShoppingList | null = null;

        if (listId) {
            const listIdNum = parseInt(listId, 10);

            shoppingList = await prisma.shoppingList.findUnique({
                where: { id: listIdNum }
            });

            if (!shoppingList) {
                return json({
                    success: false,
                    message: "Liste de courses non trouvée"
                }, { status: 404 });
            }

            // Vérifier si l'utilisateur est propriétaire du menu ou s'il a un partage accepté
            const hasAccess = shoppingList.userId === userId ||
                !!(await prisma.menuShare.findFirst({
                    where: {
                        shoppingListId: listIdNum,
                        OR: [
                            { sharedWithUserId: userId },
                            {
                                sharedWithEmail: {
                                    equals: (await prisma.user.findUnique({
                                        where: { id: userId }
                                    }))?.email
                                }
                            }
                        ],
                        isAccepted: true
                    }
                }));

            if (!hasAccess) {
                return json({
                    success: false,
                    message: "Vous n'avez pas accès à cette liste"
                }, { status: 403 });
            }
        } else {
            shoppingList = await prisma.shoppingList.findFirst({
                where: { userId }
            });
        }

        // Si aucune liste n'existe, en créer une nouvelle
        if (!shoppingList) {
            shoppingList = await prisma.shoppingList.create({
                data: { userId }
            });
        }

        // Récupérer les éléments de la liste
        const items: ShoppingItem[] = await prisma.shoppingItem.findMany({
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
                    { ingredient: { name: 'asc' } }
                ]
                : [
                    { isChecked: 'asc' },
                    { marketplace: 'asc' },
                    { ingredient: { name: 'asc' } }
                ]
        }) as ShoppingItem[];

        // Grouper les items selon le mode sélectionné
        const groupedItems = groupByRecipe
            ? groupShoppingItemsByRecipe(items)
            : groupShoppingItemsByIngredient(items);

        // Pour le mode non-groupé par recette, on catégorise aussi par status
        let categorizedItems: CategorizedItems;

        if (groupByRecipe) {
            // Pour le mode recette, cette structure existe mais reste vide
            // car l'affichage est géré différemment
            categorizedItems = {
                checked: [],
                firstMarketplace: [],
                secondMarketplace: []
            };
        } else {
            const items = groupedItems as ShoppingItem[];
            categorizedItems = {
                checked: items.filter(item => item.isChecked),
                firstMarketplace: items.filter(item => !item.isChecked && !item.marketplace),
                secondMarketplace: items.filter(item => !item.isChecked && item.marketplace)
            };
        }

        return json({
            shoppingList,
            items: groupedItems,
            originalItems: items,
            categorizedItems,
            groupByRecipe,
            error: null
        });

    } catch (error) {
        console.error("Erreur lors du chargement de la liste de courses:", error);
        return json({
            shoppingList: null,
            items: [],
            originalItems: [],
            categorizedItems: { checked: [], firstMarketplace: [], secondMarketplace: [] },
            groupByRecipe: false,
            error: "Une erreur est survenue lors du chargement de la liste de courses"
        },
            { status: 500 }
        );
    }
}

// Actions pour gérer les mises à jour de la liste de courses
export async function action({ request }: ActionFunctionArgs): Promise<Response> {
    const userId = await getUserId(request);

    if (!userId) {
        return json({ success: false, message: "Il faut être connecté" }, { status: 400 });
    }

    const formData = await request.formData();
    const actionType = formData.get("_action") as string | null;

    try {
        // Rediriger vers la fonction appropriée selon le type d'action
        switch (actionType) {
            case "toggleItem":
                return await toggleShoppingItem(formData);
            case "removeItem":
                return await removeShoppingItem(formData);
            case "addItem":
                return await addShoppingItem(formData);
            case "clearChecked":
                return await clearCheckedItems(formData);
            case "toggleMarketplace":
                return await toggleItemMarketplace(formData);
            default:
                return json({
                    success: false,
                    message: "Action non reconnue"
                }, { status: 400 });
        }
    } catch (error) {
        console.error("Erreur lors de l'action sur la liste de courses:", error);
        return json(
            { success: false, message: "Une erreur est survenue" },
            { status: 500 }
        );
    }
}

/**
 * Action pour cocher/décocher un élément de la liste
 */
async function toggleShoppingItem(formData: FormData): Promise<Response> {
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

/**
 * Action pour supprimer un élément de la liste
 */
async function removeShoppingItem(formData: FormData): Promise<Response> {
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

/**
 * Action pour ajouter un élément à la liste
 */
async function addShoppingItem(formData: FormData): Promise<Response> {
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

/**
 * Action pour vider les articles cochés
 */
async function clearCheckedItems(formData: FormData): Promise<Response> {
    const listId = formData.get("listId");
    const preserveRecipes = formData.get("preserveRecipes") === "true";

    if (!listId) {
        return json({
            success: false,
            message: "ID de la liste requis"
        }, { status: 400 });
    }

    const listIdNum = parseInt(listId.toString());

    if (preserveRecipes) {
        // Option 1: Décocher les articles plutôt que les supprimer
        // Utile si l'utilisateur veut conserver l'historique des articles de ses recettes
        await prisma.shoppingItem.updateMany({
            where: {
                shoppingListId: listIdNum,
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
                shoppingListId: listIdNum,
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
                shoppingListId: listIdNum,
                isChecked: true
            }
        });

        return json({
            success: true,
            message: "Articles cochés supprimés"
        });
    }
}

/**
 * Action pour changer la catégorie marketplace d'un élément
 */
async function toggleItemMarketplace(formData: FormData): Promise<Response> {
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

/**
 * Composant pour afficher un élément d'achat avec contrôles
 */
const ShoppingItemWithMarketplace: React.FC<ShoppingItemWithMarketplaceProps> = ({
    item,
    onToggle,
    onRemove,
    onToggleMarketplace,
    showRecipeDetails = true
}: ShoppingItemWithMarketplaceProps) => {
    const [showRecipes, setShowRecipes] = useState(false);

    // États pour le slide
    const [slideOffset, setSlideOffset] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const itemRef = useRef<HTMLLIElement>(null);
    const contentRef = useRef<HTMLDivElement>(null); // Référence pour le contenu qui glisse

    const SLIDE_THRESHOLD = 60; // Pixels à glisser pour déclencher l'action
    const MAX_SLIDE_VISUAL = 80; // Déplacement visuel maximum autorisé

    const targetMarketplaceInfo = !item.marketplace
        ? { // Devient Marché
            icon: (
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
            bgColor: "bg-green-100",
            label: "Vers Marché"
        }
        : { // Devient Supermarché
            icon: (
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
            ),
            bgColor: "bg-gray-200",
            label: "Vers Supermarché"
        };

    // --- Gestionnaires d'événements pour le slide ---

    const handleDragStart = (clientX: number) => {
        if (contentRef.current) {
            contentRef.current.style.transition = 'none'; // Désactiver la transition pendant le drag
        }
        setIsDragging(true);
        setStartX(clientX);
        setSlideOffset(0); // Réinitialiser le décalage au début
    };

    const handleDragMove = (clientX: number) => {
        if (!isDragging) return;

        const currentX = clientX;
        let deltaX = currentX - startX;

        // Autoriser uniquement le slide vers la droite
        deltaX = Math.max(0, deltaX);
        // Limiter le déplacement visuel
        deltaX = Math.min(deltaX, MAX_SLIDE_VISUAL);

        setSlideOffset(deltaX);
    };

    const handleDragEnd = () => {
        if (!isDragging) return;

        setIsDragging(false);

        // Réactiver la transition pour le retour
        if (contentRef.current) {
            contentRef.current.style.transition = 'transform 0.2s ease-out';
        }

        if (slideOffset >= SLIDE_THRESHOLD) {
            // Action déclenchée!
            console.log("Action toggle marketplace triggered!");
            onToggleMarketplace(true); // On assume que le slide affecte toujours tous les éléments liés
        }

        // Remettre l'élément à sa place (animé grâce à la transition)
        setSlideOffset(0);

        // Nettoyage potentiel (optionnel)
        setTimeout(() => {
            if (contentRef.current) {
                contentRef.current.style.transition = ''; // Remettre la transition par défaut si besoin
            }
        }, 200); // après la fin de l'animation de retour
    };

    // --- Adapteurs pour les événements souris et tactiles ---

    const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        handleDragStart(e.clientX);
    };

    const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        handleDragMove(e.clientX);
    };

    const onMouseUp = () => {
        handleDragEnd();
    };

    const onMouseLeave = () => {
        // Si l'utilisateur quitte l'élément en maintenant le clic, terminer le drag
        if (isDragging) {
            handleDragEnd();
        }
    };

    const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        // Vérifier qu'il n'y a qu'un seul doigt pour éviter les gestes multi-touch
        if (e.touches.length === 1) {
            handleDragStart(e.touches[0].clientX);
        }
    };

    const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (e.touches.length === 1) {
            handleDragMove(e.touches[0].clientX);
        }
    };

    const onTouchEnd = () => {
        handleDragEnd();
    };

    const onTouchCancel = () => {
        // Gérer le cas où le système annule le toucher
        handleDragEnd();
    };

    return (
        <li
            ref={itemRef}
            className={`
                shopping-item relative overflow-hidden 
                ${item.isChecked ? "bg-gray-50" : "bg-white"}
            `}
            onMouseLeave={() => {
                if (isDragging) handleDragEnd();
            }}
        >
            {/* Couche de fond pour l'action de slide */}
            <div
                className={`absolute inset-y-0 left-0 flex items-center px-4 ${targetMarketplaceInfo.bgColor} transition-opacity duration-100 ${isDragging && slideOffset > 10 ? 'opacity-100' : 'opacity-0'}`}
                style={{ width: `${MAX_SLIDE_VISUAL}px` }} // La largeur de la zone qui apparaît
                aria-hidden="true"
            >
                <span className="flex items-center justify-center w-full h-full">
                    {targetMarketplaceInfo.icon}
                </span>
            </div>

            {/* Contenu principal qui glisse */}
            <div
                ref={contentRef}
                className={`relative z-10 flex items-center py-3 px-4 bg-inherit transition-transform duration-200 ease-out ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} border-l-4 ${item.marketplace ? 'border-green-500' : 'border-transparent'}`}
                style={{ transform: `translateX(${slideOffset}px)` }}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseLeave} // Important pour terminer le drag si on sort
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                onTouchCancel={onTouchCancel}
            >
                {/* Bouton de check */}
                <button
                    type="button"
                    // Empêcher le bouton de check de déclencher le drag
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    onClick={() => onToggle(true)} // Par défaut, on applique à tous les éléments similaires
                    className="flex-shrink-0 mr-3 p-1 -ml-1"
                >
                    <span
                        className="w-5 h-5 rounded-full border flex items-center justify-center border-gray-300 bg-white" // Fond blanc pour visibilité
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

                {/* Infos de l'item */}
                <div className="flex flex-col gap-x-4 flex-grow min-w-0 mr-2">
                    <div className="flex items-center">
                        <span className={`font-medium text-gray-700 truncate flex-shrink-0 ${item.isChecked && "line-through text-gray-500"}`}>
                            {item.ingredient.name}
                        </span>
                    </div>

                    {(item.quantity || item.unit) && (
                        <span className="text-xs text-gray-500 flex-shrink-0">
                            {item.quantity && <span>{item.quantity}</span>}
                            <span> {item.unit ? item.unit : 'unité.s'}</span>
                        </span>
                    )}

                    {/* Afficher les recettes associées si disponibles */}
                    {showRecipeDetails && item.recipeDetails && item.recipeDetails.length > 0 && (
                        <div>
                            <button
                                // Empêcher le bouton de déclencher le drag
                                onMouseDown={(e) => e.stopPropagation()}
                                onTouchStart={(e) => e.stopPropagation()}
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

                {/* === BOUTON SUPPRIMER === */}
                <div className={`flex-shrink-0 transition-opacity duration-150`}>
                    <button
                        type="button"
                        onClick={() => onRemove(true)} // Par défaut, on supprime tous les éléments similaires
                        className={`text-gray-400 p-1 hover:text-red-500`}
                        aria-label="Supprimer"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
                {/* === FIN BOUTON SUPPRIMER === */}
            </div>
        </li>
    );
};

/**
 * Composant pour afficher les articles groupés par recette
 */
const RecipeGroupedView: React.FC<RecipeGroupedViewProps> = ({
    recipeGroups,
    onToggle,
    onRemove,
    onToggleMarketplace
}: RecipeGroupedViewProps) => {
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
                    <ul className="divide-y">
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
};

interface AddItemModalProps {
    isVisible: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    newItemName: string;
    setNewItemName: (value: string) => void;
    newItemQuantity: string;
    setNewItemQuantity: (value: string) => void;
    newItemUnit: string;
    setNewItemUnit: (value: string) => void;
    suggestions: Array<{ id: number; name: string }>;
    showSuggestions: boolean;
    setShowSuggestions: React.Dispatch<React.SetStateAction<boolean>>;
    suggestionsRef: React.RefObject<HTMLDivElement>;
    handleIngredientInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
    selectSuggestion: (suggestion: { id: number; name: string }) => void;
}

/**
 * Modal pour ajouter un nouvel élément
 */
const AddItemModal: React.FC<AddItemModalProps> = ({
    isVisible,
    onClose,
    onSubmit,
    newItemName,
    newItemQuantity,
    setNewItemQuantity,
    newItemUnit,
    setNewItemUnit,
    suggestions,
    setShowSuggestions,
    handleIngredientInput,
    selectSuggestion
}: AddItemModalProps) => {
    if (!isVisible) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex flex-col justify-end transition-all duration-300 ease-in-out"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div
                className="bg-white rounded-t-xl shadow-2xl max-w-md mx-auto w-full transform transition-transform duration-300 ease-in-out"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 shadow-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Ajouter un article</h3>
                    <form onSubmit={onSubmit}>
                        <div className="space-y-4">
                            <div className="relative">
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Nom de l'article *
                                </label>
                                <MobileAutoComplete
                                    value={newItemName}
                                    onChange={handleIngredientInput}
                                    suggestions={suggestions}
                                    onSelectSuggestion={selectSuggestion}
                                    setShowSuggestions={setShowSuggestions}
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
                                    <AutocompleteUnits
                                        value={newItemUnit}
                                        onChange={setNewItemUnit}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={onClose}
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
    );
};


interface MobileAutoCompleteProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    suggestions: Array<{ id: number; name: string }>;
    onSelectSuggestion: (suggestion: { id: number; name: string }) => void;
    setShowSuggestions: React.Dispatch<React.SetStateAction<boolean>>;
    placeholder?: string;
}
// Composant d'autocomplétion optimisé pour mobile avec création d'éléments
const MobileAutoComplete = ({
    value,
    onChange,
    suggestions,
    setShowSuggestions,
    onSelectSuggestion,
    placeholder
}: MobileAutoCompleteProps) => {
    const wrapperRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [setShowSuggestions]);

    // Fonction pour créer un nouvel élément avec la valeur actuelle
    const createNewItem = () => {
        if (value.trim()) {
            onSelectSuggestion({ id: null, name: value.trim() });
            setShowSuggestions(false);
        }
    };

    return (
        <div className="relative" ref={wrapperRef}>
            <div className="flex items-center border border-gray-300 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500">
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={onChange}
                    className="block w-full px-3 py-2 border-0 focus:outline-none bg-transparent"
                    placeholder={placeholder}
                    autoComplete="off"
                />
                {value.trim() && (
                    <button
                        type="button"
                        onClick={createNewItem}
                        className="p-2 text-teal-500 hover:text-teal-700 focus:outline-none"
                        aria-label="Valider cette entrée"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </button>
                )}
            </div>

            {suggestions.length > 0 && (
                <div className="absolute left-0 right-0 bg-white shadow-lg rounded-md mt-1 overflow-auto max-h-44 z-20">
                    {/* Option pour créer un nouvel élément si la valeur ne correspond à aucune suggestion */}
                    {value.trim() && !suggestions.some(s => s.name.toLowerCase() === value.toLowerCase()) && (
                        <div
                            className="p-3 border-b border-gray-100 bg-teal-50 hover:bg-teal-100 active:bg-teal-200 cursor-pointer flex items-center"
                            onClick={createNewItem}
                        >
                            <span className="font-medium flex-1">Ajouter "{value}"</span>
                            <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </div>
                    )}

                    {/* Suggestions existantes */}
                    {suggestions.map((suggestion) => (
                        <div
                            key={suggestion.id}
                            className="p-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 active:bg-gray-100 cursor-pointer"
                            onClick={() => {
                                onSelectSuggestion(suggestion);
                                setShowSuggestions(false);
                            }}
                        >
                            <div className="font-medium">{suggestion.name}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

interface ShareModalProps {
    isVisible: boolean;
    onClose: () => void;
    shoppingListId: number;
    email: string;
    setEmail: (value: string) => void;
    shareFetcher: ReturnType<typeof useFetcher>;
}

/**
 * Modal pour partager la liste de courses
 */
const ShareModal: React.FC<ShareModalProps> = ({
    isVisible,
    onClose,
    shoppingListId,
    email,
    setEmail,
    shareFetcher
}: ShareModalProps) => {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h2 className="text-lg font-bold mb-4">Partager votre liste de courses</h2>

                <shareFetcher.Form
                    method="post"
                    action="/api/share"
                    onSubmit={() => onClose()}
                >
                    <input type="hidden" name="_action" value="shareMenu" />
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

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
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
    );
};

interface ClearCheckedDialogProps {
    isVisible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    preserveRecipes: boolean;
    setPreserveRecipes: (value: boolean) => void;
}

/**
 * Dialogue de confirmation pour supprimer les éléments cochés
 */
const ClearCheckedDialog: React.FC<ClearCheckedDialogProps> = ({
    isVisible,
    onClose,
    onConfirm,
    preserveRecipes,
    setPreserveRecipes
}: ClearCheckedDialogProps) => {
    if (!isVisible) return null;

    return (
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
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                        Confirmer
                    </button>
                </div>
            </div>
        </div>
    );
};

/**
 * Composant pour la barre de progression à deux couleurs
 */
interface ProgressBarProps {
    marketplaceCount: number;
    otherCount: number;
    checkedMarketplaceCount: number;
    checkedOtherCount: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
    marketplaceCount,
    otherCount,
    checkedMarketplaceCount,
    checkedOtherCount
}: ProgressBarProps) => {

    const totalMarketplaceCount = marketplaceCount + checkedMarketplaceCount;
    const totalOtherCount = otherCount + checkedOtherCount;

    const marketplacePercentage = Math.round((checkedMarketplaceCount * 100 / totalMarketplaceCount)) || 0
    const otherplacePercentage = Math.round((checkedOtherCount * 100 / totalOtherCount)) || 0

    // Calculer les pourcentages de progression pour chaque catégorie


    return (
        <div className="fixed bottom-[77px] left-0 right-0 z-40">
            <div className="w-full h-3 flex">
                {/* Partie marché */}
                <div className="relative h-full w-[50%] full overflow-hidden" >
                    <div className="absolute inset-0 bg-gray-200">
                        <div
                            className="h-full bg-green-500 transition-all duration-300 ease-in-out"
                            style={{ width: `${marketplacePercentage}%` }}
                        />
                    </div>
                </div>

                {/* PAutre partie */}
                <div className="relative h-full w-[50%] full overflow-hidden" >
                    <div className="absolute inset-0 bg-gray-200">
                        <div
                            className="h-full bg-indigo-500 transition-all duration-300 ease-in-out"
                            style={{ width: `${otherplacePercentage}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * Composant principal de la liste de courses
 */
export default function ShoppingList() {
    const { shoppingList, items, categorizedItems, groupByRecipe, error } =
        useLoaderData<typeof loader>() as LoaderData;

    // États pour les modales et contrôles
    const [showAddModal, setShowAddModal] = useState<boolean>(false);
    const [showShareModal, setShowShareModal] = useState<boolean>(false);
    const [showClearCheckedDialog, setShowClearCheckedDialog] = useState<boolean>(false);
    const [preserveRecipes, setPreserveRecipes] = useState<boolean>(true);

    // États pour le formulaire d'ajout d'article
    const [newItemName, setNewItemName] = useState<string>("");
    const [newItemQuantity, setNewItemQuantity] = useState<string>("");
    const [newItemUnit, setNewItemUnit] = useState<string>("");
    const [email, setEmail] = useState<string>("");

    // États pour l'auto-complétion des ingrédients
    const [suggestions, setSuggestions] = useState<Array<{ id: number; name: string }>>([]);
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    // Fetchers pour les différentes actions
    const shareFetcher = useFetcher();
    const toggleItemFetcher = useFetcher();
    const removeItemFetcher = useFetcher();
    const toggleMarketplaceFetcher = useFetcher();
    const addItemFetcher = useFetcher();
    const clearCheckedFetcher = useFetcher();
    const ingredientsFetcher = useFetcher();

    // Gestion du mode d'affichage (groupé par recette ou par ingrédient)
    const [searchParams, setSearchParams] = useSearchParams();
    const groupByRecipeMode = groupByRecipe;

    // Compteurs pour l'affichage
    const marketplaceCount = categorizedItems?.secondMarketplace?.length || 0;
    const otherCount = categorizedItems?.firstMarketplace?.length || 0;

    // Compter les éléments cochés par catégorie
    const checkedItems = categorizedItems.checked || [];
    const checkedMarketplaceCount = checkedItems.filter(item => item.marketplace).length;
    const checkedOtherCount = checkedItems.filter(item => !item.marketplace).length;

    const totalCount = marketplaceCount + otherCount;
    const checkedCount = checkedMarketplaceCount + checkedOtherCount;

    // Calculer la progression
    const calculateProgressStats = () => {
        return {
            marketplaceCount: marketplaceCount,
            otherCount: otherCount,
            checkedMarketplaceCount: checkedMarketplaceCount,
            checkedOtherCount: checkedOtherCount,
            totalCount: totalCount,
            checkedCount: checkedCount
        };
    };
    const progressStats = calculateProgressStats();

    // Handler pour l'ajout d'un nouvel article
    const handleAddItem = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!newItemName.trim()) return;

        addItemFetcher.submit(
            {
                _action: "addItem",
                name: newItemName,
                quantity: newItemQuantity,
                unit: newItemUnit,
                listId: shoppingList.id.toString()
            },
            { method: "post" }
        );

        // Réinitialiser le formulaire
        setNewItemName("");
        setNewItemQuantity("");
        setNewItemUnit("");
        setShowAddModal(false);
    };

    // Handler pour la recherche d'ingrédients avec autocomplétion
    const handleIngredientInput = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    // Handler pour sélectionner un ingrédient dans les suggestions
    const selectSuggestion = (suggestion: { id: number; name: string }) => {
        setNewItemName(suggestion.name);
        setSuggestions([]);
        setShowSuggestions(false);
    };

    // Gestion du toggle d'article
    const handleToggleItem = (item: ShoppingItem, applyToAll: boolean) => {
        toggleItemFetcher.submit(
            {
                _action: "toggleItem",
                itemId: item.id.toString(),
                isChecked: item.isChecked.toString(),
                affectAllRelated: applyToAll.toString()
            },
            { method: "post" }
        );
    };

    // Gestion du toggle marketplace
    const handleToggleMarketplace = (item: ShoppingItem, applyToAll: boolean) => {
        toggleMarketplaceFetcher.submit(
            {
                _action: "toggleMarketplace",
                itemId: item.id.toString(),
                marketplace: item.marketplace.toString(),
                affectAllRelated: applyToAll.toString()
            },
            { method: "post" }
        );
    };

    // Gestion de la suppression d'article
    const handleRemoveItem = (item: ShoppingItem, removeAllRelated: boolean) => {
        removeItemFetcher.submit(
            {
                _action: "removeItem",
                itemId: item.id.toString(),
                removeAllRelated: removeAllRelated.toString()
            },
            { method: "post" }
        );
    };

    // Gestion du basculement entre modes d'affichage
    const toggleGroupBy = () => {
        const newParams = new URLSearchParams(searchParams);
        if (groupByRecipeMode) {
            newParams.delete("groupBy"); // Revenir au mode par défaut
        } else {
            newParams.set("groupBy", "recipe");
        }
        setSearchParams(newParams);
    };

    // Gestion de la suppression des éléments cochés
    const handleClearChecked = () => {
        clearCheckedFetcher.submit(
            {
                _action: "clearChecked",
                listId: shoppingList.id.toString(),
                preserveRecipes: preserveRecipes.toString()
            },
            { method: "post" }
        );
        setShowClearCheckedDialog(false);
    };

    // Effet pour mettre à jour les suggestions d'ingrédients
    useEffect(() => {
        if (ingredientsFetcher.data && ingredientsFetcher.data.ingredients) {
            setSuggestions(ingredientsFetcher.data.ingredients);
        }
    }, [ingredientsFetcher.data]);

    // Effet pour gérer les clics en dehors de la liste de suggestions
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, []);

    return (
        <Layout pageTitle="Liste de courses">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {error ? (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 mb-8">
                        {error}
                    </div>
                ) : (
                    <>
                        {/* En-tête avec boutons d'action */}
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex items-center space-x-4">
                                {/* Bouton de suppression des articles cochés */}
                                {checkedCount > 0 && (
                                    <button
                                        onClick={() => setShowClearCheckedDialog(true)}
                                        className="group relative inline-flex items-center p-2 bg-white border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors"
                                        aria-label="Supprimer les articles cochés"
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

                                {/* Bouton de partage */}
                                <button
                                    onClick={() => setShowShareModal(true)}
                                    className="group relative inline-flex items-center p-2 bg-white border border-rose-500 text-rose-500 rounded-full hover:bg-rose-50 transition-colors"
                                    aria-label="Partager la liste"
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
                                    className="group relative inline-flex items-center p-2 bg-white border border-indigo-500 text-indigo-500 rounded-full hover:bg-indigo-50 transition-colors"
                                    title={groupByRecipeMode ? "Grouper par ingrédient" : "Grouper par recette"}
                                    aria-label={groupByRecipeMode ? "Grouper par ingrédient" : "Grouper par recette"}
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        {groupByRecipeMode ? (
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M4 6h16M4 12h16m-7 6h7"
                                            />
                                        ) : (
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
                        {progressStats.totalCount > 0 && (
                            <ProgressBar
                                marketplaceCount={progressStats.marketplaceCount}
                                otherCount={progressStats.otherCount}
                                checkedMarketplaceCount={progressStats.checkedMarketplaceCount}
                                checkedOtherCount={progressStats.checkedOtherCount}
                            />
                        )}

                        {/* Contenu principal: liste des courses */}
                        {groupByRecipeMode ? (
                            <RecipeGroupedView
                                recipeGroups={items as RecipeGroup[]}
                                onToggle={toggleItemFetcher}
                                onRemove={removeItemFetcher}
                                onToggleMarketplace={toggleMarketplaceFetcher}
                            />
                        ) : (
                            <div className="mb-8">
                                <h2 className="text-lg font-semibold mb-3 flex items-center">
                                    <span className="text-gray-600">{progressStats.totalCount} articles</span>
                                    {progressStats.marketplaceCount > 0 && (
                                        <span className="ml-2 text-sm text-teal-600">
                                            {progressStats.marketplaceCount} du marché
                                        </span>
                                    )}
                                    {progressStats.otherCount > 0 && (
                                        <span className="ml-2 text-sm text-indigo-600">
                                            {progressStats.otherCount} autres
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
                                            {categorizedItems.secondMarketplace.map((item) => (
                                                <ShoppingItemWithMarketplace
                                                    key={item.id}
                                                    item={item}
                                                    onToggle={(applyToAll) => handleToggleItem(item, applyToAll)}
                                                    onRemove={(removeAllRelated) => handleRemoveItem(item, removeAllRelated)}
                                                    onToggleMarketplace={(applyToAll) => handleToggleMarketplace(item, applyToAll)}
                                                />
                                            ))}
                                            {categorizedItems.firstMarketplace.map((item) => (
                                                <ShoppingItemWithMarketplace
                                                    key={item.id}
                                                    item={item}
                                                    onToggle={(applyToAll) => handleToggleItem(item, applyToAll)}
                                                    onRemove={(removeAllRelated) => handleRemoveItem(item, removeAllRelated)}
                                                    onToggleMarketplace={(applyToAll) => handleToggleMarketplace(item, applyToAll)}
                                                />
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Liste des articles cochés */}
                        {categorizedItems.checked.length > 0 && (
                            <div className="mb-8">
                                <h2 className="text-lg font-semibold mb-3 text-gray-600">Articles cochés</h2>
                                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                    <ul className="divide-y">
                                        {categorizedItems.checked.map((item) => (
                                            <ShoppingItemWithMarketplace
                                                key={item.id}
                                                item={item}
                                                onToggle={(applyToAll) => handleToggleItem(item, applyToAll)}
                                                onRemove={(removeAllRelated) => handleRemoveItem(item, removeAllRelated)}
                                                onToggleMarketplace={(applyToAll) => handleToggleMarketplace(item, applyToAll)}
                                            />
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* Modales */}
                        <AddItemModal
                            isVisible={showAddModal}
                            onClose={() => setShowAddModal(false)}
                            onSubmit={handleAddItem}
                            newItemName={newItemName}
                            setNewItemName={setNewItemName}
                            newItemQuantity={newItemQuantity}
                            setNewItemQuantity={setNewItemQuantity}
                            newItemUnit={newItemUnit}
                            setNewItemUnit={setNewItemUnit}
                            suggestions={suggestions}
                            showSuggestions={showSuggestions}
                            setShowSuggestions={setShowSuggestions}
                            suggestionsRef={suggestionsRef}
                            handleIngredientInput={handleIngredientInput}
                            selectSuggestion={selectSuggestion}
                        />

                        <ShareModal
                            isVisible={showShareModal}
                            onClose={() => setShowShareModal(false)}
                            shoppingListId={shoppingList?.id}
                            email={email}
                            setEmail={setEmail}
                            shareFetcher={shareFetcher}
                        />

                        <ClearCheckedDialog
                            isVisible={showClearCheckedDialog}
                            onClose={() => setShowClearCheckedDialog(false)}
                            onConfirm={handleClearChecked}
                            preserveRecipes={preserveRecipes}
                            setPreserveRecipes={setPreserveRecipes}
                        />
                    </>
                )}
            </div>
        </Layout>
    );
}