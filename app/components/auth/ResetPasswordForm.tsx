import type { FC } from "react";
import { Form } from "@remix-run/react";
import type { ActionData } from "~/routes/login._index";

type ResetPasswordFormProps = {
    actionData?: ActionData;
    isSubmitting: boolean;
};

const ResetPasswordForm: FC<ResetPasswordFormProps> = ({ actionData, isSubmitting }) => {
    // Si la demande a réussi, on affiche un message de succès et on cache le formulaire.
    if (actionData?.success) {
        return (
            <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-green-800">Demande envoyée</h3>
                        <div className="mt-2 text-sm text-green-700">
                            <p>{actionData.message}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <Form method="post" className="space-y-6">
            <input type="hidden" name="_action" value="resetPassword" />

            <p className="text-sm text-gray-600">
                Saisissez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </p>

            {/* Champ Email */}
            <div>
                <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700">Adresse email</label>
                <div className="mt-1">
                    <input id="reset-email" name="email" type="email" autoComplete="email" required
                        className={`... ${actionData?.errors?.email ? "border-red-500" : "border-gray-300"}`} />
                    {actionData?.errors?.email && <p className="mt-2 text-sm text-red-600">{actionData.errors.email}</p>}
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
                    {isSubmitting ? "Envoi..." : "Envoyer le lien"}
                </button>
            </div>
        </Form>
    );
};

export default ResetPasswordForm;