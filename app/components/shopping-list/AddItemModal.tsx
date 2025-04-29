/* eslint-disable jsx-a11y/no-static-element-interactions */
import { IngredientSuggestion } from "~/types/shopping-list.types";
import AutocompleteUnits from "../AutocompleteUnits";
import { MobileAutoComplete } from "./MobileAutoComplete";


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
    suggestions: IngredientSuggestion[];
    showSuggestions: boolean;
    setShowSuggestions: React.Dispatch<React.SetStateAction<boolean>>;
    suggestionsRef: React.RefObject<HTMLDivElement>;
    handleIngredientInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
    selectSuggestion: (suggestion: IngredientSuggestion) => void;
}

/**
 * Modal pour ajouter un nouvel élément
 */
export const AddItemModal: React.FC<AddItemModalProps> = ({
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
            role="button"
            tabIndex={0}
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
            onKeyDown={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div
                className="bg-white rounded-t-xl shadow-2xl max-w-md mx-auto w-full transform transition-transform duration-300 ease-in-out"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
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
                                    {"Nom de l'article *"}
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