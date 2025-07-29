/* eslint-disable @typescript-eslint/no-explicit-any */
// app/utils/shopping-list.utils.ts

import type {
  ShoppingItem,
  RecipeGroup,
  CategorizedItems,
  MinimalSeasonInfo,
} from "~/types/shopping-list.types";

/**
 * Groups shopping items by ingredient. Aggregates quantities by unit and creates a formatted display string.
 * Example output for one ingredient: "2 unité.s + 400 grammes"
 * @param items - Array of raw ShoppingItem objects from the database.
 * @returns Array of ShoppingItem objects grouped by ingredient.
 */
export function groupShoppingItemsByIngredient(
  items: ShoppingItem[]
): ShoppingItem[] {
  // La clé de la map est maintenant l'ID de l'ingrédient, pour regrouper toutes ses variantes.
  const groupedMap = new Map<string, any>();

  items.forEach((item) => {
    if (!item.ingredientId) return; // Ignore items without an ingredient

    const key = String(item.ingredientId);
    const existingGroup = groupedMap.get(key);
    const unitKey = item.unit?.trim().toLowerCase() || "none";

    if (!existingGroup) {
      // Premier article pour cet ingrédient
      const quantitiesByUnit = new Map<string, number>();
      if (item.quantity != null) {
        quantitiesByUnit.set(unitKey, item.quantity);
      }

      groupedMap.set(key, {
        ...item, // Start with the first item's properties
        // This will be our new structure for quantities
        quantitiesByUnit,
        recipeDetails: item.recipe
          ? [{ id: item.recipe.id, title: item.recipe.title }]
          : [],
        originalItems: [item],
        // Base state on the first item
        isChecked: item.isChecked,
        marketplace: item.marketplace,
      });
    } else {
      // Ajouter à un groupe existant

      // 1. Agréger les quantités par unité
      if (item.quantity != null) {
        const currentQuantity =
          existingGroup.quantitiesByUnit.get(unitKey) ?? 0;
        existingGroup.quantitiesByUnit.set(
          unitKey,
          currentQuantity + item.quantity
        );
      }

      // 2. Ajouter les détails de la recette (sans doublons)
      if (
        item.recipe &&
        !existingGroup.recipeDetails.some((r: any) => r.id === item.recipe?.id)
      ) {
        existingGroup.recipeDetails.push({
          id: item.recipe.id,
          title: item.recipe.title,
        });
        // Bonus : trier les recettes par ordre alphabétique pour la cohérence
        existingGroup.recipeDetails.sort((a: any, b: any) =>
          a.title.localeCompare(b.title)
        );
      }

      // 3. Conserver la trace de tous les articles originaux
      existingGroup.originalItems.push(item);

      // 4. Logique de statut (coché et marché)
      if (!item.isChecked) {
        existingGroup.isChecked = false;
      }
      if (item.marketplace) {
        existingGroup.marketplace = true;
      }
    }
  });

  // Étape finale : formater les données pour l'affichage
  return Array.from(groupedMap.values()).map((group) => {
    // Créer la chaîne de caractères formatée pour les unités
    const unitParts: string[] = [];
    // On boucle directement sur les entrées du Map
    for (const [unit, quantity] of group.quantitiesByUnit.entries()) {
      if (quantity > 0) {
        // Ne pas afficher les quantités nulles ou négatives
        const part = unit === "none" ? `${quantity}` : `${quantity} ${unit}`;
        unitParts.push(part);
      }
    }
    const formattedUnits = unitParts.join(" + ");

    return {
      ...group,
      // Remplacer la quantité et l'unité par notre nouvelle chaîne formatée
      // Le composant d'affichage devra être adapté pour afficher `item.unit` et ignorer `item.quantity`
      quantity: null, // Mettre à null pour éviter toute confusion
      unit: formattedUnits, // Notre belle chaîne : "2 unité.s + 400 grammes"
    };
  });
}

/**
 * Groups shopping items by the recipe they originated from.
 * Items added manually are placed in a separate "Manual Additions" group.
 * @param items - Array of raw ShoppingItem objects from the database.
 * @returns Array of RecipeGroup objects.
 */
export function groupShoppingItemsByRecipe(
  items: ShoppingItem[]
): RecipeGroup[] {
  const recipeGroups = new Map<string, RecipeGroup>();
  const manualItemsKey = "manual-additions"; // Use a descriptive key

  // Initialize the group for manually added items
  recipeGroups.set(manualItemsKey, {
    id: manualItemsKey,
    title: "Ajouts manuels",
    imageUrl: null,
    items: [],
  });

  items.forEach((item) => {
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
    .filter((group) => group.items.length > 0) // Remove groups with no items (e.g., if manual group is empty)
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
export function categorizeShoppingItems(
  groupedItems: ShoppingItem[]
): CategorizedItems {
  const categorized: CategorizedItems = {
    checked: [],
    firstMarketplace: [], // marketplace = false (e.g., Supermarket)
    secondMarketplace: [], // marketplace = true (e.g., Market)
  };

  groupedItems.forEach((item) => {
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
  return new Date().toLocaleString("en-US", { month: "long" }).toLowerCase();
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
