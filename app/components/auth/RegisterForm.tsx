import type { FC } from "react";
import { Form } from "@remix-run/react";
import type { ActionData } from "~/routes/login._index";

type RegisterFormProps = {
    actionData?: ActionData;
    isSubmitting: boolean;
    redirectTo: string;
};

const RegisterForm: FC<RegisterFormProps> = ({ actionData, isSubmitting, redirectTo }) => {
    return (
        <Form method="post" className="space-y-6">
            <input type="hidden" name="_action" value="register" />
            <input type="hidden" name="redirectTo" value={redirectTo} />

            {/* Champs Email, Mot de passe, Confirmation */}
            {/* ... (copiez-collez les champs du formulaire d'inscription ici) ... */}
            {/* Par exemple pour l'email : */}
            <div>
                <label htmlFor="register-email" className="block text-sm font-medium text-gray-700">Adresse email</label>
                <div className="mt-1">
                    <input id="register-email" name="email" type="email" autoComplete="email" required
                        className={`... ${actionData?.errors?.email ? "border-red-500" : "border-gray-300"}`} />
                    {actionData?.errors?.email && <p className="mt-2 text-sm text-red-600">{actionData.errors.email}</p>}
                </div>
            </div>
            {/* Répétez pour password et passwordConfirm */}
            <div>
                <label htmlFor="register-password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
                <div className="mt-1">
                    <input id="register-password" name="password" type="password" required
                        className={`... ${actionData?.errors?.password ? "border-red-500" : "border-gray-300"}`} />
                    {actionData?.errors?.password && <p className="mt-2 text-sm text-red-600">{actionData.errors.password}</p>}
                </div>
            </div>
            <div>
                <label htmlFor="register-password-confirm" className="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
                <div className="mt-1">
                    <input id="register-password-confirm" name="passwordConfirm" type="password" required
                        className={`... ${actionData?.errors?.passwordConfirm ? "border-red-500" : "border-gray-300"}`} />
                    {actionData?.errors?.passwordConfirm && <p className="mt-2 text-sm text-red-600">{actionData.errors.passwordConfirm}</p>}
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
                    {isSubmitting ? "Inscription..." : "S'inscrire"}
                </button>
            </div>
        </Form>
    );
};

export default RegisterForm;