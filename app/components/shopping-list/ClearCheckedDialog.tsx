/* eslint-disable jsx-a11y/label-has-associated-control */

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
export const ClearCheckedDialog: React.FC<ClearCheckedDialogProps> = ({
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