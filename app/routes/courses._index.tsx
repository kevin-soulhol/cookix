// app/routes/shopping-list.tsx
import { json, redirect, type MetaFunction, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData, useFetcher, useSearchParams } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { prisma } from "~/utils/db.server";
import {
    groupShoppingItemsByIngredient,
    groupShoppingItemsByRecipe,
    categorizeShoppingItems,
    getCurrentMonthKey,
    isIngredientInSeason,
} from "~/utils/shopping-list.utils"; // Import utils
import type {
    ShoppingListLoaderData,
    ShoppingItem,
    ShoppingList,
    IngredientSuggestion,
    CategorizedItems,
    RecipeGroup
} from "~/types/shopping-list.types"; // Import types

// Import extracted components
import Layout from "~/components/Layout";
import { ProgressBar } from "~/components/shopping-list/ProgressBar";
import { RecipeGroupedView } from "~/components/shopping-list/RecipeGroupedView";
import { ShoppingItemWithMarketplace } from "~/components/shopping-list/ShoppingItemWithMarketplace";
import { AddItemModal } from "~/components/shopping-list/AddItemModal";
import { ShareModal } from "~/components/shopping-list/ShareModal";
import { ClearCheckedDialog } from "~/components/shopping-list/ClearCheckedDialog";
import { getUserId } from "~/utils/auth.server";

// --- Meta Function ---
export const meta: MetaFunction = () => {
    return [
        { title: "Votre liste de course - Cookix" },
        { name: "description", content: "Gérez facilement votre liste de courses, ajoutez des articles manuellement ou depuis vos recettes." }
    ];
};

// --- Loader Function ---
export async function loader({ request }: LoaderFunctionArgs): Promise<Response> {
    const userId = await getUserId(request);
    if (!userId) {
        // Instead of returning JSON error, redirect to login for better UX
        // You might need to adjust your login route and how it handles redirects
        const loginUrl = new URL('/login', request.url); // Adjust '/login' as needed
        loginUrl.searchParams.set('redirectTo', new URL(request.url).pathname);
        return redirect(loginUrl.toString());
        // Or, if you prefer showing an error on the page:
        // return json<ShoppingListLoaderData>({ /* ... error structure ... */ }, { status: 401 });
    }

    const url = new URL(request.url);
    const listIdParam = url.searchParams.get("listId");
    const groupByRecipe = url.searchParams.get("groupBy") === "recipe";
    const currentMonthKey = getCurrentMonthKey(); // Get current month for seasonality check

    try {
        let shoppingList: ShoppingList | null = null;

        // 1. Find or Create Shopping List and Check Access
        if (listIdParam) {
            const listIdNum = parseInt(listIdParam, 10);
            if (isNaN(listIdNum)) {
                return json<ShoppingListLoaderData>({ shoppingList: null, items: [], originalItems: [], categorizedItems: { checked: [], firstMarketplace: [], secondMarketplace: [] }, groupByRecipe: false, error: "ID de liste invalide." }, { status: 400 });
            }

            shoppingList = await prisma.shoppingList.findUnique({ where: { id: listIdNum } });

            if (!shoppingList) {
                return json<ShoppingListLoaderData>({ shoppingList: null, items: [], originalItems: [], categorizedItems: { checked: [], firstMarketplace: [], secondMarketplace: [] }, groupByRecipe: false, error: "Liste de courses non trouvée." }, { status: 404 });
            }

            // Access Check: Owner or accepted share
            const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
            const hasAccess = shoppingList.userId === userId || (user?.email && !!(await prisma.menuShare.findFirst({
                where: {
                    shoppingListId: listIdNum,
                    // Simplified OR condition assuming MenuShare links directly to user ID or email
                    OR: [
                        { sharedWithUserId: userId },
                        { sharedWithEmail: user.email }
                    ],
                    isAccepted: true,
                }
            })));

            if (!hasAccess) {
                return json<ShoppingListLoaderData>({ shoppingList: null, items: [], originalItems: [], categorizedItems: { checked: [], firstMarketplace: [], secondMarketplace: [] }, groupByRecipe: false, error: "Accès non autorisé à cette liste." }, { status: 403 });
            }

        } else {
            // Find user's primary list or create one if none exists
            shoppingList = await prisma.shoppingList.findFirst({ where: { userId } });
            if (!shoppingList) {
                shoppingList = await prisma.shoppingList.create({ data: { userId } });
            }
        }

        // 2. Fetch Shopping Items
        const rawItems: ShoppingItem[] = await prisma.shoppingItem.findMany({
            where: { shoppingListId: shoppingList.id },
            include: {
                ingredient: { include: { seasonInfo: true } }, // Include seasonInfo here
                recipe: { select: { id: true, title: true, imageUrl: true } },
            },
            orderBy: [
                { isChecked: 'asc' },
                { marketplace: 'asc' }, // Group by store preference
                { ingredient: { name: 'asc' } },
                { recipeId: 'asc' } // Then group by recipe (relevant for recipe view)
            ],
        }) as unknown as ShoppingItem[]; // Cast needed if Prisma types don't perfectly match

        // 3. Enhance items with calculated seasonality
        const enhancedItems = rawItems.map(item => ({
            ...item,
            ingredient: {
                ...item.ingredient,
                // Ensure seasonInfo exists before accessing properties
                seasonInfo: {
                    ...item.ingredient.seasonInfo, // Spread existing info
                    isInSeason: isIngredientInSeason(item.ingredient.seasonInfo, currentMonthKey),
                    isPermanent: !!item.ingredient.seasonInfo?.isPerennial,
                    isFruit: !!item.ingredient.seasonInfo?.isFruit,
                    isVegetable: !!item.ingredient.seasonInfo?.isVegetable,
                }
            }
        }));

        // 4. Group and Categorize based on view mode
        let displayItems: RecipeGroup[] | ShoppingItem[];
        let categorizedItems: CategorizedItems = { checked: [], firstMarketplace: [], secondMarketplace: [] };

        if (groupByRecipe) {
            displayItems = groupShoppingItemsByRecipe(enhancedItems);
            // CategorizedItems is not directly used in recipe view, but we might need counts later
            // For simplicity, we can categorize the original items to get counts if needed,
            // or leave categorizedItems empty for this view. Let's calculate based on originals for counts.
            const tempGroupedForCounts = groupShoppingItemsByIngredient(enhancedItems);
            categorizedItems = categorizeShoppingItems(tempGroupedForCounts);

        } else {
            const groupedByIngredient = groupShoppingItemsByIngredient(enhancedItems);
            displayItems = groupedByIngredient; // View displays items grouped by ingredient
            categorizedItems = categorizeShoppingItems(groupedByIngredient);
        }

        return json<ShoppingListLoaderData>({
            shoppingList,
            items: displayItems,
            originalItems: enhancedItems, // Return the raw (but enhanced) items
            categorizedItems,
            groupByRecipe,
            error: null,
        });

    } catch (error) {
        console.error("Erreur loader liste de courses:", error);
        // Provide a more generic error message to the user
        return json<ShoppingListLoaderData>({
            shoppingList: null,
            items: [],
            originalItems: [],
            categorizedItems: { checked: [], firstMarketplace: [], secondMarketplace: [] },
            groupByRecipe: false,
            error: "Impossible de charger la liste de courses. Veuillez réessayer."
        }, { status: 500 });
    }
}

// --- Action Function ---
export async function action({ request }: ActionFunctionArgs): Promise<Response> {
    const userId = await getUserId(request);
    if (!userId) {
        return json({ success: false, message: "Authentification requise." }, { status: 401 });
    }

    const formData = await request.formData();
    const actionType = formData.get("_action") as string | null;
    const listIdStr = formData.get("listId") as string | null; // Get listId for ownership checks

    // --- Helper for Authorization Check ---
    const checkListOwnership = async (listId: number | null): Promise<boolean> => {
        if (listId === null) return false; // Cannot verify without ID
        const list = await prisma.shoppingList.findUnique({
            where: { id: listId },
            select: { userId: true } // Only need userId for check
        });
        return list?.userId === userId;
        // Note: Shared list access check might be needed here too, depending on desired permissions for actions.
        // For simplicity now, actions require ownership unless specified otherwise.
    };

    // --- Action Handlers (kept within route action scope) ---

    /** Action: Toggle item checked status */
    const toggleShoppingItemAction = async (): Promise<Response> => {
        const itemId = formData.get("itemId");
        const isChecked = formData.get("isChecked") === "true";
        const affectAllRelated = formData.get("affectAllRelated") === "true"; // Affect all items grouped by ingredient/unit
        const listId = listIdStr ? parseInt(listIdStr) : null;

        if (!itemId || typeof itemId !== 'string' || listId === null) {
            return json({ success: false, message: "Données invalides." }, { status: 400 });
        }
        const itemIdNum = parseInt(itemId);
        if (isNaN(itemIdNum)) {
            return json({ success: false, message: "ID article invalide." }, { status: 400 });
        }

        // Authorization: Find item and check its list's owner
        const item = await prisma.shoppingItem.findUnique({ where: { id: itemIdNum }, select: { shoppingListId: true, ingredientId: true, unit: true } });
        if (!item || !(await checkListOwnership(item.shoppingListId))) {
            return json({ success: false, message: "Action non autorisée ou article non trouvé." }, { status: 403 });
        }

        try {
            if (affectAllRelated) {
                // Update all items matching the ingredient/unit on the *same list*
                await prisma.shoppingItem.updateMany({
                    where: {
                        shoppingListId: item.shoppingListId,
                        ingredientId: item.ingredientId,
                        unit: item.unit, // Match unit exactly (null vs value)
                    },
                    data: { isChecked: !isChecked },
                });
            } else {
                // Update only the specific item
                await prisma.shoppingItem.update({
                    where: { id: itemIdNum },
                    data: { isChecked: !isChecked },
                });
            }
            return json({ success: true });
        } catch (error) {
            console.error("Erreur toggleItem:", error);
            return json({ success: false, message: "Erreur serveur." }, { status: 500 });
        }
    };

    /** Action: Remove item(s) */
    const removeShoppingItemAction = async (): Promise<Response> => {
        const itemId = formData.get("itemId");
        const removeAllRelated = formData.get("removeAllRelated") === "true";
        const listId = listIdStr ? parseInt(listIdStr) : null;

        if (!itemId || typeof itemId !== 'string' || listId === null) {
            return json({ success: false, message: "Données invalides." }, { status: 400 });
        }
        const itemIdNum = parseInt(itemId);
        if (isNaN(itemIdNum)) {
            return json({ success: false, message: "ID article invalide." }, { status: 400 });
        }

        const item = await prisma.shoppingItem.findUnique({ where: { id: itemIdNum }, select: { shoppingListId: true, ingredientId: true, unit: true } });
        if (!item || !(await checkListOwnership(item.shoppingListId))) {
            return json({ success: false, message: "Action non autorisée ou article non trouvé." }, { status: 403 });
        }

        try {
            if (removeAllRelated) {
                await prisma.shoppingItem.deleteMany({
                    where: {
                        shoppingListId: item.shoppingListId,
                        ingredientId: item.ingredientId,
                        unit: item.unit,
                    },
                });
            } else {
                await prisma.shoppingItem.delete({ where: { id: itemIdNum } });
            }
            return json({ success: true });
        } catch (error) {
            console.error("Erreur removeItem:", error);
            return json({ success: false, message: "Erreur serveur." }, { status: 500 });
        }
    };

    /** Action: Add a new manual item */
    const addShoppingItemAction = async (): Promise<Response> => {
        const name = formData.get("name") as string | null;
        const quantityStr = formData.get("quantity") as string | null;
        const unit = formData.get("unit") as string | null;
        const marketplace = formData.get("marketplace") === "true"; // Default to false if not present? Check component.
        const listId = listIdStr ? parseInt(listIdStr) : null;

        if (!name || !listId || isNaN(listId)) {
            return json({ success: false, message: "Nom et ID de liste requis." }, { status: 400 });
        }
        if (!(await checkListOwnership(listId))) {
            return json({ success: false, message: "Action non autorisée." }, { status: 403 });
        }

        const quantity = quantityStr ? parseFloat(quantityStr) : null;
        if (quantityStr && isNaN(quantity!)) {
            return json({ success: false, message: "Quantité invalide." }, { status: 400 });
        }

        try {
            // Find or create the ingredient
            let ingredient = await prisma.ingredient.findUnique({ where: { name } });
            if (!ingredient) {
                ingredient = await prisma.ingredient.create({ data: { name } });
                // Consider creating basic seasonInfo here if applicable/possible
            }

            // Check if a manual item (recipeId: null) with the same ingredient/unit already exists
            const existingManualItem = await prisma.shoppingItem.findFirst({
                where: {
                    shoppingListId: listId,
                    ingredientId: ingredient.id,
                    unit: unit || null, // Ensure consistent null checking
                    recipeId: null,
                }
            });

            if (existingManualItem) {
                // Update existing manual item quantity
                await prisma.shoppingItem.update({
                    where: { id: existingManualItem.id },
                    data: {
                        // Add to existing quantity, handling nulls
                        quantity: quantity !== null
                            ? (existingManualItem.quantity ?? 0) + quantity
                            : existingManualItem.quantity, // Keep existing if new quantity is null
                        // Optionally update marketplace status if needed, default keeps existing
                        marketplace: marketplace,
                        isChecked: false, // Ensure it's not checked when added/updated
                    }
                });
            } else {
                // Create new manual item
                await prisma.shoppingItem.create({
                    data: {
                        shoppingListId: listId,
                        ingredientId: ingredient.id,
                        quantity: quantity,
                        unit: unit || null,
                        marketplace: marketplace,
                        recipeId: null, // Explicitly manual
                        isChecked: false,
                    }
                });
            }
            return json({ success: true });
        } catch (error) {
            console.error("Erreur addItem:", error);
            return json({ success: false, message: "Erreur serveur." }, { status: 500 });
        }
    };

    /** Action: Clear checked items */
    const clearCheckedItemsAction = async (): Promise<Response> => {
        const preserveRecipes = formData.get("preserveRecipes") === "true";
        const listId = listIdStr ? parseInt(listIdStr) : null;

        if (listId === null || isNaN(listId)) {
            return json({ success: false, message: "ID de liste invalide." }, { status: 400 });
        }
        if (!(await checkListOwnership(listId))) {
            return json({ success: false, message: "Action non autorisée." }, { status: 403 });
        }

        try {
            if (preserveRecipes) {
                // Delete checked manual items
                await prisma.shoppingItem.deleteMany({
                    where: { shoppingListId: listId, isChecked: true, recipeId: null }
                });
                // Uncheck checked items from recipes
                await prisma.shoppingItem.updateMany({
                    where: { shoppingListId: listId, isChecked: true, recipeId: { not: null } },
                    data: { isChecked: false }
                });
            } else {
                // Delete all checked items
                await prisma.shoppingItem.deleteMany({
                    where: { shoppingListId: listId, isChecked: true }
                });
            }
            return json({ success: true });
        } catch (error) {
            console.error("Erreur clearChecked:", error);
            return json({ success: false, message: "Erreur serveur." }, { status: 500 });
        }
    };

    /** Action: Toggle item marketplace status */
    const toggleItemMarketplaceAction = async (): Promise<Response> => {
        const itemId = formData.get("itemId");
        const currentMarketplace = formData.get("marketplace") === "true"; // Current state
        const affectAllRelated = formData.get("affectAllRelated") === "true";
        const listId = listIdStr ? parseInt(listIdStr) : null;


        if (!itemId || typeof itemId !== 'string' || listId === null) {
            return json({ success: false, message: "Données invalides." }, { status: 400 });
        }
        const itemIdNum = parseInt(itemId);
        if (isNaN(itemIdNum)) {
            return json({ success: false, message: "ID article invalide." }, { status: 400 });
        }

        const item = await prisma.shoppingItem.findUnique({ where: { id: itemIdNum }, select: { shoppingListId: true, ingredientId: true, unit: true } });
        if (!item || !(await checkListOwnership(item.shoppingListId))) {
            return json({ success: false, message: "Action non autorisée ou article non trouvé." }, { status: 403 });
        }

        try {
            if (affectAllRelated) {
                await prisma.shoppingItem.updateMany({
                    where: {
                        shoppingListId: item.shoppingListId,
                        ingredientId: item.ingredientId,
                        unit: item.unit,
                    },
                    data: { marketplace: !currentMarketplace }, // Toggle the status
                });
            } else {
                await prisma.shoppingItem.update({
                    where: { id: itemIdNum },
                    data: { marketplace: !currentMarketplace }, // Toggle the status
                });
            }
            return json({ success: true });
        } catch (error) {
            console.error("Erreur toggleMarketplace:", error);
            return json({ success: false, message: "Erreur serveur." }, { status: 500 });
        }
    };

    // --- Route Action Based on _action ---
    try {
        switch (actionType) {
            case "toggleItem": return await toggleShoppingItemAction();
            case "removeItem": return await removeShoppingItemAction();
            case "addItem": return await addShoppingItemAction();
            case "clearChecked": return await clearCheckedItemsAction();
            case "toggleMarketplace": return await toggleItemMarketplaceAction();
            default:
                return json({ success: false, message: "Action non reconnue." }, { status: 400 });
        }
    } catch (error) {
        // Catch unexpected errors during action execution
        console.error(`Erreur action ${actionType}:`, error);
        return json({ success: false, message: "Une erreur interne est survenue." }, { status: 500 });
    }
}


// --- Default Component ---
export default function ShoppingListPage() {
    // Use the specific loader data type
    const {
        shoppingList,
        items,
        categorizedItems,
        groupByRecipe,
        error
    } = useLoaderData<typeof loader>() as ShoppingListLoaderData; // Correct typing

    // State for modals
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
    const [preserveRecipesOnClear, setPreserveRecipesOnClear] = useState(true); // Default behavior

    // State for Add Item form
    const [newItemName, setNewItemName] = useState("");
    const [newItemQuantity, setNewItemQuantity] = useState("");
    const [newItemUnit, setNewItemUnit] = useState("");

    // State for Share form
    const [shareEmail, setShareEmail] = useState("");

    // State for Autocomplete
    const [suggestions, setSuggestions] = useState<IngredientSuggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestionsRef = useRef<HTMLDivElement>(null); // For click outside detection

    // Fetchers for actions (useFetcher is fine for non-navigational updates)
    const shareFetcher = useFetcher();
    const toggleItemFetcher = useFetcher();
    const removeItemFetcher = useFetcher();
    const toggleMarketplaceFetcher = useFetcher();
    const addItemFetcher = useFetcher();
    const clearCheckedFetcher = useFetcher();
    const ingredientsFetcher = useFetcher<{ ingredients: IngredientSuggestion[] }>(); // Type fetcher data

    const [searchParams, setSearchParams] = useSearchParams();

    // Derived state for progress bar and counts
    // Use categorizedItems directly as calculated in the loader
    const { checked, firstMarketplace, secondMarketplace } = categorizedItems;
    const checkedCount = checked.length;
    const marketplaceUncheckedCount = secondMarketplace.length; // marketplace = true
    const otherUncheckedCount = firstMarketplace.length;       // marketplace = false
    const totalUncheckedCount = marketplaceUncheckedCount + otherUncheckedCount;
    const totalCount = checkedCount + totalUncheckedCount;

    // Calculate counts *within* the checked category for the progress bar logic
    const checkedMarketplaceCount = checked.filter(item => item.marketplace).length;
    const checkedOtherCount = checked.filter(item => !item.marketplace).length;

    // Total counts per category (including checked) for progress % calculation
    const totalMarketplaceItems = marketplaceUncheckedCount + checkedMarketplaceCount;
    const totalOtherItems = otherUncheckedCount + checkedOtherCount;


    // --- Event Handlers ---

    const handleAddItemSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newItemName.trim() || !shoppingList) return;

        addItemFetcher.submit(
            {
                _action: "addItem",
                name: newItemName.trim(),
                quantity: newItemQuantity,
                unit: newItemUnit,
                listId: shoppingList.id.toString(),
                // Decide marketplace based on some UI element or default
                marketplace: "false", // Example: default to supermarket
            },
            { method: "post" } // replace: true helps avoid back button issues
        );
        // Reset form and close modal
        setNewItemName("");
        setNewItemQuantity("");
        setNewItemUnit("");
        setIsAddModalOpen(false);
        setShowSuggestions(false);
    };

    const handleIngredientSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNewItemName(value);
        if (value.length >= 2) {
            // Use fetcher.load for GET requests (no mutation)
            ingredientsFetcher.load(`/api/ingredients?search=${encodeURIComponent(value)}`);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSelectSuggestion = (suggestion: IngredientSuggestion) => {
        setNewItemName(suggestion.name);
        setSuggestions([]);
        setShowSuggestions(false);
        // Optionally focus the quantity input here
    };

    const handleToggleItem = (item: ShoppingItem, affectAll: boolean) => {
        toggleItemFetcher.submit(
            {
                _action: "toggleItem",
                itemId: item.id.toString(),
                isChecked: item.isChecked.toString(),
                affectAllRelated: affectAll.toString(),
                listId: shoppingList?.id.toString() ?? '',
            },
            { method: "post" }
        );
    };

    const handleRemoveItem = (item: ShoppingItem, removeAll: boolean) => {
        removeItemFetcher.submit(
            {
                _action: "removeItem",
                itemId: item.id.toString(),
                removeAllRelated: removeAll.toString(),
                listId: shoppingList?.id.toString() ?? '',
            },
            { method: "post" }
        );
    };

    const handleToggleMarketplace = (item: ShoppingItem, affectAll: boolean) => {
        toggleMarketplaceFetcher.submit(
            {
                _action: "toggleMarketplace",
                itemId: item.id.toString(),
                marketplace: item.marketplace.toString(),
                affectAllRelated: affectAll.toString(),
                listId: shoppingList?.id.toString() ?? '',
            },
            { method: "post" }
        );
    };

    const handleToggleView = () => {
        const newParams = new URLSearchParams(searchParams);
        if (groupByRecipe) {
            newParams.delete("groupBy");
        } else {
            newParams.set("groupBy", "recipe");
        }
        setSearchParams(newParams, { replace: true }); // Use replace for view toggles
    };

    const handleClearCheckedConfirm = () => {
        if (!shoppingList) return;
        clearCheckedFetcher.submit(
            {
                _action: "clearChecked",
                listId: shoppingList.id.toString(),
                preserveRecipes: preserveRecipesOnClear.toString(),
            },
            { method: "post" }
        );
        setIsClearDialogOpen(false);
    };


    // --- Effects ---

    // Update suggestions when fetcher data changes
    useEffect(() => {
        if (ingredientsFetcher.data?.ingredients) {
            setSuggestions(ingredientsFetcher.data.ingredients);
        } else if (ingredientsFetcher.state === 'idle' && !ingredientsFetcher.data) {
            // Clear suggestions if fetch completes with no data (e.g., input cleared)
            setSuggestions([]);
        }
    }, [ingredientsFetcher.data, ingredientsFetcher.state]);

    // Click outside handler for suggestions
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (suggestionsRef.current && event.target instanceof Node && !suggestionsRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Handle potential errors from loader
    if (error) {
        return (
            <Layout pageTitle="Erreur">
                <div className="max-w-md mx-auto mt-10 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    <h2 className="font-bold mb-2">Erreur de chargement</h2>
                    <p>{error}</p>
                    <Link to="/shopping-list" className="text-blue-600 hover:underline mt-4 block">
                        Retour à la liste principale
                    </Link>
                </div>
            </Layout>
        );
    }

    // Handle case where list might be null temporarily (though loader should create one)
    if (!shoppingList) {
        return (
            <Layout pageTitle="Chargement...">
                <div className="text-center p-8">Chargement de votre liste...</div>
            </Layout>
        );
    }


    // --- Render ---
    return (
        <Layout pageTitle="Liste de courses">
            {/* Use pb-[120px] or similar to prevent content overlap with fixed elements */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-[120px]">
                {/* Header Actions */}
                <div className="flex justify-between items-center mb-6 sticky top-0 z-20 bg-gray-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 shadow-sm">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        {/* Clear Checked Button */}
                        {checkedCount > 0 && (
                            <button
                                type="button"
                                onClick={() => setIsClearDialogOpen(true)}
                                className="p-2 rounded-full bg-white text-gray-500 hover:text-red-600 hover:bg-red-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                                title="Supprimer les articles cochés"
                                aria-label="Supprimer les articles cochés"
                            >
                                {/* Trash Icon */}
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                            </button>
                        )}
                        {/* Share Button */}
                        <button
                            type="button"
                            onClick={() => setIsShareModalOpen(true)}
                            className="p-2 rounded-full bg-white text-gray-500 hover:text-rose-600 hover:bg-rose-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                            title="Partager la liste"
                            aria-label="Partager la liste"
                        >
                            {/* Share Icon */}
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" /></svg>
                        </button>
                        {/* Toggle View Button */}
                        <button
                            type="button"
                            onClick={handleToggleView}
                            className="p-2 rounded-full bg-white text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            title={groupByRecipe ? "Voir par ingrédient" : "Voir par recette"}
                            aria-label={groupByRecipe ? "Voir par ingrédient" : "Voir par recette"}
                        >
                            {/* List/Recipe Icon */}
                            {groupByRecipe
                                ? <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                                : <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h.01a1 1 0 100-2H10zm3 0a1 1 0 000 2h.01a1 1 0 100-2H13zM7 12a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h.01a1 1 0 100-2H10zm3 0a1 1 0 000 2h.01a1 1 0 100-2H13z" clipRule="evenodd" /></svg>
                            }
                        </button>
                    </div>

                    {/* Add Item Button (moved to bottom fixed bar for mobile) */}
                    {/* Consider keeping it here for desktop */}
                    <button
                        type="button"
                        onClick={() => setIsAddModalOpen(true)}
                        className="
                            add-ingredient
                            inline-flex items-center justify-center             
                            bg-teal-600 hover:bg-teal-700
                            text-white font-medium
                            rounded-full shadow-md                            
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500
                            transition-all duration-150 ease-in-out
                            
                            sm:rounded-md  /* Forme sur sm et + */
                            sm:px-4 sm:py-2 /* Padding sur sm et + */

                            h-10 w-10     /* Taille fixe pour mobile (cercle) */
                            sm:h-auto sm:w-auto /* Taille auto sur sm et + */
                        "
                        aria-label="Ajouter un article" // Important pour l'accessibilité, surtout quand le texte est caché
                    >
                        {/* Plus Icon - Toujours visible */}
                        <svg
                            className="
                                w-6 h-6         /* Taille icône mobile */
                                sm:w-5 sm:h-5   /* Taille icône sm et + */
                                sm:mr-1 sm:-ml-1 /* Marge icône sur sm et + */
                            "
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>

                        {/* Texte "Ajouter" - Caché par défaut, visible sur sm et + */}
                        <span className="hidden sm:inline">
                            Ajouter
                        </span>
                    </button>
                </div>


                {/* Main Content Area */}
                <div className="mt-4">
                    {groupByRecipe ? (
                        <RecipeGroupedView
                            recipeGroups={items as RecipeGroup[]} // Cast based on groupByRecipe flag
                            onToggleItem={handleToggleItem}
                            onRemoveItem={handleRemoveItem}
                            onToggleMarketplace={handleToggleMarketplace}
                        />
                    ) : (
                        // Ingredient Grouped View (default)
                        <>
                            {totalUncheckedCount > 0 ? (
                                <div className="space-y-6">
                                    {/* Section for Market items */}
                                    {marketplaceUncheckedCount > 0 && (
                                        <div>
                                            <h2 className="text-sm font-medium text-green-800 mb-2 pl-1">
                                                Marché ({marketplaceUncheckedCount})
                                            </h2>
                                            <div className="bg-white rounded-md shadow-sm overflow-hidden">
                                                <ul className="divide-y divide-gray-200">
                                                    {secondMarketplace.map((item) => (
                                                        <ShoppingItemWithMarketplace
                                                            key={`${item.ingredientId}-${item.unit || 'none'}`}
                                                            item={item}
                                                            onToggle={(affectAll) => handleToggleItem(item, affectAll)}
                                                            onRemove={(removeAll) => handleRemoveItem(item, removeAll)}
                                                            onToggleMarketplace={(affectAll) => handleToggleMarketplace(item, affectAll)}
                                                        />
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    )}

                                    {/* Section for "Other" / Supermarket items */}
                                    {otherUncheckedCount > 0 && (
                                        <div>
                                            <h2 className="text-sm font-medium text-indigo-800 mb-2 pl-1">
                                                Supermarché ({otherUncheckedCount})

                                                <Link
                                                    to={`/sync-chronodrive`}
                                                    className="float-right px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700"
                                                >
                                                    Synchroniser avec Chronodrive
                                                </Link>

                                            </h2>

                                            <div className="bg-white rounded-md shadow-sm overflow-hidden">
                                                <ul className="divide-y divide-gray-200">
                                                    {firstMarketplace.map((item) => (
                                                        <ShoppingItemWithMarketplace
                                                            key={`${item.ingredientId}-${item.unit || 'none'}`} // More stable key
                                                            item={item}
                                                            onToggle={(affectAll) => handleToggleItem(item, affectAll)}
                                                            onRemove={(removeAll) => handleRemoveItem(item, removeAll)}
                                                            onToggleMarketplace={(affectAll) => handleToggleMarketplace(item, affectAll)}
                                                        />
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                // Placeholder when no unchecked items
                                totalCount === 0 && ( // Only show if list is truly empty
                                    <div className="text-center py-10 px-4">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                        </svg>
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">Liste de courses vide</h3>
                                        <p className="mt-1 text-sm text-gray-500">Ajoutez des articles manuellement ou depuis vos recettes.</p>
                                        <div className="mt-6">
                                            <button
                                                type="button"
                                                onClick={() => setIsAddModalOpen(true)}
                                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                                            >
                                                <svg className="w-5 h-5 mr-1 -ml-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                                                Ajouter un article
                                            </button>
                                        </div>
                                    </div>
                                )
                            )}

                            {/* Checked Items Section (only if not grouped by recipe) */}
                            {checkedCount > 0 && (
                                <div className="mt-8">
                                    <h2 className="text-base font-semibold text-gray-500 mb-3">
                                        Articles cochés ({checkedCount})
                                    </h2>
                                    <div className="bg-white rounded-md shadow-sm overflow-hidden opacity-80">
                                        <ul className="divide-y divide-gray-200">
                                            {checked.map((item) => (
                                                <ShoppingItemWithMarketplace
                                                    key={`${item.ingredientId}-${item.unit || 'none'}-checked`}
                                                    item={item}
                                                    onToggle={(affectAll) => handleToggleItem(item, affectAll)}
                                                    onRemove={(removeAll) => handleRemoveItem(item, removeAll)}
                                                    onToggleMarketplace={(affectAll) => handleToggleMarketplace(item, affectAll)}
                                                />
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Fixed Bottom Bar with Progress and Add Button */}
                <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-200 bg-white">
                    {/* Progress Bar */}
                    {(totalMarketplaceItems > 0 || totalOtherItems > 0) && (
                        <ProgressBar
                            marketplaceCount={totalMarketplaceItems} // Total count for market
                            otherCount={totalOtherItems}             // Total count for other
                            checkedMarketplaceCount={checkedMarketplaceCount}
                            checkedOtherCount={checkedOtherCount}
                        />
                    )}
                </div>


                {/* Modals */}
                <AddItemModal
                    isVisible={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onSubmit={handleAddItemSubmit}
                    newItemName={newItemName}
                    setNewItemName={setNewItemName} // Pass setter directly if needed
                    newItemQuantity={newItemQuantity}
                    setNewItemQuantity={setNewItemQuantity}
                    newItemUnit={newItemUnit}
                    setNewItemUnit={setNewItemUnit}
                    suggestions={suggestions}
                    showSuggestions={showSuggestions}
                    setShowSuggestions={setShowSuggestions}
                    suggestionsRef={suggestionsRef}
                    handleIngredientInput={handleIngredientSearch} // Use specific handler
                    selectSuggestion={handleSelectSuggestion} // Use specific handler
                />

                <ShareModal
                    isVisible={isShareModalOpen}
                    onClose={() => setIsShareModalOpen(false)}
                    shoppingListId={shoppingList.id}
                    email={shareEmail}
                    setEmail={setShareEmail}
                    shareFetcher={shareFetcher} // Pass the fetcher
                />

                <ClearCheckedDialog
                    isVisible={isClearDialogOpen}
                    onClose={() => setIsClearDialogOpen(false)}
                    onConfirm={handleClearCheckedConfirm}
                    preserveRecipes={preserveRecipesOnClear}
                    setPreserveRecipes={setPreserveRecipesOnClear}
                />

            </div>
        </Layout>
    );
}