import { json, type ActionFunctionArgs, type LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Link, useActionData, useSearchParams, useNavigation } from "@remix-run/react";
import { useState, useEffect } from "react";
import { getUserId, handleLogin, handleRegister, handleResetPassword } from "~/utils/auth.server";

// Importez les nouveaux composants
import LoginForm from "~/components/auth/LoginForm";
import RegisterForm from "~/components/auth/RegisterForm";
import ResetPasswordForm from "~/components/auth/ResetPasswordForm";

// EXPORTEZ ce type pour l'utiliser dans les composants enfants
export type ActionData = {
    errors?: {
        email?: string;
        password?: string;
        passwordConfirm?: string;
        form?: string;
    };
    success?: boolean;
    message?: string;
    submittedEmail?: string;
};

// ... (Les fonctions `loader` et `action` restent inchangées)
export async function loader({ request }: LoaderFunctionArgs) {
    const userId = await getUserId(request);
    if (userId) return redirect("/");
    return json({});
}

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const actionType = formData.get("_action");

    switch (actionType) {
        case "login": {
            const email = formData.get("email") as string;
            const response = await handleLogin(request, formData);

            if (response instanceof Response && response.status !== 302) {
                const data = await response.json();
                return json({ ...data, submittedEmail: email });
            }
            return response;
        }
        case "register":
            return handleRegister(request, formData);
        case "resetPassword":
            return handleResetPassword(formData);
        default:
            return json({ errors: { form: "Action non valide" } }, { status: 400 });
    }
}


const SAVED_EMAIL_KEY = 'login-email';

export default function Login() {
    const actionData = useActionData<ActionData>();
    const [searchParams] = useSearchParams();
    const redirectTo = searchParams.get("redirectTo") || "/";
    const navigation = useNavigation();

    const [activeView, setActiveView] = useState<"login" | "register" | "resetPassword">("login");
    const [email, setEmail] = useState('');

    const isSubmitting = navigation.state === "submitting";

    // Logique de mémorisation de l'email (inchangée)
    useEffect(() => {
        const savedEmail = localStorage.getItem(SAVED_EMAIL_KEY);
        if (savedEmail) setEmail(savedEmail);
    }, []);

    useEffect(() => {
        if (actionData?.submittedEmail) {
            localStorage.setItem(SAVED_EMAIL_KEY, actionData.submittedEmail);
            setEmail(actionData.submittedEmail);
        }
    }, [actionData]);

    // Au changement de vue, on ne vide que les messages de succès, pas les erreurs
    // car les erreurs sont déjà liées à un formulaire spécifique grâce à actionData.
    const switchView = (view: typeof activeView) => {
        setActiveView(view);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="text-center text-3xl font-extrabold text-gray-900">
                    {activeView === "login" && "Connexion"}
                    {activeView === "register" && "Créer un compte"}
                    {activeView === "resetPassword" && "Réinitialiser le mot de passe"}
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    {activeView === "login" && (
                        <>
                            Ou{" "}
                            <button type="button" onClick={() => switchView("register")} className="font-medium text-rose-500 hover:text-rose-400">
                                créez un nouveau compte
                            </button>
                        </>
                    )}
                    {(activeView === "register" || activeView === "resetPassword") && (
                        <>
                            Retour à la{" "}
                            <button type="button" onClick={() => switchView("login")} className="font-medium text-rose-500 hover:text-rose-400">
                                page de connexion
                            </button>
                        </>
                    )}
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {/* LE CHEF D'ORCHESTRE EST ICI */}
                    {activeView === 'login' && (
                        <LoginForm
                            actionData={actionData}
                            isSubmitting={isSubmitting}
                            redirectTo={redirectTo}
                            email={email}
                            onSwitchToReset={() => switchView('resetPassword')}
                        />
                    )}
                    {activeView === 'register' && (
                        <RegisterForm
                            actionData={actionData}
                            isSubmitting={isSubmitting}
                            redirectTo={redirectTo}
                        />
                    )}
                    {activeView === 'resetPassword' && (
                        <ResetPasswordForm
                            actionData={actionData}
                            isSubmitting={isSubmitting}
                        />
                    )}

                    {/* Le bouton de retour global reste ici */}
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Ou</span>
                            </div>
                        </div>
                        <div className="mt-6">
                            <Link to="/" className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                Retour à l'accueil
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}