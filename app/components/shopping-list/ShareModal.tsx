import { useFetcher } from "@remix-run/react";

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
export const ShareModal: React.FC<ShareModalProps> = ({
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