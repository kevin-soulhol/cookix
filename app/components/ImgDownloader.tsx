/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import { useFetcher } from "@remix-run/react";
import { useState, useRef, useEffect } from "react";
import imageCompression from "browser-image-compression";

// --- Icônes (à placer dans ce fichier ou dans un fichier d'icônes séparé) ---

function PhotoIcon(props: React.ComponentProps<"svg">) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
    );
}

function Spinner(props: { text: string }) {
    return (
        <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-t-transparent"></div>
            <p className="mt-4 text-sm font-semibold text-gray-600 dark:text-gray-300">{props.text}</p>
        </div>
    );
}

// --- Le Composant Principal ---

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function RecipeImageUploader() {
    const fetcher = useFetcher();
    const menuFetcher = useFetcher();
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [compressedFile, setCompressedFile] = useState<File | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isCompressing, setIsCompressing] = useState(false);
    const [recipesProcessed, setRecipesProcessed] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const isSubmitting = fetcher.state === 'submitting';

    // Gère la sélection et la compression de l'image
    const handleFileSelect = async (file: File | null) => {
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setErrorMessage("Le fichier sélectionné n'est pas une image.");
            return;
        }

        // Réinitialiser les états
        setErrorMessage(null);
        setCompressedFile(null);
        setIsCompressing(true);
        if (previewUrl) URL.revokeObjectURL(previewUrl);

        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
        };

        try {
            const compressed = await imageCompression(file, options);
            setCompressedFile(compressed);
            setPreviewUrl(URL.createObjectURL(compressed));
        } catch (error) {
            console.error("Erreur de compression :", error);
            setErrorMessage("Une erreur est survenue lors de la compression de l'image.");
        } finally {
            setIsCompressing(false);
        }
    };

    // Gère la soumission du formulaire vers l'action Remix
    const handleSubmit = () => {
        if (!compressedFile || isSubmitting) return;

        const formData = new FormData();
        formData.append("image", compressedFile, compressedFile.name);
        formData.append("_action", "uploadImage"); // Action spécifique

        fetcher.submit(formData, {
            method: "post",
            encType: "multipart/form-data",
            action: "/api/recipes", // Assurez-vous que cette route existe
        });
    };

    // Gère la réinitialisation pour changer l'image
    const handleReset = () => {
        setPreviewUrl(null);
        setCompressedFile(null);
        setErrorMessage(null);
        // Important pour permettre de re-sélectionner le même fichier
        if (inputRef.current) inputRef.current.value = "";
        // Déclenche l'ouverture de la fenêtre de fichier
        inputRef.current?.click();
    }

    // Nettoyage de l'URL de l'objet pour éviter les fuites de mémoire
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    useEffect(() => {
        // Si fetcher.data existe ET que les recettes n'ont pas encore été traitées
        if (fetcher.data?.success && !recipesProcessed) {

            // ✅ ÉTAPE 2: Poser le verrou immédiatement pour empêcher de re-rentrer ici
            setRecipesProcessed(true);

            const recipes = fetcher.data.recipes;
            console.log(`Début du traitement de ${recipes.length} recette(s).`);

            for (const recipe of recipes) {
                console.log('__soumission de :', recipe.title);
                menuFetcher.submit(
                    { recipeId: recipe.id.toString(), _action: "addRecipe" },
                    { method: "post", action: "/api/menu" }
                );
            }
        }

        // Si le fetcher d'image est réinitialisé (par exemple, pour un nouvel upload),
        // on doit réinitialiser notre verrou.
        if (fetcher.state === 'idle' && !fetcher.data) {
            if (recipesProcessed) {
                setRecipesProcessed(false);
            }
        }

    }, [fetcher.data, fetcher.state, menuFetcher, recipesProcessed]); // On ajoute recipesProcessed aux dépendances

    return (
        <div className="w-full max-w-md mx-auto p-4 font-sans">
            <div className="space-y-4">
                {/* --- Zone de Drag & Drop et d'aperçu --- */}
                <div
                    className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg transition-colors
            ${errorMessage ? 'border-red-400' : 'border-gray-300 dark:border-gray-500'}
            ${!previewUrl ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800' : ''}`}
                    onClick={() => !previewUrl && !isCompressing && inputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                        e.preventDefault();
                        if (!isCompressing && !isSubmitting) handleFileSelect(e.dataTransfer.files[0]);
                    }}
                >
                    {isCompressing ? (
                        <Spinner text="Compression..." />
                    ) : isSubmitting ? (
                        <Spinner text="Envoi en cours..." />
                    ) : previewUrl ? (
                        <>
                            <img src={previewUrl} alt="Aperçu de la recette" className="object-cover w-full h-full rounded-lg" />
                            <button
                                type="button"
                                onClick={handleReset}
                                className="absolute top-2 right-2 px-3 py-1 text-sm font-semibold text-gray-900 bg-white/70 rounded-md shadow-sm backdrop-blur-sm hover:bg-white dark:bg-gray-800/70 dark:text-white dark:hover:bg-gray-800"
                            >
                                Changer
                            </button>
                        </>
                    ) : (
                        <div className="text-center px-4">
                            <PhotoIcon className="w-12 h-12 mx-auto text-gray-400" />
                            <p className="mt-2 text-sm font-semibold text-gray-600 dark:text-gray-300">
                                Cliquez ou glissez-déposez une photo
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, WEBP (max 1Mo après compression)</p>
                        </div>
                    )}
                </div>

                {/* --- Input de fichier caché --- */}
                <input
                    ref={inputRef}
                    type="file"
                    name="image"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileSelect(e.target.files ? e.target.files[0] : null)}
                    disabled={isCompressing || isSubmitting}
                />

                {/* --- Messages d'erreur et de succès --- */}
                {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
                {fetcher.data?.error && <p className="text-sm text-red-600">{fetcher.data.error}</p>}
                {fetcher.data?.success ? (
                    <div className="p-3 text-sm text-green-800 bg-green-100 rounded-lg dark:bg-green-900 dark:text-green-200">
                        Image envoyée avec succès et ajouter à votre menu
                    </div>
                ) : (
                    /* --- Bouton de validation --- */
                    previewUrl && (
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={!compressedFile || isSubmitting}
                            className="w-full flex justify-center items-center px-4 py-2.5 text-base font-semibold text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            Valider et envoyer la photo
                        </button>
                    )
                )}
            </div>
        </div>
    );
}