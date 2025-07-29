// app/types/shopping-list.types.ts

/**
 * Basic Ingredient information.
 */
export interface Ingredient {
  id: number;
  name: string;
  seasonInfo?: IngredientSeasonInfo; // Optional as it's included conditionally
}

/**
 * Seasonality information for an ingredient.
 */
export interface IngredientSeasonInfo {
  isInSeason: boolean;
  isPermanent: boolean; // Renamed from isPerennial for clarity
  isFruit: boolean;
  isVegetable: boolean;
  isBabyFood: boolean;
  isPerennial?: boolean; // Keep original if needed elsewhere
  // Include month properties if they exist in your schema
  january?: boolean;
  february?: boolean;
  march?: boolean;
  april?: boolean;
  may?: boolean;
  june?: boolean;
  july?: boolean;
  august?: boolean;
  september?: boolean;
  october?: boolean;
  november?: boolean;
  december?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // Allow flexible month properties
}

/**
 * Basic Recipe information.
 */
export interface Recipe {
  id: number;
  title: string;
  imageUrl: string | null;
}

/**
 * Represents an item in the shopping list.
 */
export interface ShoppingItem {
  id: number;
  shoppingListId: number;
  ingredientId: number;
  recipeId: number | null;
  quantity: number | null;
  unit: string | null;
  isChecked: boolean;
  marketplace: boolean; // true = market, false = supermarket/other
  ingredient: Ingredient & {
    // Embed full ingredient with season info
    seasonInfo: IngredientSeasonInfo;
  };
  recipe?: Recipe;
  // Fields added after grouping by ingredient
  recipeDetails?: Array<{ id: number; title: string }>; // List of recipes using this grouped item
  originalItems?: ShoppingItem[]; // References to the original items before grouping
}

/**
 * Represents the main shopping list entity.
 */
export interface ShoppingList {
  id: number;
  userId: number;
  createdAt: Date; // Consider using string if serialization is an issue, but Date is more precise
}

/**
 * Represents a group of shopping items associated with a single recipe or manual additions.
 */
export interface RecipeGroup {
  id: number | string; // number for recipe ID, string for manual key
  title: string;
  imageUrl: string | null;
  items: ShoppingItem[]; // Ungrouped items belonging to this recipe/group
}

/**
 * Structure for items categorized by status and marketplace when NOT grouped by recipe.
 */
export interface CategorizedItems {
  checked: ShoppingItem[]; // All checked items (grouped by ingredient)
  firstMarketplace: ShoppingItem[]; // Unchecked items for the primary store (e.g., supermarket, marketplace=false)
  secondMarketplace: ShoppingItem[]; // Unchecked items for the secondary store (e.g., market, marketplace=true)
}

/**
 * Data structure returned by the Remix loader function.
 */
export interface ShoppingListLoaderData {
  shoppingList: ShoppingList | null; // Can be null if creation fails or none exists initially (though loader creates one)
  items: RecipeGroup[] | ShoppingItem[]; // Type depends on groupByRecipe flag
  originalItems: ShoppingItem[]; // Ungrouped items fetched from DB
  categorizedItems: CategorizedItems;
  groupByRecipe: boolean;
  error: string | null; // Error message if loading fails
}

/**
 * Basic structure for ingredient suggestions.
 */
export interface IngredientSuggestion {
  id: number | null; // Can be null for a new ingredient
  name: string;
}

/**
 * Basic structure for season info in ingredient.
 */
export interface MinimalSeasonInfo {
  isPerennial?: boolean | null;
  // Allow any string key (for month names) to have boolean, null, or undefined values
  [key: string]: boolean | null | undefined | number | string;
}
