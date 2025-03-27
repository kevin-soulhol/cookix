import { json, type ActionFunctionArgs, type LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams, useNavigation } from "@remix-run/react";
import { useState, useEffect, useRef } from "react";
import { getUserId } from "./api.user";

export async function loader({ request }: LoaderFunctionArgs) {
    const userId = await getUserId(request);

    // Si l'utilisateur est déjà connecté, le rediriger vers la page d'accueil
    if (userId) {
        return redirect("/");
    }

    return json({ userId });
}

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();

    try {

        // Créer une nouvelle requête pour transférer la demande à api.user
        const apiRequest = new Request("http://localhost:3000/api/user", {
            method: "POST",
            headers: new Headers({
                'Accept': request.headers.get('Accept') || 'application/json'
            }),
            body: formData
        });

        // Appeler l'API utilisateur et retourner sa réponse
        const response = await fetch(apiRequest);
        const responseData = await response.json();
        console.log("_______________________________________", responseData)

        // Si c'est une redirection (connexion réussie), garder le comportement original
        if (response.status >= 300 && response.status < 400) {
            return response;
        }

        if (responseData.cookie) {
            return redirect(responseData.redirectTo || '/', {
                headers: {
                    "Set-Cookie": responseData.cookie
                },
            });
        }

        // Sinon retourner les données JSON avec le code d'état approprié
        return json(responseData, { status: response.status });
    } catch (error) {
        console.error("Erreur lors de la connexion:", error);
        return json({
            success: false,
            errors: { form: "Une erreur s'est produite lors de la connexion" }
        }, { status: 500 });
    }
}

export default function Login() {
    const actionData = useActionData<unknown>();
    const [searchParams] = useSearchParams();
    const redirectTo = searchParams.get("redirectTo") || "/";
    const navigation = useNavigation();

    const [activeView, setActiveView] = useState<"login" | "register" | "resetPassword">("login");
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Références pour les formulaires
    const loginFormRef = useRef<HTMLFormElement>(null);
    const registerFormRef = useRef<HTMLFormElement>(null);
    const resetFormRef = useRef<HTMLFormElement>(null);

    // État de soumission
    const isSubmitting = navigation.state === "submitting";

    useEffect(() => {
        console.log("État de navigation actuel:", navigation.state);
        if (navigation.state === "loading" && actionData?.success) {
            console.log("Redirection en cours...");
        }
    }, [navigation.state, actionData]);

    // Mettre à jour les erreurs lorsque les données d'action changent
    useEffect(() => {
        if (actionData?.errors) {
            setErrors(actionData.errors);
        } else {
            setErrors({});
        }
    }, [actionData]);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="text-center text-3xl font-extrabold text-gray-900">
                    {activeView === "login" && "Connexion à votre compte"}
                    {activeView === "register" && "Créer un compte"}
                    {activeView === "resetPassword" && "Réinitialiser votre mot de passe"}
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    {activeView === "login" && (
                        <>
                            Ou{" "}
                            <button
                                type="button"
                                onClick={() => setActiveView("register")}
                                className="font-medium text-rose-500 hover:text-rose-400"
                            >
                                créez un nouveau compte
                            </button>
                        </>
                    )}

                    {activeView === "register" && (
                        <>
                            Vous avez déjà un compte ?{" "}
                            <button
                                type="button"
                                onClick={() => setActiveView("login")}
                                className="font-medium text-rose-500 hover:text-rose-400"
                            >
                                Connectez-vous
                            </button>
                        </>
                    )}

                    {activeView === "resetPassword" && (
                        <>
                            Vous vous souvenez de votre mot de passe ?{" "}
                            <button
                                type="button"
                                onClick={() => setActiveView("login")}
                                className="font-medium text-rose-500 hover:text-rose-400"
                            >
                                Connectez-vous
                            </button>
                        </>
                    )}
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {/* Formulaire de connexion */}
                    {activeView === "login" && (
                        <Form ref={loginFormRef} method="post" className="space-y-6">
                            <input type="hidden" name="_action" value="login" />
                            <input type="hidden" name="redirectTo" value={redirectTo} />

                            <div>
                                <label htmlFor="login-email" className="block text-sm font-medium text-gray-700">
                                    Adresse email
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="login-email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm ${errors.email ? "border-red-300" : "border-gray-300"
                                            }`}
                                    />
                                    {errors.email && (
                                        <p className="mt-2 text-sm text-red-600" id="email-error">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="login-password" className="block text-sm font-medium text-gray-700">
                                    Mot de passe
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="login-password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm ${errors.password ? "border-red-300" : "border-gray-300"
                                            }`}
                                    />
                                    {errors.password && (
                                        <p className="mt-2 text-sm text-red-600" id="password-error">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                        Se souvenir de moi
                                    </label>
                                </div>

                                <div className="text-sm">
                                    <button
                                        type="button"
                                        onClick={() => setActiveView("resetPassword")}
                                        className="font-medium text-rose-500 hover:text-rose-400"
                                    >
                                        Mot de passe oublié ?
                                    </button>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50"
                                >
                                    {isSubmitting ? "Connexion en cours..." : "Se connecter"}
                                </button>
                            </div>

                            {actionData?.success === true && (
                                <div className="bg-green-50 border-l-4 border-green-400 p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-green-700">
                                                {actionData.message}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {actionData?.success === false && !errors.email && !errors.password && (
                                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-red-700">
                                                {actionData.message}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Form>
                    )}

                    {/* Formulaire d'inscription */}
                    {activeView === "register" && (
                        <Form ref={registerFormRef} method="post" className="space-y-6">
                            <input type="hidden" name="_action" value="register" />
                            <input type="hidden" name="redirectTo" value={redirectTo} />

                            <div>
                                <label htmlFor="register-email" className="block text-sm font-medium text-gray-700">
                                    Adresse email
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="register-email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm ${errors.email ? "border-red-300" : "border-gray-300"
                                            }`}
                                    />
                                    {errors.email && (
                                        <p className="mt-2 text-sm text-red-600" id="email-error">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="register-password" className="block text-sm font-medium text-gray-700">
                                    Mot de passe
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="register-password"
                                        name="password"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm ${errors.password ? "border-red-300" : "border-gray-300"
                                            }`}
                                    />
                                    {errors.password && (
                                        <p className="mt-2 text-sm text-red-600" id="password-error">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="register-password-confirm" className="block text-sm font-medium text-gray-700">
                                    Confirmer le mot de passe
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="register-password-confirm"
                                        name="passwordConfirm"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm ${errors.passwordConfirm ? "border-red-300" : "border-gray-300"
                                            }`}
                                    />
                                    {errors.passwordConfirm && (
                                        <p className="mt-2 text-sm text-red-600" id="password-confirm-error">
                                            {errors.passwordConfirm}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50"
                                >
                                    {isSubmitting ? "Inscription en cours..." : "S'inscrire"}
                                </button>
                            </div>

                            {actionData?.success === false && !errors.email && !errors.password && !errors.passwordConfirm && (
                                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-red-700">
                                                {actionData.message}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Form>
                    )}

                    {/* Formulaire de réinitialisation de mot de passe */}
                    {activeView === "resetPassword" && (
                        <Form ref={resetFormRef} method="post" className="space-y-6">
                            <input type="hidden" name="_action" value="resetPassword" />

                            <div>
                                <p className="text-sm text-gray-600 mb-4">
                                    Saisissez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                                </p>

                                <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700">
                                    Adresse email
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="reset-email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm ${errors.email ? "border-red-300" : "border-gray-300"
                                            }`}
                                    />
                                    {errors.email && (
                                        <p className="mt-2 text-sm text-red-600" id="email-error">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50"
                                >
                                    {isSubmitting ? "Envoi en cours..." : "Envoyer le lien de réinitialisation"}
                                </button>
                            </div>

                            {actionData?.success === true && (
                                <div className="bg-green-50 border-l-4 border-green-400 p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-green-700">
                                                {actionData.message}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {actionData?.success === false && !errors.email && (
                                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-red-700">
                                                {actionData.message}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Form>
                    )}

                    {/* Bouton de retour à l'accueil */}
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    Ou
                                </span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Link
                                to="/"
                                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                            >
                                Retour à l'accueil
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}