import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { logout } from "~/utils/auth.server"; // On importe notre fonction logout centralisée

// Le loader redirige si quelqu'un essaie d'accéder à /logout avec un GET
export const loader = async ({ request }: LoaderFunctionArgs) => {
    return redirect("/");
};

// L'action exécute la déconnexion et redirige
export const action = async ({ request }: ActionFunctionArgs) => {
    return logout(request);
};