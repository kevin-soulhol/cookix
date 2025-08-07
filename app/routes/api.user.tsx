import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { getUserId } from "~/utils/auth.server";
import { prisma } from "~/utils/db.server";

/**
 * C'est une "Resource Route" qui sert à une seule chose :
 * Fournir des informations sur l'utilisateur actuellement authentifié.
 *
 * Elle peut être appelée depuis le client avec useFetcher('/api/user')
 * pour obtenir l'état de connexion sans recharger la page.
 *
 * Elle n'a plus besoin d'action, car les mutations (login, logout, register...)
 * sont gérées par les actions de leurs routes respectives.
 */
export async function loader({ request }: LoaderFunctionArgs) {
    const userId = await getUserId(request);

    if (!userId) {
        // L'utilisateur n'est pas connecté
        return json({ isAuthenticated: false, user: null });
    }

    // L'utilisateur est connecté, on récupère ses informations publiques
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            // Important : Ne jamais renvoyer le mot de passe, même hashé !
            id: true,
            email: true,
            // Vous pourriez ajouter d'autres champs ici (ex: name, avatarUrl)
        },
    });

    if (!user) {
        // Ce cas est rare (userId dans la session mais pas dans la DB),
        // mais c'est une bonne pratique de le gérer.
        return json({ isAuthenticated: false, user: null });
    }

    return json({
        isAuthenticated: true,
        user,
    });
}