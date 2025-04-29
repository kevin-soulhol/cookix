// app/utils/shopping-list.utils.ts

import type { ShoppingItem, RecipeGroup, CategorizedItems, MinimalSeasonInfo } from "~/types/shopping-list.types";

/**
 * Groups shopping items by ingredient and unit.
 * Aggregates quantities and recipe references.
 * @param items - Array of raw ShoppingItem objects from the database.
 * @returns Array of ShoppingItem objects grouped by ingredient and unit.
 */
export function groupShoppingItemsByIngredient(items: ShoppingItem[]): ShoppingItem[] {
    const groupedMap = new Map<string, ShoppingItem>();

    items.forEach(item => {
        // Use a consistent key, treating null/empty unit the same as 'none' for grouping
        const unitKey = item.unit?.trim() || 'none';
        const key = `${item.ingredientId}-${unitKey}`;

        const existingGroup = groupedMap.get(key);

        if (!existingGroup) {
            // First item for this ingredient + unit combination
            groupedMap.set(key, {
                ...item,
                // Initialize recipeDetails if the current item has a recipe
                recipeDetails: item.recipe ? [{ id: item.recipe.id, title: item.recipe.title }] : [],
                // Ensure quantity is a number, defaulting to 0 if null
                quantity: item.quantity ?? 0,
                // Store the original item for reference (e.g., if needing individual IDs later)
                originalItems: [item],
                // Initial state based on the first item
                isChecked: item.isChecked,
                marketplace: item.marketplace,
            });
        } else {
            // Add to an existing group
            // Aggregate quantity (handle nulls safely)
            existingGroup.quantity = (existingGroup.quantity ?? 0) + (item.quantity ?? 0);

            // Add recipe details if the recipe exists and isn't already listed
            if (
                item.recipe &&
                !existingGroup.recipeDetails?.some(r => r.id === item.recipe!.id)
            ) {
                // Ensure recipeDetails array exists before pushing
                existingGroup.recipeDetails = existingGroup.recipeDetails || [];
                existingGroup.recipeDetails.push({
                    id: item.recipe.id,
                    title: item.recipe.title,
                });
            }

            // Add the current item to the list of original items in the group
            existingGroup.originalItems = existingGroup.originalItems || [];
            existingGroup.originalItems.push(item);

            // If *any* item in the group is unchecked, the group is considered unchecked
            if (!item.isChecked) {
                existingGroup.isChecked = false;
            }

            // Determine marketplace status: If *any* item is market (true), the group is market.
            // Adjust this logic if a different rule is needed (e.g., majority wins).
            if (item.marketplace) {
                existingGroup.marketplace = true;
            }
            // Note: If all items start as false, it remains false unless one becomes true.
            // If it starts true, it remains true.
        }
    });

    // Convert the Map values back to an array
    return Array.from(groupedMap.values());
}

/**
 * Groups shopping items by the recipe they originated from.
 * Items added manually are placed in a separate "Manual Additions" group.
 * @param items - Array of raw ShoppingItem objects from the database.
 * @returns Array of RecipeGroup objects.
 */
export function groupShoppingItemsByRecipe(items: ShoppingItem[]): RecipeGroup[] {
    const recipeGroups = new Map<string, RecipeGroup>();
    const manualItemsKey = "manual-additions"; // Use a descriptive key

    // Initialize the group for manually added items
    recipeGroups.set(manualItemsKey, {
        id: manualItemsKey,
        title: "Ajouts manuels",
        imageUrl: null,
        items: [],
    });

    items.forEach(item => {
        if (item.recipeId && item.recipe) {
            // Item belongs to a recipe
            const recipeIdStr = item.recipeId.toString();

            if (!recipeGroups.has(recipeIdStr)) {
                // Create a new group for this recipe if it doesn't exist
                recipeGroups.set(recipeIdStr, {
                    id: item.recipeId,
                    title: item.recipe.title || "Recette inconnue", // Fallback title
                    imageUrl: item.recipe.imageUrl || null,
                    items: [],
                });
            }
            // Add the item to its recipe group
            recipeGroups.get(recipeIdStr)!.items.push(item);

        } else {
            // Item was added manually (no recipeId or recipe object)
            recipeGroups.get(manualItemsKey)!.items.push(item);
        }
    });

    // Convert Map values to an array, filter out empty groups, and sort
    return Array.from(recipeGroups.values())
        .filter(group => group.items.length > 0) // Remove groups with no items (e.g., if manual group is empty)
        .sort((a, b) => {
            // Ensure "Manual Additions" group always appears last
            if (a.id === manualItemsKey) return 1;
            if (b.id === manualItemsKey) return -1;
            // Sort other groups alphabetically by title
            return a.title.localeCompare(b.title);
        });
}

/**
 * Categorizes grouped shopping items (ingredient view) into checked/unchecked lists.
 * @param groupedItems - Items already grouped by ingredient/unit.
 * @returns CategorizedItems object.
 */
export function categorizeShoppingItems(groupedItems: ShoppingItem[]): CategorizedItems {
    const categorized: CategorizedItems = {
        checked: [],
        firstMarketplace: [], // marketplace = false (e.g., Supermarket)
        secondMarketplace: [], // marketplace = true (e.g., Market)
    };

    groupedItems.forEach(item => {
        if (item.isChecked) {
            categorized.checked.push(item);
        } else if (item.marketplace) {
            // Unchecked, belongs to the secondary store (Market)
            categorized.secondMarketplace.push(item);
        } else {
            // Unchecked, belongs to the primary store (Supermarket)
            categorized.firstMarketplace.push(item);
        }
    });

    // Optional: Sort within categories if needed
    // categorized.checked.sort((a, b) => a.ingredient.name.localeCompare(b.ingredient.name));
    // categorized.firstMarketplace.sort((a, b) => a.ingredient.name.localeCompare(b.ingredient.name));
    // categorized.secondMarketplace.sort((a, b) => a.ingredient.name.localeCompare(b.ingredient.name));

    return categorized;
}

/**
 * Gets the current month name in lowercase English (for matching DB boolean flags).
 * @returns The lowercase English name of the current month (e.g., "january").
 */
export function getCurrentMonthKey(): string {
    return new Date().toLocaleString('en-US', { month: 'long' }).toLowerCase();
}

/**
 * Determines if an ingredient is in season based on its season info and the current month.
 * @param seasonInfo - The season information object for the ingredient.
 * @param currentMonthKey - The lowercase English name of the current month.
 * @returns True if the ingredient is considered in season, false otherwise.
 */
export function isIngredientInSeason(
    // Use the more specific type instead of any
    seasonInfo: MinimalSeasonInfo | null | undefined,
    currentMonthKey: string
): boolean {
    if (!seasonInfo) {
        // Default behavior if no season info exists
        return true; // Or false, depending on desired default (true seems reasonable)
    }
    // Use optional chaining and nullish coalescing for safety
    return !!(seasonInfo.isPerennial || seasonInfo[currentMonthKey]);
}