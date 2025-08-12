/* eslint-disable @typescript-eslint/no-explicit-any */
import { json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useLoaderData, Link, useFetcher, Form } from "@remix-run/react";
import { ChronodriveAuthService } from "~/services/ChronodriveAuth.server";
import type { AddToCartPayload, CartItemPayload, ProductSearchResult } from "~/types/chronodrive.types";
// @ts-expect-error schema prisma dont generate correctly
import type { ShoppingItem, SyncedProduct } from "@prisma/client";
import Layout from "~/components/Layout";
import { prisma } from "~/utils/db.server";
import { commitSession, getSession } from "~/utils/session.server";
import { useEffect } from "react";
import { getUserId } from "~/utils/auth.server";

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
    // @ts-expect-error schema prisma dont generate correctly
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

    const session = await getSession(request.headers.get("Cookie"));

    try {


        const shoppingList = await prisma.shoppingList.findFirst({ where: { userId } });

        if (!shoppingList) {
            return json<SyncLoaderData>({ items: [], error: "Aucune liste de course pour ce compte." }, { status: 403 });
        }

        // @ts-expect-error schema prisma dont generate correctly
        const itemsFromDb: ShoppingItemWithSync[] = await prisma.shoppingItem.findMany({
            where: {
                shoppingListId: shoppingList.id,
                shoppingList: { userId }, // Sécurité: on vérifie que la liste appartient à l'utilisateur
                marketplace: false,
                isChecked: false
            },
            include: {
                ingredient: { select: { name: true } },
                // @ts-expect-error schema prisma dont generate correctly
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
type LoaderData = { items: ShoppingItemWithSync[], error?: string };

export default function SyncChronodrivePage() {
    const { items, error } = useLoaderData<LoaderData>();
    const globalAddToCartFetcher = useFetcher();

    const handleGlobalAddToCart = () => {
        const itemsToAddToCart = items
            .filter((result: any) => result.syncedProduct.isFound)
            .map((result: any) => ({
                clientOrigin: `WEB|SEARCH|PRODUCT|"${result.ingredient?.name}"`,
                productId: '' + result.syncedProduct!.chronodriveProductId,
                quantity: 1,
            }));

        globalAddToCartFetcher.submit(
            { itemsToAddToCart: JSON.stringify(itemsToAddToCart), _action: "addToCart" },
            { method: "post" }
        );
    };

    const foundItems = items.filter((r: any) => r.syncedProduct.isFound);

    useEffect(() => {
        // Gère la redirection après l'ajout au panier (global ou individuel)
        const fetcher = globalAddToCartFetcher.data ? globalAddToCartFetcher : null;
        // @ts-expect-error schema prisma dont generate correctly
        if (fetcher && fetcher.state === 'idle' && fetcher.data?.redirectUrl) {
            // @ts-expect-error schema prisma dont generate correctly
            window.location.href = fetcher.data.redirectUrl;
        }
    }, [globalAddToCartFetcher]);

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
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <strong className="font-bold">Une erreur est survenue: </strong>
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                {/* Actions globales */}
                <div className="p-4 mb-6 bg-gray-50 rounded-lg shadow">
                    <Form onSubmit={(e) => { e.preventDefault(); handleGlobalAddToCart(); }} className="flex justify-center">
                        <button
                            type="submit"
                            disabled={globalAddToCartFetcher.state !== 'idle' || foundItems.length === 0}
                            className="px-6 py-3 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 shadow-lg disabled:bg-gray-400 transition-colors text-center"
                        >
                            {globalAddToCartFetcher.state !== 'idle' ? 'Ajout en cours...' : `Ajouter les ${foundItems.length} articles trouvés`}
                        </button>
                    </Form>
                </div>

                {/* @ts-expect-error noteScore dont exist cause based on recipe type */}
                {globalAddToCartFetcher.data?.error && <p className="text-red-500 text-center mb-4">{globalAddToCartFetcher.data.error}</p>}

                {/* Section des articles - NOUVEAU LAYOUT LISTE */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Correspondances des articles
                    </h2>
                    <div className="bg-white rounded-lg shadow-md divide-y divide-gray-200">
                        {items.map((item: any) => (
                            <SyncedItemRow key={item.id} item={item} />
                        ))}
                    </div>
                </div>

                {/* Bouton pour voir son panier */}
                <div className="mt-12 text-center">
                    <a
                        href="https://www.chronodrive.com/cartdetail"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-6 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-100 shadow"
                    >
                        Voir le panier Chronodrive
                    </a>
                </div>
            </div>
        </Layout>
    );
}

/**
 * NOUVEAU COMPOSANT : Affiche un article sur une seule ligne.
 */
function SyncedItemRow({ item }: { item: ShoppingItemWithSync }) {
    const syncFetcher = useFetcher();
    const addToCartFetcher = useFetcher();

    const isSyncing = syncFetcher.state !== 'idle';
    const isAddingToCart = addToCartFetcher.state !== 'idle';

    const syncedProduct = item.syncedProduct;

    const handleSingleAddToCart = (e: React.FormEvent) => {
        e.preventDefault();
        const itemToAddToCart = {
            clientOrigin: `WEB|SEARCH|PRODUCT|"${item.ingredient?.name}"`,
            productId: '' + syncedProduct!.chronodriveProductId,
            quantity: 1,
        };

        addToCartFetcher.submit(
            { itemsToAddToCart: JSON.stringify([itemToAddToCart]), _action: "addToCart" },
            { method: "post" }
        );
    };

    return (
        <div className={`p-3 flex items-center gap-3 transition-opacity ${isSyncing || isAddingToCart ? 'opacity-50 bg-gray-50' : ''}`}>
            {/* Image du produit */}
            {syncedProduct && syncedProduct.isFound ? (
                <img
                    src={'https://static1.chronodrive.com/' + (syncedProduct.imageUrl ?? '')}
                    alt={syncedProduct.productName ?? ''}
                    className="w-12 h-12 object-contain rounded flex-shrink-0"
                />
            ) : (
                <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1.586-1.586a2 2 0 010-2.828L14 8" /></svg>
                </div>
            )}

            {/* Informations (Titre / Sous-titre) */}
            {/* CHANGEMENT : Ajout de min-w-0 pour permettre au texte de passer à la ligne sur mobile sans déborder */}
            <div className="flex-grow min-w-0">
                <p className="font-bold text-sm text-gray-800 truncate">{item.ingredient.name}</p>
                {syncedProduct && syncedProduct.isFound ? (
                    <p className="text-sm text-blue-800 truncate">{syncedProduct.productName}</p>
                ) : (
                    <p className="text-sm text-gray-500 italic">Aucune correspondance</p>
                )}
            </div>

            {/* Actions (Prix, Ajouter, Rafraîchir) */}
            <div className="flex items-center gap-2 flex-shrink-0">
                {syncedProduct && syncedProduct.isFound ? (
                    // CHANGEMENT : Conteneur pour le prix et le bouton "Ajouter" qui devient une colonne sur mobile
                    <div className="flex flex-col items-end sm:flex-row sm:items-center sm:gap-3">
                        <span className="font-bold text-lg text-gray-900">
                            {(syncedProduct.price ?? 0).toFixed(2)}€
                        </span>

                        <addToCartFetcher.Form method="post" onSubmit={handleSingleAddToCart}>
                            <button
                                type="submit"
                                disabled={isAddingToCart}
                                className="px-3 py-1.5 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
                            >
                                {isAddingToCart ? '...' : 'Ajouter'}
                            </button>
                        </addToCartFetcher.Form>
                    </div>
                ) : (
                    // Espace vide pour l'alignement quand l'article n'est pas trouvé
                    <div className="w-24 hidden sm:block"></div>
                )}

                {/* Bouton Rafraîchir */}
                <syncFetcher.Form method="post">
                    <input type="hidden" name="_action" value="syncSingleItem" />
                    <input type="hidden" name="shoppingItemId" value={item.id} />
                    <input type="hidden" name="ingredientName" value={item.ingredient.name} />
                    <button type="submit" disabled={isSyncing} title="Rafraîchir la correspondance" className="p-1 text-gray-400 hover:text-blue-600 disabled:text-gray-300">
                        {isSyncing
                            ? <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            : <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" /></svg>
                        }
                    </button>
                </syncFetcher.Form>
            </div>
        </div>
    );
}