import { json, type ActionFunctionArgs, type LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { requireUserId, getUserId } from "~/routes/api.user";
import { useState, useRef } from "react";
import { prisma } from "~/utils/db.server";
import Layout from "~/components/Layout";

export async function loader({ request }: LoaderFunctionArgs) {
    // S'assurer que l'utilisateur est connecté
    const userId = await requireUserId(request);

    try {
        // Récupérer les informations de l'utilisateur
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                // Ne jamais inclure le mot de passe
            }
        });

        if (!user) {
            throw new Error("Utilisateur non trouvé");
        }

        // Compter les menus, listes et favoris pour les statistiques
        const menusCount = await prisma.menu.count({
            where: { userId }
        });

        const shoppingListsCount = await prisma.shoppingList.count({
            where: { userId }
        });

        const favoritesCount = await prisma.favorite.count({
            where: { userId }
        });

        return json({
            user,
            stats: {
                menusCount,
                shoppingListsCount,
                favoritesCount
            }
        });

    } catch (error) {
        console.error("Erreur lors du chargement du profil:", error);
        throw new Response("Erreur lors du chargement du profil", { status: 500 });
    }
}

export async function action({ request }: ActionFunctionArgs) {
    // Cette action est un proxy vers api.user.tsx
    const formData = await request.formData();

    // Créer une nouvelle requête pour transférer la demande à api.user
    const apiRequest = new Request("http://localhost:3000/api/user", {
        method: "POST",
        headers: request.headers,
        body: formData
    });

    // Appeler l'API utilisateur et retourner sa réponse
    const response = await fetch(apiRequest);
    return response;
}

export default function Profile() {
    const { user, stats } = useLoaderData<typeof loader>();
    const actionData = useActionData<any>();
    const navigation = useNavigation();

    // États pour les formulaires de modification
    const [showUpdateEmailForm, setShowUpdateEmailForm] = useState(false);
    const [showUpdatePasswordForm, setShowUpdatePasswordForm] = useState(false);
    const [showDeleteAccountForm, setShowDeleteAccountForm] = useState(false);

    // Références pour les formulaires
    const updateEmailFormRef = useRef<HTMLFormElement>(null);
    const updatePasswordFormRef = useRef<HTMLFormElement>(null);
    const deleteAccountFormRef = useRef<HTMLFormElement>(null);

    // État de soumission
    const isSubmitting = navigation.state === "submitting";

    return (
        <Layout>
            <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Mon profil</h1>

                {/* Informations de base */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                        <div>
                            <h2 className="text-lg leading-6 font-medium text-gray-900">Informations personnelles</h2>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                Détails et paramètres de votre compte
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowUpdateEmailForm(!showUpdateEmailForm)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                        >
                            Modifier
                        </button>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                        <dl className="sm:divide-y sm:divide-gray-200">
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Adresse email</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.email}</dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Mot de passe</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    ••••••••
                                    <button
                                        type="button"
                                        onClick={() => setShowUpdatePasswordForm(!showUpdatePasswordForm)}
                                        className="ml-4 text-rose-500 hover:text-rose-600 underline"
                                    >
                                        Modifier le mot de passe
                                    </button>
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>

                {/* Formulaire de modification d'email */}
                {showUpdateEmailForm && (
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Modifier votre adresse email</h3>
                        </div>
                        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                            <Form ref={updateEmailFormRef} method="post" className="space-y-6">
                                <input type="hidden" name="_action" value="updateProfile" />

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Nouvelle adresse email
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            defaultValue={user.email}
                                            required
                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
                                        />
                                        {actionData?.errors?.email && (
                                            <p className="mt-2 text-sm text-red-600">{actionData.errors.email}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowUpdateEmailForm(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50"
                                    >
                                        {isSubmitting ? "Enregistrement..." : "Enregistrer"}
                                    </button>
                                </div>
                            </Form>
                        </div>
                    </div>
                )}

                {/* Formulaire de modification de mot de passe */}
                {showUpdatePasswordForm && (
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Modifier votre mot de passe</h3>
                        </div>
                        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                            <Form ref={updatePasswordFormRef} method="post" className="space-y-6">
                                <input type="hidden" name="_action" value="updateProfile" />

                                <div>
                                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                                        Mot de passe actuel
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="currentPassword"
                                            name="currentPassword"
                                            type="password"
                                            autoComplete="current-password"
                                            required
                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
                                        />
                                        {actionData?.errors?.currentPassword && (
                                            <p className="mt-2 text-sm text-red-600">{actionData.errors.currentPassword}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                                        Nouveau mot de passe
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="newPassword"
                                            name="newPassword"
                                            type="password"
                                            autoComplete="new-password"
                                            required
                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
                                        />
                                        {actionData?.errors?.newPassword && (
                                            <p className="mt-2 text-sm text-red-600">{actionData.errors.newPassword}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="newPasswordConfirm" className="block text-sm font-medium text-gray-700">
                                        Confirmer le nouveau mot de passe
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="newPasswordConfirm"
                                            name="newPasswordConfirm"
                                            type="password"
                                            autoComplete="new-password"
                                            required
                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
                                        />
                                        {actionData?.errors?.newPasswordConfirm && (
                                            <p className="mt-2 text-sm text-red-600">{actionData.errors.newPasswordConfirm}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowUpdatePasswordForm(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50"
                                    >
                                        {isSubmitting ? "Enregistrement..." : "Enregistrer"}
                                    </button>
                                </div>
                            </Form>
                        </div>
                    </div>
                )}

                {/* Statistiques du compte */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                    <div className="px-4 py-5 sm:px-6">
                        <h2 className="text-lg leading-6 font-medium text-gray-900">Statistiques de votre compte</h2>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            Récapitulatif de votre activité sur Cookix
                        </p>
                    </div>
                    <div className="border-t border-gray-200">
                        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
                            <div className="px-6 py-5 text-center">
                                <dt className="text-sm font-medium text-gray-500">Menus créés</dt>
                                <dd className="mt-1 text-3xl font-semibold text-rose-500">{stats.menusCount}</dd>
                            </div>
                            <div className="px-6 py-5 text-center">
                                <dt className="text-sm font-medium text-gray-500">Listes de courses</dt>
                                <dd className="mt-1 text-3xl font-semibold text-rose-500">{stats.shoppingListsCount}</dd>
                            </div>
                            <div className="px-6 py-5 text-center">
                                <dt className="text-sm font-medium text-gray-500">Recettes favorites</dt>
                                <dd className="mt-1 text-3xl font-semibold text-rose-500">{stats.favoritesCount}</dd>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Zone de suppression du compte */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                    <div className="px-4 py-5 sm:px-6">
                        <h2 className="text-lg leading-6 font-medium text-gray-900">Supprimer mon compte</h2>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            Cette action est irréversible et supprimera toutes vos données
                        </p>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                        <p className="text-sm text-gray-500 mb-4">
                            La suppression de votre compte entraînera la perte définitive de toutes vos données, y compris vos menus, listes de courses et recettes favorites.
                        </p>

                        {!showDeleteAccountForm ? (
                            <button
                                type="button"
                                onClick={() => setShowDeleteAccountForm(true)}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                Supprimer mon compte
                            </button>
                        ) : (
                            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800">Attention : Cette action est irréversible</h3>
                                        <div className="mt-2 text-sm text-red-700">
                                            <p>Pour confirmer la suppression de votre compte, veuillez saisir votre mot de passe.</p>
                                        </div>
                                    </div>
                                </div>

                                <Form ref={deleteAccountFormRef} method="post" className="mt-4">
                                    <input type="hidden" name="_action" value="deleteAccount" />

                                    <div className="mb-4">
                                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                            Confirmez votre mot de passe
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                type="password"
                                                autoComplete="current-password"
                                                required
                                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                            />
                                            {actionData?.errors?.confirmPassword && (
                                                <p className="mt-2 text-sm text-red-600">{actionData.errors.confirmPassword}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={() => setShowDeleteAccountForm(false)}
                                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                                        >
                                            {isSubmitting ? "Suppression..." : "Supprimer définitivement"}
                                        </button>
                                    </div>
                                </Form>
                            </div>
                        )}
                    </div>
                </div>

                {/* Message de succès */}
                {actionData?.success && (
                    <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-8">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-green-700">{actionData.message}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Message d'erreur général */}
                {actionData?.success === false && !actionData?.errors && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{actionData.message}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}