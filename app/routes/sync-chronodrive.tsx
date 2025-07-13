import { ShoppingItem } from "@prisma/client";
import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { ProductSearchResult } from '../types/chronodrive.types';
import Layout from "~/components/Layout";
import { useLoaderData, Link } from "@remix-run/react";
import { ChronodriveAuthService } from "~/services/ChronodriveAuth.server";
import { commitSession, getSession } from "./session.server";



export interface SyncResult {
    originalItem: ShoppingItem;
    found: boolean;
    bestMatch: ProductSearchResult | null;
    allMatches: ProductSearchResult[];
}

export interface SyncLoaderData {
    listId: number;
    syncResults: SyncResult[];
    error: string | null;
}

export const meta: MetaFunction = () => [{ title: "Synchronisation Chronodrive - Cookix" }];



export async function loader({ request }: LoaderFunctionArgs) {
    // 1. Obtenir la session au début
    const session = await getSession(request.headers.get("Cookie"));

    // 2. Instancier le service avec la session
    const chronoClient = new ChronodriveAuthService(session);

    try {
        // 3. Appeler la méthode métier (ex: searchProduct)
        // Le service gérera l'authentification en arrière-plan si nécessaire.
        const searchResults = await chronoClient.searchProduct("Tomates"); // Exemple de recherche



        return json({ error: null });

    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Erreur interne.";
        console.error("Erreur dans le loader de synchronisation:", errorMessage);

        // Commiter la session même en cas d'erreur
        const headers = new Headers();
        headers.set("Set-Cookie", await commitSession(session));

        return json({ syncResults: [], error: errorMessage }, { status: 500, headers });
    }
}

// --- ACTION : Gérera l'ajout au panier plus tard ---
// export async function action({ request }: ActionFunctionArgs) { /* ... */ }


// --- COMPONENT : Affiche les résultats ---
export default function SyncChronodrivePage() {
    const { listId, syncResults, error } = useLoaderData<typeof loader>();

    if (error) {
        return (
            <Layout pageTitle="Erreur de Synchronisation">
                <div className="max-w-2xl mx-auto mt-10 p-4 bg-red-100 text-red-700 rounded">
                    <h2 className="font-bold">Une erreur est survenue</h2>
                    <p>{error}</p>
                    <Link to={`/shopping-list?listId=${listId}`} className="text-blue-600 hover:underline mt-4 block">
                        Retour à la liste de courses
                    </Link>
                </div>
            </Layout>
        );
    }

    const foundItems = syncResults.filter(r => r.found);
    const notFoundItems = syncResults.filter(r => !r.found);

    return (
        <Layout pageTitle="Synchronisation Chronodrive">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Résultats de la synchronisation</h1>
                    <Link to={`/shopping-list?listId=${listId}`} className="text-sm text-blue-600 hover:underline">
                        ← Retour à la liste
                    </Link>
                </div>

                {/* Section des articles trouvés */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-green-700 mb-4">
                        Articles trouvés ({foundItems.length})
                    </h2>
                    <div className="space-y-3">
                        {foundItems.map(result => (
                            <div key={result.originalItem.id} className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
                                <div>
                                    <p className="font-medium">{result.originalItem.ingredient.name}</p>
                                    <p className="text-sm text-gray-600">
                                        Meilleur choix : <span className="font-semibold">{result.bestMatch?.name}</span>
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg">
                                        {(result.bestMatch?.price.amount ?? 0 / 100).toFixed(2)}€
                                    </p>
                                    <button className="text-xs text-blue-500 hover:underline">Changer</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section des articles non trouvés */}
                {notFoundItems.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-red-700 mb-4">
                            Articles non trouvés ({notFoundItems.length})
                        </h2>
                        <ul className="list-disc list-inside bg-white p-4 rounded-lg shadow-md">
                            {notFoundItems.map(result => (
                                <li key={result.originalItem.id} className="text-gray-700">
                                    {result.originalItem.ingredient.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Bouton d'action global */}
                <div className="mt-10 text-center">
                    <button className="px-8 py-3 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 shadow-lg">
                        Ajouter les articles trouvés au panier Chronodrive
                    </button>
                </div>
            </div>
        </Layout>
    );
}