import { createCookieSessionStorage } from "@remix-run/node";

// Chargez le secret depuis vos variables d'environnement.
// C'est une longue chaîne de caractères aléatoire que vous devez garder secrète.
// Vous pouvez en générer une avec `openssl rand -base64 32` dans votre terminal.
const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  throw new Error(
    "La variable d'environnement SESSION_SECRET doit être définie."
  );
}

// Configuration du stockage de la session.
// Nous utilisons un cookie pour stocker les données de session.
export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      // Le nom du cookie stocké dans le navigateur.
      name: "__session",

      // Configuration de la sécurité du cookie.
      httpOnly: true, // Empêche l'accès au cookie via JavaScript côté client.
      path: "/", // Le cookie est valide pour l'ensemble du site.
      sameSite: "lax", // Protection contre les attaques CSRF.
      secrets: [sessionSecret], // La clé pour chiffrer et signer le cookie.
      secure: process.env.NODE_ENV === "production", // Le cookie ne sera envoyé que sur HTTPS en production.

      // Optionnel : définissez une durée de vie pour la session.
      // Par exemple, 7 jours.
      maxAge: 60 * 60 * 24 * 7,
    },
  });
