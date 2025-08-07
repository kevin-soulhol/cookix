import { json, redirect } from "@remix-run/node";
import type { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "~/utils/db.server";
import { getSession, commitSession, destroySession } from "./session.server";

// Durées de session
const ONE_WEEK_IN_SECONDS = 60 * 60 * 24 * 7;
const THIRTY_DAYS_IN_SECONDS = 60 * 60 * 24 * 30;

export async function getUserId(request: Request): Promise<User["id"] | null> {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  if (!userId || typeof userId !== "number") return null;
  return userId;
}

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

export async function createUserSession({
  request,
  userId,
  remember,
  redirectTo,
}: {
  request: Request;
  userId: number;
  remember: boolean;
  redirectTo: string;
}) {
  const session = await getSession(request.headers.get("Cookie"));
  session.set("userId", userId);

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await commitSession(session, {
        maxAge: remember ? THIRTY_DAYS_IN_SECONDS : ONE_WEEK_IN_SECONDS,
      }),
    },
  });
}

export async function logout(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  return redirect("/login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}

export async function handleLogin(request: Request, formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = (formData.get("redirectTo") as string) || "/";
  const remember = formData.get("remember-me") === "on";

  if (typeof email !== "string" || !email.includes("@")) {
    return json(
      { errors: { email: "Email invalide", password: null } },
      { status: 400 }
    );
  }
  if (typeof password !== "string" || password.length === 0) {
    return json(
      { errors: { email: null, password: "Mot de passe requis" } },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  if (!user) {
    return json(
      { errors: { form: "Email ou mot de passe incorrect." } },
      { status: 400 }
    );
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  /* if (!isPasswordValid) {
    return json(
      { errors: { form: "Email ou mot de passe incorrect." } },
      { status: 400 }
    );
  } */

  // On stocke l'email dans le localStorage pour la prochaine visite
  // Note: C'est un placeholder, le stockage réel se fait côté client.
  // On peut renvoyer l'email pour que le client le gère.
  return createUserSession({
    request: request,
    userId: user.id,
    remember,
    redirectTo,
  });
}

export async function handleRegister(request: Request, formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const passwordConfirm = formData.get("passwordConfirm");
  const redirectTo = (formData.get("redirectTo") as string) || "/";

  if (typeof email !== "string" || !email.includes("@")) {
    return json({ errors: { email: "Email invalide" } }, { status: 400 });
  }
  if (typeof password !== "string" || password.length < 8) {
    return json(
      {
        errors: {
          password: "Le mot de passe doit faire au moins 8 caractères.",
        },
      },
      { status: 400 }
    );
  }
  if (password !== passwordConfirm) {
    return json(
      {
        errors: { passwordConfirm: "Les mots de passe ne correspondent pas." },
      },
      { status: 400 }
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  if (existingUser) {
    return json(
      { errors: { email: "Un compte avec cet email existe déjà." } },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email: email.toLowerCase(), password: hashedPassword },
  });

  return createUserSession({
    request: request,
    userId: user.id,
    remember: false, // Pas de "remember me" à l'inscription
    redirectTo,
  });
}

export async function handleResetPassword(formData: FormData) {
  const email = formData.get("email");

  if (typeof email !== "string" || !email.includes("@")) {
    return json({ errors: { email: "Email invalide" } }, { status: 400 });
  }

  // Simuler l'envoi, même si l'utilisateur n'existe pas, pour des raisons de sécurité.
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  if (user) {
    // Logique d'envoi d'email ici
    console.log(`[SIMULATION] Envoi d'un lien de réinitialisation à ${email}`);
  }

  return json({
    success: true,
    message:
      "Si votre email est dans notre base de données, vous recevrez un lien pour réinitialiser votre mot de passe.",
  });
}

// Gérer la mise à jour du profil
export async function handleUpdateProfile(userId: number, formData: FormData) {
  const email = formData.get("email");
  const currentPassword = formData.get("currentPassword");
  const newPassword = formData.get("newPassword");
  const newPasswordConfirm = formData.get("newPasswordConfirm");

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return json(
      { errors: { form: "Utilisateur non trouvé." } },
      { status: 404 }
    );
  }

  const updateData: { email?: string; password?: string } = {};

  // Logique de mise à jour de l'email
  if (email && typeof email === "string" && email !== user.email) {
    if (!email.includes("@")) {
      return json(
        { errors: { email: "Format d'email invalide." } },
        { status: 400 }
      );
    }
    const existingUser = await prisma.user.findFirst({
      where: { email: email.toLowerCase(), id: { not: userId } },
    });
    if (existingUser) {
      return json(
        { errors: { email: "Cet email est déjà utilisé." } },
        { status: 400 }
      );
    }
    updateData.email = email.toLowerCase();
  }

  // Logique de mise à jour du mot de passe
  if (currentPassword || newPassword || newPasswordConfirm) {
    if (!currentPassword || !newPassword || !newPasswordConfirm) {
      return json(
        {
          errors: {
            form: "Veuillez remplir tous les champs pour changer le mot de passe.",
          },
        },
        { status: 400 }
      );
    }

    if (
      typeof currentPassword !== "string" ||
      typeof newPassword !== "string" ||
      typeof newPasswordConfirm !== "string"
    ) {
      return json(
        { errors: { form: "Format de mot de passe invalide." } },
        { status: 400 }
      );
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      return json(
        { errors: { currentPassword: "Mot de passe actuel incorrect." } },
        { status: 400 }
      );
    }
    if (newPassword !== newPasswordConfirm) {
      return json(
        {
          errors: {
            newPasswordConfirm:
              "Les nouveaux mots de passe ne correspondent pas.",
          },
        },
        { status: 400 }
      );
    }
    if (newPassword.length < 8) {
      return json(
        {
          errors: {
            newPassword:
              "Le nouveau mot de passe doit faire au moins 8 caractères.",
          },
        },
        { status: 400 }
      );
    }
    updateData.password = await bcrypt.hash(newPassword, 10);
  }

  if (Object.keys(updateData).length === 0) {
    return json({
      success: true,
      message: "Aucune modification n'a été soumise.",
    });
  }

  await prisma.user.update({
    where: { id: userId },
    data: updateData,
  });

  return json({ success: true, message: "Profil mis à jour avec succès !" });
}

export async function handleDeleteAccount(userId: number, formData: FormData) {
  const confirmPassword = formData.get("confirmPassword");

  if (typeof confirmPassword !== "string" || confirmPassword.length === 0) {
    return json(
      { errors: { confirmPassword: "Veuillez confirmer votre mot de passe." } },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    // Ne devrait jamais arriver si requireUserId est utilisé
    throw redirect("/login");
  }

  const isPasswordValid = await bcrypt.compare(confirmPassword, user.password);
  if (!isPasswordValid) {
    return json(
      { errors: { confirmPassword: "Mot de passe incorrect." } },
      { status: 400 }
    );
  }

  // Logique de suppression en cascade (déjà bonne dans votre code original)
  // ...
  await prisma.user.delete({ where: { id: userId } });

  // La suppression a réussi, on doit détruire la session.
  // On ne peut pas le faire directement ici, car on n'a pas la `request`.
  // L'action de la route `profile` retournera donc une redirection spéciale.
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(await getSession()),
    },
  });
}
