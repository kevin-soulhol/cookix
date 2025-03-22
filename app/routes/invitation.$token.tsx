import { json, redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { getUserId } from "./api.user";
import { prisma } from "~/utils/db.server";

export async function loader({ params, request }: LoaderFunctionArgs) {
    const { token } = params;
    const userId = await getUserId(request);

    if (!token) {
        return redirect("/");
    }

    try {
        // Vérifier si le jeton existe
        const invitation = await prisma.menuShare.findFirst({
            where: { token },
            include: {
                menu: true,
                sharedByUser: {
                    select: {
                        email: true
                    }
                }
            }
        });

        if (!invitation) {
            return json({
                success: false,
                message: "Cette invitation n'existe pas ou a expiré"
            });
        }

        if (invitation.isAccepted) {
            return json({
                success: false,
                message: "Cette invitation a déjà été acceptée"
            });
        }

        return json({
            success: true,
            invitation,
            isLoggedIn: !!userId
        });
    } catch (error) {
        console.error("Erreur lors de la vérification de l'invitation:", error);
        return json({
            success: false,
            message: "Une erreur est survenue lors de la vérification de l'invitation"
        });
    }
}

export default function InvitationPage() {
    const { success, invitation, message, isLoggedIn } = useLoaderData<typeof loader>();
    const [acceptingInvitation, setAcceptingInvitation] = useState(false);

    if (!success) {
        return (
            <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-6">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                    <div className="text-center">
                        <svg
                            className="mx-auto h-12 w-12 text-red-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                        <h2 className="mt-3 text-lg font-medium text-gray-900">Erreur</h2>
                        <p className="mt-2 text-gray-600">{message}</p>
                        <div className="mt-5">

                            <a href="/"
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                            >
                                Retour à l'accueil
                            </a>
                        </div>
                    </div>
                </div>
            </div >
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-6">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                <div className="text-center">
                    <svg
                        className="mx-auto h-12 w-12 text-rose-500"
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
                    <h2 className="mt-3 text-xl font-bold text-gray-900">Invitation Cookix</h2>

                    <p className="mt-2 text-gray-600">
                        {invitation.sharedByUser.email} a partagé {invitation.includeShoppingList ? 'un menu et une liste de courses' : 'un menu'} avec vous.
                    </p>

                    <div className="mt-5 text-left">
                        <h3 className="font-medium text-gray-700">Détails du menu:</h3>
                        <p className="mt-1 text-gray-600">
                            <span className="font-medium">Nom:</span> {invitation.menu.name}
                        </p>
                        <p className="text-gray-600">
                            <span className="font-medium">Période:</span> {new Date(invitation.menu.startDate).toLocaleDateString()} - {new Date(invitation.menu.endDate).toLocaleDateString()}
                        </p>

                        {invitation.includeShoppingList && (
                            <div className="mt-3 p-2 bg-teal-50 border border-teal-200 rounded-md">
                                <p className="text-teal-700 text-sm">
                                    <svg
                                        className="inline-block w-4 h-4 mr-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                        />
                                    </svg>
                                    La liste de courses associée sera également partagée avec vous.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="mt-6">
                        {isLoggedIn ? (
                            <Form method="post" action="/api/share">
                                <input type="hidden" name="_action" value="acceptShare" />
                                <input type="hidden" name="token" value={invitation.token} />

                                <button
                                    type="submit"
                                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                                    onClick={() => setAcceptingInvitation(true)}
                                    disabled={acceptingInvitation}
                                >
                                    {acceptingInvitation ? 'Acceptation en cours...' : 'Accepter l\'invitation'}
                                </button>
                            </Form>
                        ) : (
                            <div>
                                <p className="mb-3 text-sm text-gray-600">Vous devez vous connecter pour accepter cette invitation.</p>
                                <a href={`/login?redirectTo=/invitation/${invitation.token}`} className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500">
                                    Se connecter
                                </a>
                            </div>
                        )}


                        <a href="/" className="mt-3 w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500">
                            Retour à l'accueil
                        </a>
                    </div>
                </div>
            </div >
        </div >
    );
}