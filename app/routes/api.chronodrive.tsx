import { redirect } from '@remix-run/react';
import { UserCredentials, UserProfile } from '~/types/chronodrive.types';
import ChronodriveAPIClient from '~/utils/ChronodriveAPIClient';
import { commitSession, getSession } from './session.server';
import { ActionFunctionArgs } from '@remix-run/node';
import { chromium } from 'playwright-core';

// Les identifiants devraient provenir de variables d'environnement ou d'une source sécurisée
const USER_CREDENTIALS: UserCredentials = {
    email: process.env.CHRONODRIVE_EMAIL ?? '',
    password: process.env.CHRONODRIVE_PASSWORD ?? '',
};

// Le type de retour du loader pour une meilleure autocomplétion
type LoaderData = {
    user?: UserProfile;
    error?: string;
};

export async function action({ request }: ActionFunctionArgs) {
    console.log(
        "LOGIN ACTION: Début du processus de connexion via Playwright."
    );
    const session = await getSession(request.headers.get("Cookie"));
    const formData = await request.formData();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    let browser = null;
    try {
        console.log(
            "LOGIN ACTION: Lancement du navigateur Playwright (Chromium)..."
        );
        browser = await chromium.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });

        // Avec Playwright, on crée un "contexte" pour isoler la session et définir les permissions.
        const context = await browser.newContext({
            // On refuse explicitement la permission de géolocalisation pour l'origine de Chronodrive.
            permissions: [],
        });
        await context.grantPermissions([], {
            origin: "https://www.chronodrive.com",
        });
        console.log(
            "LOGIN ACTION: Permissions de géolocalisation préventivement refusées."
        );

        const page = await context.newPage();

        let accessToken: string | null = null;
        page.on("response", async (response) => {
            const req = response.request();
            if (req.url().includes("/oauth/token") && req.method() === "POST") {
                try {
                    const json = await response.json();
                    if (json.access_token) {
                        console.log("LOGIN ACTION: Jeton d'accès intercepté !");
                        accessToken = json.access_token;
                    }
                } catch (e) {
                    // On ignore les erreurs de parsing JSON.
                }
            }
        });

        console.log("LOGIN ACTION: Navigation vers la page de connexion...");
        // `waitUntil: 'networkidle'` attend que le réseau soit inactif, assurant que la page est chargée.
        await page.goto("https://www.chronodrive.com/login", {
            waitUntil: "networkidle",
        });

        // Étape 1 : Gestion de la bannière de cookies Didomi.
        try {
            console.log("LOGIN ACTION: Recherche de la bannière de cookies...");
            const cookieButton = page.locator(
                "span.didomi-continue-without-agreeing"
            );
            await cookieButton.waitFor({ state: "visible", timeout: 5000 });
            console.log("LOGIN ACTION: Clic sur 'Continuer sans accepter'.");
            await cookieButton.click();
            // On attend un instant que l'animation de la bannière se termine.
            await page.waitForTimeout(500);
        } catch (e) {
            console.log(
                "LOGIN ACTION: Pas de bannière de cookies détectée ou erreur lors de sa fermeture."
            );
        }

        // Étape 2 : Suppression du portail Vue qui peut contenir des pop-ups.
        // Cette approche est plus robuste que de cliquer sur un bouton de fermeture.
        try {
            console.log(
                "LOGIN ACTION: Recherche et suppression du conteneur de pop-up Vue..."
            );
            // On exécute un script directement dans la page pour trouver et supprimer l'élément.
            // Le sélecteur `[id^="vue-portal-target"]` cible n'importe quel élément dont l'id commence
            // par "vue-portal-target", ce qui gère les identifiants dynamiques.
            await page.evaluate(() => {
                const portal = document.querySelector('div[id^="vue-portal-target"]');
                if (portal) {
                    portal.remove();
                }
            });
            console.log(
                "LOGIN ACTION: Conteneur de pop-up potentiellement supprimé."
            );
            await page.waitForTimeout(250); // Courte pause pour laisser le DOM se stabiliser.
        } catch (e) {
            console.log(
                "LOGIN ACTION: Pas de conteneur de pop-up Vue détecté ou erreur lors de sa suppression."
            );
        }

        await page.waitForSelector("#login");
        console.log("LOGIN ACTION: Remplissage du formulaire avec les XPath.");

        const emailXPath =
            "/html/body/div[2]/div/div/main/div/div/div/div[2]/div[1]/div/form/fieldset/div[1]/div/div/input";
        // `page.locator` est la méthode moderne de Playwright pour cibler des éléments.
        // On peut lui passer directement un sélecteur XPath. `type` simule la saisie.
        await page.locator(`xpath=${emailXPath}`).type(email);

        const passwordXPath =
            "/html/body/div[2]/div/div/main/div/div/div/div[2]/div[1]/div/form/fieldset/div[2]/div/div/input";
        await page.locator(`xpath=${passwordXPath}`).type(password);

        console.log("LOGIN ACTION: Clic sur le bouton de connexion.");
        const buttonXPath =
            "/html/body/div[2]/div/div/main/div/div/div/div[2]/div[1]/div/form/fieldset/button";

        // Les actions de Playwright comme `click` attendent automatiquement la navigation qui en résulte.
        // Cela simplifie grandement le code par rapport à Puppeteer.
        await page.locator(`xpath=${buttonXPath}`).click();

        // On s'assure que la navigation est bien terminée et que la page est stable.
        await page.waitForLoadState("networkidle");
        console.log("LOGIN ACTION: Navigation après connexion terminée.");

        await browser.close();

        if (!accessToken) {
            console.error(
                "LOGIN ACTION: Echec, impossible de récupérer le jeton d'accès après la connexion."
            );
            return {
                error: "Impossible de récupérer le jeton d'accès après la connexion.",
            };
        }

        console.log("LOGIN ACTION: Connexion réussie, jeton d'accès obtenu.");
        session.set("accessToken", accessToken);

        return redirect("/profile", {
            headers: { "Set-Cookie": await commitSession(session) },
        });
    } catch (error) {
        console.error(
            "LOGIN ACTION: Une erreur est survenue avec Playwright.",
            error
        );
        if (browser) await browser.close();
        if (error instanceof Error) {
            return { error: error.message };
        }
        return {
            error:
                "An unknown error occurred during the browser automation process.",
        };
    }
}

export async function loader(): Promise<LoaderData> { // Ou `Promise<Response>` si vous utilisez `json()`
    console.log("Démarrage du flux d'authentification Chronodrive...");

    if (!USER_CREDENTIALS.email || !USER_CREDENTIALS.password) {
        console.error("Les identifiants CHRONODRIVE_EMAIL et CHRONODRIVE_PASSWORD doivent être définis.");
        return { error: "Configuration du serveur incomplète." };
    }

    const client = new ChronodriveAPIClient(USER_CREDENTIALS);

    try {
        const user = await client.authenticateAndFetchUser();
        console.log("SUCCÈS ! Utilisateur récupéré :");
        console.log(user);

        return { user };
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Une erreur inconnue est survenue";
        console.error("Échec du flux d'authentification :");
        console.error(errorMessage);

        // throw new Response(errorMessage, { status: 500 });
        return { error: errorMessage };
    }
}