import { json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { useState, useRef, useEffect } from "react";
import { prisma } from "~/utils/db.server";
import Layout from "~/components/Layout";
// On importe toute la logique depuis notre fichier centralisé
import {
    requireUserId,
    handleUpdateProfile,
    handleDeleteAccount,
    logout
} from "~/utils/auth.server";

// Typage pour les données de l'action pour une autocomplétion parfaite
type ActionData = Awaited<ReturnType<typeof action>>;

// Le loader est optimisé et plus robuste
export async function loader({ request }: LoaderFunctionArgs) {
    const userId = await requireUserId(request);

    // On lance les requêtes en parallèle pour plus d'efficacité
    const [user, menusCount, shoppingListsCount, favoritesCount] = await Promise.all([
        prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true } }),
        prisma.menu.count({ where: { userId } }),
        prisma.shoppingList.count({ where: { userId } }),
        prisma.favorite.count({ where: { userId } })
    ]);

    // Cas rare mais important : si l'utilisateur n'existe plus dans la DB, on le déconnecte
    if (!user) throw logout(request);

    return json({
        user,
        stats: { menusCount, shoppingListsCount, favoritesCount }
    });
}

// L'action gère directement les soumissions, ce n'est plus un proxy
export async function action({ request }: ActionFunctionArgs) {
    const userId = await requireUserId(request);
    const formData = await request.formData();
    const actionType = formData.get("_action");

    switch (actionType) {
        case "updateProfile":
            return handleUpdateProfile(userId, formData);
        case "deleteAccount":
            // handleDeleteAccount gère la redirection et la destruction de la session
            return handleDeleteAccount(userId, formData);
        default:
            return json({ errors: { form: "Action non reconnue" } }, { status: 400 });
    }
}

export default function ProfilePage() {
    const { user, stats } = useLoaderData<typeof loader>();
    const actionData = useActionData<ActionData>();
    const navigation = useNavigation();

    // Un seul état pour gérer quel formulaire est affiché
    const [view, setView] = useState<"none" | "email" | "password" | "delete">("none");
    const formRef = useRef<HTMLFormElement>(null);
    const isSubmitting = navigation.state === "submitting" && navigation.formData?.get("_action") === "updateProfile";
    const isDeleting = navigation.state === "submitting" && navigation.formData?.get("_action") === "deleteAccount";

    // Ferme le formulaire et le réinitialise après un succès
    useEffect(() => {
        if (actionData?.success) {
            setView("none");
            formRef.current?.reset();
        }
    }, [actionData]);

    return (
        <Layout>
            <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Mon profil</h1>

                {/* Notification de succès globale */}
                {actionData?.success && (
                    <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6 rounded-md">
                        <p className="text-sm text-green-800">{actionData.message}</p>
                    </div>
                )}

                {/* Section d'informations personnelles */}
                <div className="bg-white shadow sm:rounded-lg mb-8">
                    <div className="px-4 py-5 sm:px-6">
                        <h2 className="text-lg leading-6 font-medium text-gray-900">Informations personnelles</h2>
                    </div>
                    <div className="border-t border-gray-200">
                        <dl className="sm:divide-y sm:divide-gray-200">
                            {/* Ligne Email */}
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Adresse email</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex justify-between items-center">
                                    <span>{user.email}</span>
                                    <button onClick={() => setView(view === 'email' ? 'none' : 'email')} className="font-medium text-rose-500 hover:text-rose-600">
                                        {view === 'email' ? 'Annuler' : 'Modifier'}
                                    </button>
                                </dd>
                            </div>
                            {/* Formulaire Email (conditionnel) */}
                            {view === 'email' && <EditableSection formRef={formRef} action="updateProfile" isSubmitting={isSubmitting} errors={actionData?.errors}><EmailFields defaultEmail={user.email} /></EditableSection>}

                            {/* Ligne Mot de passe */}
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Mot de passe</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex justify-between items-center">
                                    <span>••••••••</span>
                                    <button onClick={() => setView(view === 'password' ? 'none' : 'password')} className="font-medium text-rose-500 hover:text-rose-600">
                                        {view === 'password' ? 'Annuler' : 'Modifier'}
                                    </button>
                                </dd>
                            </div>
                            {/* Formulaire Mot de passe (conditionnel) */}
                            {view === 'password' && <EditableSection formRef={formRef} action="updateProfile" isSubmitting={isSubmitting} errors={actionData?.errors}><PasswordFields /></EditableSection>}
                        </dl>
                    </div>
                </div>

                {/* Section des statistiques (inchangée) */}
                {/* ... */}

                {/* Section Suppression du compte */}
                <div className="bg-red-50 border border-red-200 sm:rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h2 className="text-lg leading-6 font-medium text-red-800">Zone de danger</h2>
                        <div className="mt-2 max-w-xl text-sm text-red-700">
                            <p>Une fois votre compte supprimé, toutes vos données (menus, listes, favoris) seront définitivement effacées. Cette action est irréversible.</p>
                        </div>
                        <div className="mt-5">
                            <button onClick={() => setView('delete')} className="text-white bg-red-600 hover:bg-red-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50" disabled={isDeleting}>
                                Supprimer mon compte
                            </button>
                        </div>

                        {/* Formulaire de confirmation de suppression */}
                        {view === 'delete' && (
                            <div className="mt-4 pt-4 border-t border-red-200">
                                <Form method="post">
                                    <input type="hidden" name="_action" value="deleteAccount" />
                                    <p className="text-sm font-medium text-gray-800 mb-2">Pour confirmer, veuillez saisir votre mot de passe :</p>
                                    <input id="confirmPassword" name="confirmPassword" type="password" required className="appearance-none block w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" />
                                    {actionData?.errors?.confirmPassword && <p className="mt-2 text-sm text-red-600">{actionData.errors.confirmPassword}</p>}
                                    <div className="mt-4 flex items-center space-x-3">
                                        <button type="submit" disabled={isDeleting} className="text-white bg-red-600 hover:bg-red-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50">
                                            {isDeleting ? 'Suppression en cours...' : 'Je confirme, supprimer'}
                                        </button>
                                        <button type="button" onClick={() => setView('none')} className="font-medium text-gray-600 hover:text-gray-900">
                                            Annuler
                                        </button>
                                    </div>
                                </Form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}

// Composants utilitaires pour ne pas répéter le JSX du formulaire
function EditableSection({ formRef, action, isSubmitting, errors, children }: any) {
    return (
        <div className="px-4 py-5 sm:p-6 bg-gray-50/50">
            <Form ref={formRef} method="post" className="space-y-4">
                <input type="hidden" name="_action" value={action} />
                {children}
                <div className="flex justify-end">
                    <button type="submit" disabled={isSubmitting} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50">
                        {isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
                    </button>
                </div>
            </Form>
        </div>
    );
}

function EmailFields({ defaultEmail, errors }: any) {
    return (
        <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Nouvelle adresse email</label>
            <input id="email" name="email" type="email" defaultValue={defaultEmail} required className="mt-1 block w-full" />
            {errors?.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
        </div>
    );
}

function PasswordFields({ errors }: any) {
    return (
        <>
            <div>
                <label htmlFor="currentPassword">Mot de passe actuel</label>
                <input id="currentPassword" name="currentPassword" type="password" required className="mt-1 block w-full" />
                {errors?.currentPassword && <p className="mt-2 text-sm text-red-600">{errors.currentPassword}</p>}
            </div>
            <div>
                <label htmlFor="newPassword">Nouveau mot de passe</label>
                <input id="newPassword" name="newPassword" type="password" required className="mt-1 block w-full" />
                {errors?.newPassword && <p className="mt-2 text-sm text-red-600">{errors.newPassword}</p>}
            </div>
            <div>
                <label htmlFor="newPasswordConfirm">Confirmer le nouveau mot de passe</label>
                <input id="newPasswordConfirm" name="newPasswordConfirm" type="password" required className="mt-1 block w-full" />
                {errors?.newPasswordConfirm && <p className="mt-2 text-sm text-red-600">{errors.newPasswordConfirm}</p>}
            </div>
        </>
    );
}