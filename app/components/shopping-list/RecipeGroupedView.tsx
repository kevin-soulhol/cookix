import { RecipeGroup, ShoppingItem } from "~/types/shopping-list.types";
import { ShoppingItemWithMarketplace } from "./ShoppingItemWithMarketplace";

/**
 * Composant pour afficher les articles groupés par recette
 */


interface RecipeGroupedViewProps {
    recipeGroups: RecipeGroup[];
    onToggleItem: (item: ShoppingItem, affectAll: boolean) => void;
    onRemoveItem: (item: ShoppingItem, removeAll: boolean) => void;
    onToggleMarketplace: (item: ShoppingItem, affectAll: boolean) => void;
}

export const RecipeGroupedView: React.FC<RecipeGroupedViewProps> = ({
    recipeGroups,
    onToggleItem,
    onRemoveItem,
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
                                onToggle={(affectAll) => onToggleItem(item, affectAll)}
                                onRemove={(removeAll) => onRemoveItem(item, removeAll)}
                                onToggleMarketplace={(affectAll) => onToggleMarketplace(item, affectAll)}
                                showRecipeDetails={false} // Pas besoin de montrer les détails de recette ici
                            />
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};