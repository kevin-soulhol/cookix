import type { FC } from "react";
import { Form } from "@remix-run/react";
import { ActionData } from "~/routes/login._index";

type LoginFormProps = {
    actionData?: ActionData;
    isSubmitting: boolean;
    redirectTo: string;
    email: string;
    onSwitchToReset: () => void; // Fonction pour demander au parent de changer de vue
};

const LoginForm: FC<LoginFormProps> = ({ actionData, isSubmitting, redirectTo, email, onSwitchToReset }) => {
    return (
        <Form method="post" className="space-y-6">
            <input type="hidden" name="_action" value="login" />
            <input type="hidden" name="redirectTo" value={redirectTo} />

            {/* Champ Email */}
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
                        defaultValue={email}
                        className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm ${actionData?.errors?.email || actionData?.errors?.form ? "border-red-500" : "border-gray-300"}`}
                        aria-invalid={!!actionData?.errors?.email}
                        aria-describedby="email-error"
                    />
                    {actionData?.errors?.email && (
                        <p className="mt-2 text-sm text-red-600" id="email-error">
                            {actionData.errors.email}
                        </p>
                    )}
                </div>
            </div>

            {/* Champ Mot de passe */}
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
                        className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm ${actionData?.errors?.password || actionData?.errors?.form ? "border-red-500" : "border-gray-300"}`}
                        aria-invalid={!!actionData?.errors?.password}
                        aria-describedby="password-error"
                    />
                    {actionData?.errors?.password && (
                        <p className="mt-2 text-sm text-red-600" id="password-error">
                            {actionData.errors.password}
                        </p>
                    )}
                </div>
            </div>

            {/* Options (Se souvenir de moi & Mot de passe oublié) */}
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
                        onClick={onSwitchToReset}
                        className="font-medium text-rose-500 hover:text-rose-400"
                    >
                        Mot de passe oublié ?
                    </button>
                </div>
            </div>

            {/* Erreur générale du formulaire */}
            {actionData?.errors?.form && (
                <div className="text-sm text-red-600 text-center">
                    {actionData.errors.form}
                </div>
            )}

            {/* Bouton de soumission */}
            <div>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50"
                >
                    {isSubmitting ? "Connexion..." : "Se connecter"}
                </button>
            </div>
        </Form>
    );
};

export default LoginForm;