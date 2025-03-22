import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData, useFetcher } from "@remix-run/react";
import { useState } from "react";
import Layout from "~/components/Layout";
import { requireUserId } from "./api.user";

export async function loader({ request }: LoaderFunctionArgs) {
    const userId = await requireUserId(request);

    // Appeler l'API pour obtenir les partages
    const apiUrl = new URL(`${request.url.split('/').slice(0, 3).join('/')}/api/share`);
    const cookies = request.headers.get("Cookie");
    const response = await fetch(apiUrl.toString(), {
        headers: {
            Cookie: cookies || "", // Transmettre les cookies
        },
    });

    const data = await response.json();
    return json(data);
}

export default function PartagesPage() {
    const { pendingInvitations, sharedWithMe, sharedByMe, success, message } = useLoaderData<typeof loader>();
    const deleteFetcher = useFetcher();
    const acceptFetcher = useFetcher();

    return (
        <Layout pageTitle="Partages">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-2xl font-bold mb-8">Mes partages</h1>

                {!success && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-red-700">
                        {message}
                    </div>
                )}

                {/* Invitations en attente */}
                <div className="mb-12">
                    <h2 className="text-xl font-semibold mb-4">Invitations en attente</h2>

                    {pendingInvitations?.length > 0 ? (
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <ul className="divide-y divide-gray-200">
                                {pendingInvitations.map((invitation) => (
                                    <li key={invitation.id} className="p-4 hover:bg-gray-50">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-medium text-gray-900">
                                                    Invitation de {invitation.sharedByUser.email}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {invitation.includeShoppingList
                                                        ? "Menu et liste de courses"
                                                        : "Menu uniquement"}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    Reçue le {new Date(invitation.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>

                                            <div className="flex space-x-2">
                                                <acceptFetcher.Form method="post" action="/api/share">
                                                    <input type="hidden" name="_action" value="acceptShare" />
                                                    <input type="hidden" name="token" value={invitation.token} />
                                                    <button
                                                        type="submit"
                                                        className="inline-flex items-center px-3 py-1.5 border border-green-500 text-xs font-medium rounded-md text-green-500 bg-white hover:bg-green-50"
                                                    >
                                                        Accepter
                                                    </button>
                                                </acceptFetcher.Form>

                                                <deleteFetcher.Form method="post" action="/api/share">
                                                    <input type="hidden" name="_action" value="deleteShare" />
                                                    <input type="hidden" name="shareId" value={invitation.id} />
                                                    <button
                                                        type="submit"
                                                        className="inline-flex items-center px-3 py-1.5 border border-red-300 text-xs font-medium rounded-md text-red-500 bg-white hover:bg-red-50"
                                                    >
                                                        Refuser
                                                    </button>
                                                </deleteFetcher.Form>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p className="text-gray-500 bg-white p-6 rounded-lg shadow-md text-center">
                            Vous n'avez aucune invitation en attente.
                        </p>
                    )}
                </div>

                {/* Partagés avec moi */}
                <div className="mb-12">
                    <h2 className="text-xl font-semibold mb-4">Partagés avec moi</h2>

                    {sharedWithMe?.length > 0 ? (
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <ul className="divide-y divide-gray-200">
                                {sharedWithMe.map((share) => (
                                    <li key={share.id} className="p-4 hover:bg-gray-50">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-medium text-gray-900">{share.menu.name}</h3>
                                                <p className="text-sm text-gray-500">
                                                    Partagé par: {share.sharedByUser.email}
                                                </p>
                                                {share.includeShoppingList && (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800 mt-2">
                                                        Inclut la liste de courses
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex space-x-2">
                                                <Link
                                                    to={`/menu?id=${share.menu.id}`}
                                                    className="inline-flex items-center px-3 py-1.5 border border-rose-500 text-xs font-medium rounded-md text-rose-500 bg-white hover:bg-rose-50"
                                                >
                                                    Voir le menu
                                                </Link>

                                                {share.includeShoppingList && share.shoppingList && (
                                                    <Link
                                                        to={`/courses?listId=${share.shoppingList.id}`}
                                                        className="inline-flex items-center px-3 py-1.5 border border-teal-500 text-xs font-medium rounded-md text-teal-500 bg-white hover:bg-teal-50"
                                                    >
                                                        Voir la liste
                                                    </Link>
                                                )}

                                                <deleteFetcher.Form method="post" action="/api/share">
                                                    <input type="hidden" name="_action" value="deleteShare" />
                                                    <input type="hidden" name="shareId" value={share.id} />
                                                    <button
                                                        type="submit"
                                                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                                        onClick={() => confirm("Êtes-vous sûr de vouloir supprimer ce partage ?")}
                                                    >
                                                        Supprimer
                                                    </button>
                                                </deleteFetcher.Form>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p className="text-gray-500 bg-white p-6 rounded-lg shadow-md text-center">
                            Aucun menu n'est partagé avec vous pour le moment.
                        </p>
                    )}
                </div>

                {/* Partagés par moi */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Partagés par moi</h2>

                    {sharedByMe?.length > 0 ? (
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <ul className="divide-y divide-gray-200">
                                {sharedByMe.map((share) => (
                                    <li key={share.id} className="p-4 hover:bg-gray-50">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    Partagé avec: {share.sharedWithEmail}
                                                </p>
                                                <div className="flex space-x-2 mt-1">
                                                    {share.includeShoppingList && (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                                                            Inclut la liste de courses
                                                        </span>
                                                    )}

                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${share.isAccepted
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {share.isAccepted ? 'Accepté' : 'En attente'}
                                                    </span>
                                                </div>
                                            </div>

                                            <deleteFetcher.Form method="post" action="/api/share">
                                                <input type="hidden" name="_action" value="deleteShare" />
                                                <input type="hidden" name="shareId" value={share.id} />
                                                <button
                                                    type="submit"
                                                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                                    onClick={() => confirm("Êtes-vous sûr de vouloir supprimer ce partage ?")}
                                                >
                                                    Supprimer
                                                </button>
                                            </deleteFetcher.Form>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p className="text-gray-500 bg-white p-6 rounded-lg shadow-md text-center">
                            Vous n'avez partagé aucun menu pour le moment.
                        </p>
                    )}
                </div>
            </div>
        </Layout>
    );
}