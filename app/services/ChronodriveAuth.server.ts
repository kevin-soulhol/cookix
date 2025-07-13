// app/services/ChronodriveAuth.server.ts

import {
  chromium,
  type Browser,
  type Page,
  type Response as PlaywrightResponse,
} from "playwright";
import type { Session } from "@remix-run/node";
import {
  CHRONODRIVE_CONFIG,
  SearchSuggestionsResponse,
} from "~/types/chronodrive.types";

const USER_CREDENTIALS = {
  email: process.env.CHRONODRIVE_EMAIL ?? "",
  password: process.env.CHRONODRIVE_PASSWORD ?? "",
};

/**
 * Un service pour s'authentifier et interagir avec l'API Chronodrive.
 * Il utilise la session Remix pour persister l'accessToken entre les requêtes.
 */
export class ChronodriveAuthService {
  private session: Session;

  constructor(session: Session) {
    this.session = session;
  }

  /**
   * Assure qu'un accessToken est disponible, en se connectant si nécessaire.
   * C'est le point d'entrée pour toute interaction avec l'API.
   * @private
   */
  private async ensureAuthenticated(): Promise<void> {
    if (this.session.has("accessToken")) {
      console.log("CHRONO_API: Utilisation du token de la session existante.");
      return;
    }

    console.log(
      "CHRONO_API: Pas de token en session, lancement du processus de connexion..."
    );
    await this.performLoginWithPlaywright();
  }

  /**
   * Exécute le flux de connexion complet via Playwright, en se basant sur la logique
   * de l'action qui a fonctionné.
   * @private
   */
  private async performLoginWithPlaywright(): Promise<void> {
    let browser: Browser | null = null;
    try {
      console.log(
        "CHRONO_AUTH: Lancement du navigateur Playwright (Chromium)..."
      );
      browser = await chromium.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      const context = await browser.newContext({ permissions: [] });
      const page = await context.newPage();

      let capturedToken: string | null = null;
      const tokenPromise = new Promise<void>((resolve, reject) => {
        page.on("response", async (response) => {
          if (
            response.url().includes("/oauth/token") &&
            response.request().method() === "POST"
          ) {
            try {
              const json = await response.json();
              if (json.access_token) {
                console.log("CHRONO_AUTH: Jeton d'accès intercepté !");
                capturedToken = json.access_token;
                resolve(); // La promesse est résolue dès que le token est trouvé
              }
            } catch (e) {
              /* Ignorer les erreurs de parsing */
            }
          }
        });
        // Ajouter un timeout à la promesse pour éviter qu'elle n'attende indéfiniment
        setTimeout(
          () =>
            reject(
              new Error("Timeout: Le token n'a pas été intercepté à temps.")
            ),
          45000
        );
      });

      await this.interactWithLoginPage(
        page,
        USER_CREDENTIALS.email,
        USER_CREDENTIALS.password
      );

      // Attendre que le token soit capturé
      await tokenPromise;

      if (capturedToken) {
        this.session.set("accessToken", capturedToken);
      } else {
        throw new Error(
          "Le processus de connexion s'est terminé mais aucun token n'a été capturé."
        );
      }
    } catch (error) {
      console.error("CHRONO_AUTH: Échec du processus de connexion.", error);
      throw error;
    } finally {
      if (browser) await browser.close();
    }
  }

  /**
   * Contient la séquence d'interactions (navigation, popups, remplissage, clic).
   * @param page - L'instance de la page Playwright.
   */
  private async interactWithLoginPage(
    page: Page,
    email: string,
    password: string
  ): Promise<void> {
    console.log("CHRONO_AUTH: Navigation vers la page de connexion...");
    await page.goto("https://www.chronodrive.com/login", {
      waitUntil: "networkidle",
    });

    // Gestion de la bannière de cookies
    try {
      const cookieButton = page.locator(
        "span.didomi-continue-without-agreeing"
      );
      await cookieButton.waitFor({ state: "visible", timeout: 5000 });
      await cookieButton.click();
      await page.waitForTimeout(500);
      console.log("CHRONO_AUTH: Bannière de cookies gérée.");
    } catch {
      console.log("CHRONO_AUTH: Pas de bannière de cookies détectée.");
    }

    // Suppression des pop-ups Vue.js potentiels
    try {
      await page.evaluate(() => {
        document.querySelector('div[id^="vue-portal-target"]')?.remove();
      });
      console.log("CHRONO_AUTH: Overlay de pop-up potentiel supprimé.");
    } catch {
      console.log("CHRONO_AUTH: Pas d'overlay de pop-up détecté.");
    }

    await page.waitForSelector("#login");
    console.log("CHRONO_AUTH: Remplissage du formulaire...");
    const emailXPath =
      "/html/body/div[2]/div/div/main/div/div/div/div[2]/div[1]/div/form/fieldset/div[1]/div/div/input";
    await page.locator(`xpath=${emailXPath}`).type(email);

    const passwordXPath =
      "/html/body/div[2]/div/div/main/div/div/div/div[2]/div[1]/div/form/fieldset/div[2]/div/div/input";
    await page.locator(`xpath=${passwordXPath}`).type(password);

    console.log("CHRONO_AUTH: Clic sur le bouton de soumission...");
    const buttonXPath =
      "/html/body/div[2]/div/div/main/div/div/div/div[2]/div[1]/div/form/fieldset/button";
    // `click()` attend automatiquement la navigation qui en résulte.
    await page.locator(`xpath=${buttonXPath}`).click();
    await page.waitForLoadState("networkidle");
    console.log("CHRONO_AUTH: Navigation après clic terminée.");
  }

  /**
   * Fait un appel authentifié à une API Chronodrive.
   * @param url - L'URL complète de l'endpoint à appeler.
   */
  private async fetchAuthenticatedApi(url: string): Promise<any> {
    await this.ensureAuthenticated();
    const accessToken = this.session.get("accessToken");

    const response = await fetch(url, {
      method: "GET",
      headers: {
        ...CHRONODRIVE_CONFIG.BASE_HEADERS,
        Authorization: `Bearer ${accessToken}`,
        "x-api-key": CHRONODRIVE_CONFIG.API_KEY,
      },
    });

    if (!response.ok) {
      if (response.status === 401 && this.session.has("accessToken")) {
        console.log(
          "CHRONO_API: Token probablement invalide (401). Invalidating session token."
        );
        this.session.unset("accessToken");
        // Relance une seule fois.
        //return await this.fetchAuthenticatedApi(url);
      }
      const errorBody = await response.text();
      throw new Error(
        `Erreur API Chronodrive: ${response.status} ${response.statusText}\n${errorBody}`
      );
    }
    return response.json();
  }

  /**
   * Recherche un produit sur l'API de Chronodrive.
   */
  public async searchProduct(
    query: string
  ): Promise<SearchSuggestionsResponse> {
    // Adapter le type de retour si nécessaire
    const url = `${
      CHRONODRIVE_CONFIG.BASE_API_URL
    }/v1/search-suggestions?searchTerm=${encodeURIComponent(query)}`;
    const response = await this.fetchAuthenticatedApi(url);
    console.log("________________________");
    console.log(response);
    return response;
  }
}
