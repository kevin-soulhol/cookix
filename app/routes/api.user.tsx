import { json, ActionFunctionArgs, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { createCookieSessionStorage, SessionStorage } from "@remix-run/node";
import bcrypt from "bcryptjs";
import { prisma } from "~/utils/db.server";

// Configuration du stockage de session
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
    throw new Error("SESSION_SECRET doit être défini");
}

const sessionStorage = createCookieSessionStorage({
    cookie: {
        name: "__cookix_session",
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        secrets: [sessionSecret],
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 semaine en secondes
    },
});

// Helper pour obtenir la session
async function getSession(request: Request) {
    const cookie = request.headers.get("Cookie");
    return sessionStorage.getSession(cookie);
}

// Helper pour créer une session utilisateur
async function createUserSession(userId: number, redirectTo: string) {
    const session = await sessionStorage.getSession();
    session.set("userId", userId);

    // Générer le cookie
    const cookie = await sessionStorage.commitSession(session);

    return json({ success: true, cookie: cookie, redirectTo: redirectTo });


}

// Helper pour obtenir l'ID de l'utilisateur actuel
export async function getUserId(request: Request): Promise<number | null> {
    const session = await getSession(request);
    console.log("_____________________________ session", session)
    const userId = session.get("userId");
    console.log("_____________________________ userId from session", userId);
    return userId || null;
}

// Helper pour vérifier si l'utilisateur est connecté
export async function requireUserId(
    request: Request,
    redirectTo: string = new URL(request.url).pathname
): Promise<number> {
    const userId = await getUserId(request);
    if (!userId) {
        const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
        throw redirect(`/login?${searchParams}`);
    }
    return userId;
}

// Helper pour se déconnecter
export async function logout(request: Request) {
    const session = await getSession(request);
    return redirect("/login", {
        headers: {
            "Set-Cookie": await sessionStorage.destroySession(session),
        },
    });
}

// Loader pour vérifier l'état de l'authentification
export async function loader({ request }: LoaderFunctionArgs) {
    const userId = await getUserId(request);

    if (!userId) {
        return json({ isAuthenticated: false, user: null });
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            // Ne jamais renvoyer le mot de passe, même hashé
        },
    });

    return json({
        isAuthenticated: Boolean(user),
        user,
    });
}

// Action pour gérer les différentes opérations sur les utilisateurs
export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    // Log complet des données du formulaire
    const actionType = formData.get("_action");

    switch (actionType) {
        case "login":
            return handleLogin(formData);
        case "register":
            return handleRegister(formData);
        case "resetPassword":
            return handleResetPassword(formData);
        case "updateProfile":
            return handleUpdateProfile(request, formData);
        case "deleteAccount":
            return handleDeleteAccount(request, formData);
        case "logout":
            return logout(request)
        default:
            return json({ success: false, message: "Action non reconnue" }, { status: 400 });
    }
}

// Gérer la connexion
async function handleLogin(formData: FormData) {
    const email = formData.get("email");
    const password = formData.get("password");
    const redirectTo = formData.get("redirectTo") || "/";


    if (!email || !password) {
        return json(
            { success: false, errors: { email: "Veuillez saisir votre email et mot de passe" } },
            { status: 400 }
        );
    }

    // Vérifier que l'email est valide
    if (typeof email !== "string" || !email.includes("@")) {
        return json(
            { success: false, errors: { email: "Format d'email invalide" } },
            { status: 400 }
        );
    }


    // Vérifier que le mot de passe est une chaîne
    if (typeof password !== "string") {
        return json(
            { success: false, errors: { password: "Format de mot de passe invalide" } },
            { status: 400 }
        );
    }

    // Trouver l'utilisateur par email
    const user = await prisma.user.findFirst({
        where: { email: email.toLowerCase() },
    });

    if (!user) {
        return json(
            { success: false, errors: { email: "Identifiants incorrects" } },
            { status: 400 }
        );
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return json(
            { success: false, errors: { password: "Identifiants incorrects" } },
            { status: 400 }
        );
    }

    // Créer une session et rediriger
    return createUserSession(user.id, redirectTo.toString());
}

// Gérer l'inscription
async function handleRegister(formData: FormData) {
    const email = formData.get("email");
    const password = formData.get("password");
    const passwordConfirm = formData.get("passwordConfirm");
    const redirectTo = formData.get("redirectTo") || "/";

    if (!email || !password || !passwordConfirm) {
        return json(
            { success: false, errors: { form: "Tous les champs sont obligatoires" } },
            { status: 400 }
        );
    }


    // Vérifier que l'email est valide
    if (typeof email !== "string" || !email.includes("@")) {
        return json(
            { success: false, errors: { email: "Format d'email invalide" } },
            { status: 400 }
        );
    }


    // Vérifier que les mots de passe correspondent
    if (password !== passwordConfirm) {
        return json(
            { success: false, errors: { passwordConfirm: "Les mots de passe ne correspondent pas" } },
            { status: 400 }
        );
    }


    // Vérifier que le mot de passe est assez fort
    if (typeof password !== "string" || password.length < 8) {

        return json(
            { success: false, errors: { password: "Le mot de passe doit contenir au moins 8 caractères" } },
            { status: 400 }
        );
    }



    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findFirst({
        where: { email: email.toLowerCase() },
    });



    if (existingUser) {
        return json(
            { success: false, errors: { email: "Cet email est déjà utilisé" } },
            { status: 400 }
        );
    }

    // Créer l'utilisateur
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {
            email: email.toLowerCase(),
            password: hashedPassword,
        },
    });


    // Créer une session et rediriger
    return createUserSession(user.id, redirectTo.toString());
}

// Gérer la réinitialisation du mot de passe
async function handleResetPassword(formData: FormData) {
    const email = formData.get("email");

    if (!email) {
        return json(
            { success: false, errors: { email: "Veuillez saisir votre email" } },
            { status: 400 }
        );
    }

    // Vérifier que l'email est valide
    if (typeof email !== "string" || !email.includes("@")) {
        return json(
            { success: false, errors: { email: "Format d'email invalide" } },
            { status: 400 }
        );
    }

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findFirst({
        where: { email: email.toLowerCase() },
    });

    if (!user) {
        // Pour des raisons de sécurité, ne pas indiquer si l'email existe ou non
        return json({ success: true, message: "Si votre email est valide, vous recevrez un lien pour réinitialiser votre mot de passe" });
    }

    // Dans une application réelle, ici vous enverriez un email avec un lien pour réinitialiser le mot de passe
    // Pour cet exemple, nous simulons simplement l'envoi d'un email

    // Génération d'un token (dans une vraie application, vous stockeriez ce token dans la base de données)
    const resetToken = Math.random().toString(36).substring(2, 15);

    console.log(`[SIMULATION] Email envoyé à ${email} avec le token de réinitialisation: ${resetToken}`);

    return json({ success: true, message: "Si votre email est valide, vous recevrez un lien pour réinitialiser votre mot de passe" });
}

// Gérer la mise à jour du profil
async function handleUpdateProfile(request: Request, formData: FormData) {
    const userId = await requireUserId(request);
    const email = formData.get("email");
    const currentPassword = formData.get("currentPassword");
    const newPassword = formData.get("newPassword");
    const newPasswordConfirm = formData.get("newPasswordConfirm");

    // Trouver l'utilisateur actuel
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        return json({ success: false, message: "Utilisateur non trouvé" }, { status: 404 });
    }

    // Préparer les données à mettre à jour
    const updateData: any = {};

    // Mettre à jour l'email si fourni
    if (email && typeof email === "string" && email !== user.email) {
        if (!email.includes("@")) {
            return json(
                { success: false, errors: { email: "Format d'email invalide" } },
                { status: 400 }
            );
        }

        // Vérifier si le nouvel email n'est pas déjà utilisé
        const existingUser = await prisma.user.findFirst({
            where: { email: email.toLowerCase(), id: { not: userId } },
        });

        if (existingUser) {
            return json(
                { success: false, errors: { email: "Cet email est déjà utilisé" } },
                { status: 400 }
            );
        }

        updateData.email = email.toLowerCase();
    }

    // Mettre à jour le mot de passe si fourni
    if (currentPassword && newPassword && newPasswordConfirm) {
        if (typeof currentPassword !== "string" || typeof newPassword !== "string" || typeof newPasswordConfirm !== "string") {
            return json(
                { success: false, errors: { password: "Format de mot de passe invalide" } },
                { status: 400 }
            );
        }

        // Vérifier le mot de passe actuel
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordValid) {
            return json(
                { success: false, errors: { currentPassword: "Mot de passe actuel incorrect" } },
                { status: 400 }
            );
        }

        // Vérifier que les nouveaux mots de passe correspondent
        if (newPassword !== newPasswordConfirm) {
            return json(
                { success: false, errors: { newPasswordConfirm: "Les mots de passe ne correspondent pas" } },
                { status: 400 }
            );
        }

        // Vérifier que le nouveau mot de passe est assez fort
        if (newPassword.length < 8) {
            return json(
                { success: false, errors: { newPassword: "Le mot de passe doit contenir au moins 8 caractères" } },
                { status: 400 }
            );
        }

        updateData.password = await bcrypt.hash(newPassword, 10);
    }

    // Si aucune donnée à mettre à jour
    if (Object.keys(updateData).length === 0) {
        return json({ success: true, message: "Aucune modification n'a été effectuée" });
    }

    // Mettre à jour l'utilisateur
    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
            id: true,
            email: true,
        },
    });

    return json({ success: true, message: "Profil mis à jour avec succès", user: updatedUser });
}

// Gérer la suppression du compte
async function handleDeleteAccount(request: Request, formData: FormData) {
    const userId = await requireUserId(request);
    const confirmPassword = formData.get("confirmPassword");

    if (!confirmPassword) {
        return json(
            { success: false, errors: { confirmPassword: "Veuillez confirmer votre mot de passe" } },
            { status: 400 }
        );
    }

    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        return json({ success: false, message: "Utilisateur non trouvé" }, { status: 404 });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(confirmPassword.toString(), user.password);

    if (!isPasswordValid) {
        return json(
            { success: false, errors: { confirmPassword: "Mot de passe incorrect" } },
            { status: 400 }
        );
    }

    // Dans une application réelle, vous pourriez vouloir :
    // 1. Anonymiser les données de l'utilisateur plutôt que de les supprimer complètement
    // 2. Mettre en place une période de grâce avant la suppression définitive
    // 3. Envoyer un email de confirmation

    try {
        // Supprimer les données associées à l'utilisateur
        // Notez que cela dépend de vos contraintes de clé étrangère et de cascade

        // Supprimer les listes de courses
        await prisma.shoppingList.deleteMany({
            where: { userId },
        });

        // Supprimer les menus
        await prisma.menu.deleteMany({
            where: { userId },
        });

        // Supprimer les favoris
        await prisma.favorite.deleteMany({
            where: { userId },
        });

        // Supprimer les partages de menu
        await prisma.menuShare.deleteMany({
            where: { sharedByUserId: userId },
        });

        // Enfin, supprimer l'utilisateur lui-même
        await prisma.user.delete({
            where: { id: userId },
        });

        // Détruire la session
        const session = await getSession(request);
        return redirect("/", {
            headers: {
                "Set-Cookie": await sessionStorage.destroySession(session),
            },
        });

    } catch (error) {
        console.error("Erreur lors de la suppression du compte:", error);
        return json(
            { success: false, message: "Une erreur est survenue lors de la suppression du compte" },
            { status: 500 }
        );
    }
}