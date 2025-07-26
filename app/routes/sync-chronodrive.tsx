import { json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useLoaderData, Link, useFetcher, Form } from "@remix-run/react";
import { ChronodriveAuthService } from "~/services/ChronodriveAuth.server";
import type { AddToCartPayload, CartItemPayload, ProductSearchResult } from "~/types/chronodrive.types";
import type { ShoppingItem, SyncedProduct } from "@prisma/client";
import { getUserId } from "./api.user";
import Layout from "~/components/Layout";
import { prisma } from "~/utils/db.server";
import { commitSession, getSession } from "~/session.server";
import { useEffect } from "react";

// --- Types pour cette page ---
export interface SyncResult {
    originalItem: ShoppingItem & { ingredient: { name: string } }; // Assurer que ingredient.name est inclus
    found: boolean;
    bestMatch: ProductSearchResult | null;
}

export type ShoppingItemWithSync = ShoppingItem & {
    ingredient: { name: string };
    syncedProduct: SyncedProduct | null;
};

export interface SyncLoaderData {
    items: ShoppingItemWithSync[];
    error: string | null;
}
// --- Meta ---

export const meta: MetaFunction = () => [{ title: "Synchronisation Chronodrive - Cookix" }];


/**
 * Fonction helper pour synchroniser un seul article et mettre à jour la BDD.
 * Peut être appelée par le loader (pour la première synchro) ou par l'action (pour le rafraîchissement).
 */
async function syncSingleItem(
    chronoClient: ChronodriveAuthService,
    shoppingItemId: number,
    ingredientName: string
) {
    const searchResponse = await chronoClient.searchProduct(ingredientName);
    const availableProducts = searchResponse.products.filter(p => p.stock !== 'OUT_OF_STOCK');

    let bestMatch: ProductSearchResult | null = null;
    if (availableProducts.length > 0) {
        //availableProducts.sort((a, b) => a.prices.defaultPrice - b.prices.defaultPrice);
        bestMatch = availableProducts[0];
    }

    // `upsert` est la clé : il met à jour une entrée existante ou en crée une nouvelle.
    // C'est parfait pour la synchronisation initiale et les rafraîchissements.
    await prisma.syncedProduct.upsert({
        where: { shoppingItemId },
        update: {
            isFound: !!bestMatch,
            chronodriveProductId: bestMatch?.id,
            productName: bestMatch?.labels.productLabel,
            imageUrl: bestMatch?.images.thumbnails?.find(Boolean),
            price: bestMatch?.prices.defaultPrice,
        },
        create: {
            shoppingItemId,
            isFound: !!bestMatch,
            chronodriveProductId: bestMatch?.id,
            productName: bestMatch?.labels.productLabel,
            imageUrl: bestMatch?.images.thumbnails?.find(Boolean),
            price: bestMatch?.prices.defaultPrice,
        },
    });
}


// --- Loader ---
export async function loader({ request }: LoaderFunctionArgs) {
    // 1. Authentification de l'utilisateur et récupération des paramètres
    const userId = await getUserId(request);
    if (!userId) return redirect("/login");

    const url = new URL(request.url);
    const session = await getSession(request.headers.get("Cookie"));

    try {


        const shoppingList = await prisma.shoppingList.findFirst({ where: { userId } });

        if (!shoppingList) {
            return json<SyncLoaderData>({ items: [], error: "Aucune liste de course pour ce compte." }, { status: 403 });
        }

        const itemsFromDb: ShoppingItemWithSync[] = await prisma.shoppingItem.findMany({
            where: {
                shoppingListId: shoppingList.id,
                shoppingList: { userId }, // Sécurité: on vérifie que la liste appartient à l'utilisateur
                marketplace: false,
                isChecked: false
            },
            include: {
                ingredient: { select: { name: true } },
                syncedProduct: true, // On inclut les données de synchronisation existantes
            },
        });

        // 3. Détection et synchronisation des nouveaux articles
        const itemsToSync = itemsFromDb.filter(item => !item.syncedProduct);

        if (itemsToSync.length > 0) {
            console.log(`SYNC LOADER: ${itemsToSync.length} nouvel(s) article(s) à synchroniser.`);

            const chronoClient = new ChronodriveAuthService(session);
            // On lance toutes les synchronisations en parallèle pour plus de performance
            await Promise.all(
                itemsToSync.map(item =>
                    syncSingleItem(chronoClient, item.id, item.ingredient.name)
                )
            );

            // 4. Redirection pour recharger les données avec un état propre
            // C'est une bonne pratique après une mutation de données dans un loader.
            console.log("SYNC LOADER: Synchronisation initiale terminée. Redirection...");
            const headers = new Headers();
            headers.set("Set-Cookie", await commitSession(session)); // Important pour sauvegarder le token si un nouveau a été généré
            return redirect(request.url, { headers });
        }

        // 5. Renvoyer les données si tout est déjà synchronisé
        console.log("SYNC LOADER: Tous les articles sont déjà synchronisés. Affichage des données.");
        return json<SyncLoaderData>({ items: itemsFromDb, error: null });

    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Erreur interne du serveur.";
        console.error("Erreur dans le loader de synchronisation:", error);

        const headers = new Headers();
        headers.set("Set-Cookie", await commitSession(session)); // On commite la session même en cas d'erreur

        return json<SyncLoaderData>({ items: [], error: errorMessage }, { status: 500, headers });
    }
}

// --- Action ---

export async function action({ request }: ActionFunctionArgs) {
    const session = await getSession(request.headers.get("Cookie"));
    const formData = await request.formData();
    const actionType = formData.get("_action") as string;

    switch (actionType) {
        case "syncSingleItem": {
            const shoppingItemId = parseInt(formData.get("shoppingItemId") as string, 10);
            const ingredientName = formData.get("ingredientName") as string;

            const chronoClient = new ChronodriveAuthService(session);
            await syncSingleItem(chronoClient, shoppingItemId, ingredientName);

            const headers = new Headers();
            headers.set("Set-Cookie", await commitSession(session));
            return json({ success: true }, { headers });
        }
        case "addToCart": {

            const session = await getSession(request.headers.get("Cookie"));
            const chronoClient = new ChronodriveAuthService(session);

            const itemsJson = formData.get("itemsToAddToCart") as string;

            if (!itemsJson) {
                return json({ success: false, error: "Aucun article à ajouter." }, { status: 400 });
            }

            const items: CartItemPayload[] = JSON.parse(itemsJson);

            const payload: AddToCartPayload = {
                content: items,
                optimizedMode: true,
            };

            await chronoClient.addToCart(payload);

            const headers = new Headers();
            headers.set("Set-Cookie", await commitSession(session));

            return json(
                { success: true, redirectUrl: "https://www.chronodrive.com/cartdetail" },
                { headers }
            );
        }

        default:
            return json({ success: false, error: "Action non reconnue." }, { status: 400 });
    }
}

// --- Component ---

export default function SyncChronodrivePage() {
    const { items, error } = useLoaderData<typeof loader>();
    const addToCartFetcher = useFetcher();

    const handleAddToCart = () => {
        const itemsToAddToCart = items
            .filter(result => result.syncedProduct.isFound)
            .map(result => ({
                clientOrigin: `WEB|SEARCH|PRODUCT|"${result.ingredient?.name}"`,
                productId: '' + result.syncedProduct!.chronodriveProductId,
                quantity: 1,
            }));

        addToCartFetcher.submit(
            { itemsToAddToCart: JSON.stringify(itemsToAddToCart), _action: "addToCart" },
            { method: "post" }
        );
    };

    const foundItems = items.filter(r => r.syncedProduct.isFound);

    useEffect(() => {
        if (addToCartFetcher.state === 'idle' && addToCartFetcher.data?.redirectUrl) {
            window.location.href = addToCartFetcher.data.redirectUrl;
        }
    }, [addToCartFetcher.state, addToCartFetcher.data]);

    return (
        <Layout pageTitle="Synchronisation Chronodrive">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Synchronisation avec Chronodrive</h1>
                    <Link to={`/courses`} className="text-sm text-blue-600 hover:underline">
                        ← Retour à la liste
                    </Link>
                </div>

                {error && (
                    <>
                        <h2 className="font-bold">Une erreur est survenue</h2>
                        <p>{error}</p>
                    </>
                )
                }

                {/* Actions globales */}
                <div className="flex justify-center items-center space-x-4 p-4 mb-6 bg-gray-50 rounded-lg shadow">
                    <Form onSubmit={(e) => { e.preventDefault(); handleAddToCart(); }}>
                        <button
                            type="submit"
                            disabled={addToCartFetcher.state !== 'idle' || foundItems.length === 0}
                            className="px-6 py-3 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 shadow-lg disabled:bg-gray-400"
                        >
                            {addToCartFetcher.state !== 'idle' ? 'Ajout en cours...' : `Ajouter ${foundItems.length} articles au panier`}
                        </button>
                    </Form>
                    <a href="https://www.chronodrive.com/cartdetail" rel="noopener noreferrer" className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-100 shadow">
                        Voir le panier Chronodrive
                    </a>
                </div>

                {addToCartFetcher.data?.error && <p className="text-red-500 text-center mb-4">{addToCartFetcher.data.error}</p>}

                {/* Section des articles trouvés */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Correspondances des articles
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {items.map(item => (
                            <SyncedItemCard key={item.id} item={item} />
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
}


/**
 * Un composant dédié pour chaque carte d'article, pour gérer son propre état de fetcher.
 */
function SyncedItemCard({ item }: { item: ShoppingItemWithSync }) {
    const syncFetcher = useFetcher();
    const isSyncing = syncFetcher.state !== 'idle';

    const syncedProduct = item.syncedProduct;

    return (
        <div className={`bg-white p-4 rounded-lg shadow-md flex flex-col justify-between transition-opacity ${isSyncing ? 'opacity-50' : ''}`}>
            {/* Partie haute : votre article */}
            <div>
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm text-gray-500">Votre article :</p>
                        <p className="font-bold text-lg">{item.ingredient.name}</p>
                        <p className="text-gray-600 text-sm">{item.quantity} {item.unit}</p>
                        <p className="text-gray-600 text-sm">{syncedProduct.description}</p>
                    </div>
                    <syncFetcher.Form method="post">
                        <input type="hidden" name="_action" value="syncSingleItem" />
                        <input type="hidden" name="shoppingItemId" value={item.id} />
                        <input type="hidden" name="ingredientName" value={item.ingredient.name} />
                        <button type="submit" disabled={isSyncing} title="Rafraîchir la correspondance" className="p-1 text-gray-400 hover:text-blue-600 disabled:text-gray-300">
                            {isSyncing
                                ? <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                : <svg className="h-5 w-5" fill="red" viewBox="0 0 512 512"><path fill="currentColor" d="M142.9 142.9c-17.5 17.5-30.1 38-37.8 59.8c-5.9 16.7-24.2 25.4-40.8 19.5s-25.4-24.2-19.5-40.8C55.6 150.7 73.2 122 97.6 97.6c87.2-87.2 228.3-87.5 315.8-1L455 55c6.9-6.9 17.2-8.9 26.2-5.2s14.8 12.5 14.8 22.2l0 128c0 13.3-10.7 24-24 24l-8.4 0c0 0 0 0 0 0L344 224c-9.7 0-18.5-5.8-22.2-14.8s-1.7-19.3 5.2-26.2l41.1-41.1c-62.6-61.5-163.1-61.2-225.3 1zM16 312c0-13.3 10.7-24 24-24l7.6 0 .7 0L168 288c9.7 0 18.5 5.8 22.2 14.8s1.7 19.3-5.2 26.2l-41.1 41.1c62.6 61.5 163.1 61.2 225.3-1c17.5-17.5 30.1-38 37.8-59.8c5.9-16.7 24.2-25.4 40.8-19.5s25.4 24.2 19.5 40.8c-10.8 30.6-28.4 59.3-52.9 83.8c-87.2 87.2-228.3 87.5-315.8 1L57 457c-6.9 6.9-17.2 8.9-26.2 5.2S16 449.7 16 440l0-119.6 0-.7 0-7.6z" /></svg>
                            }
                        </button>
                    </syncFetcher.Form>
                </div>
            </div>

            {/* Partie basse : le produit Chronodrive */}
            {syncedProduct && syncedProduct.isFound ? (
                <div>
                    <img src={'https://static1.chronodrive.com/' + (syncedProduct.imageUrl ?? '')} alt={syncedProduct.productName ?? ''} className="w-full h-32 object-contain mb-2 rounded" />
                    <p className="text-sm text-gray-600">Produit Chronodrive :</p>
                    <p className="font-semibold text-blue-800 text-sm">{syncedProduct.productName}</p>
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-lg font-bold text-gray-900">
                            {(syncedProduct.price ?? 0).toFixed(2)}€
                        </span>
                    </div>
                </div>
            ) : (
                <div className="text-center text-gray-500 p-4 border-2 border-dashed rounded-md">
                    <p>{syncedProduct ? 'Aucune correspondance trouvée' : 'Non synchronisé'}</p>
                    <p className="text-xs mt-1">{`Cliquez sur l'icône de rafraîchissement.`}</p>
                </div>
            )}
        </div>
    );
}