/* eslint-disable @typescript-eslint/no-explicit-any */
// app/services/ChronodriveAuth.server.ts

import { chromium, type Browser, type Page } from "playwright-core";
import type { Session } from "@remix-run/node";
import {
  AddToCartPayload,
  CHRONODRIVE_CONFIG,
  SearchSuggestionsResponse,
} from "~/types/chronodrive.types";

const USER_CREDENTIALS = {
  email: process.env.CHRONODRIVE_EMAIL ?? "",
  password: process.env.CHRONODRIVE_PASSWORD ?? "",
};

const CHRONODRIVE_SITE_ID = "1034";

type ApiContext = "customer" | "search" | "cart";

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
        this.session.set("siteMode", "DRIVE");
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
  private async fetchAuthenticatedApi(
    url: string,
    contextType: ApiContext,
    options: RequestInit = {}
  ): Promise<any> {
    await this.ensureAuthenticated();
    const accessToken = this.session.get("accessToken");
    const cookieString = this.session.get("cookieString");

    const getApiKeyForUrl = (targetUrl: string): string => {
      if (targetUrl.includes("/search") || targetUrl.includes("/suggestions")) {
        return CHRONODRIVE_CONFIG.API_KEYS.SEARCH;
      }
      if (targetUrl.includes("/cart")) {
        return CHRONODRIVE_CONFIG.API_KEYS.CART;
      }
      if (targetUrl.includes("/customers/me")) {
        return CHRONODRIVE_CONFIG.API_KEYS.CUSTOMER;
      }
      // Par défaut, on peut utiliser une clé générique ou lever une erreur.
      console.warn(
        `[API Context] Contexte non détecté pour l'URL ${targetUrl}, utilisation de la clé par défaut (customer).`
      );
      return CHRONODRIVE_CONFIG.API_KEYS.CUSTOMER;
    };

    const apiKey = getApiKeyForUrl(url);

    // Construction des headers
    const headers: Record<string, string> = {
      ...CHRONODRIVE_CONFIG.BASE_HEADERS,
      Authorization: `Bearer ${accessToken}`,
      "x-api-key": apiKey,
      ...(cookieString && { Cookie: cookieString }),
      ...options.headers,
    };

    switch (contextType) {
      case "search":
        headers["x-api-key"] = CHRONODRIVE_CONFIG.API_KEYS.SEARCH;
        // La recherche nécessite le contexte du magasin
        headers["x-chronodrive-site-id"] =
          process.env.CHRONODRIVE_SITE_ID || CHRONODRIVE_SITE_ID;
        headers["x-chronodrive-site-mode"] =
          this.session.get("siteMode") || "DRIVE";
        break;
      case "cart":
        headers["x-api-key"] = CHRONODRIVE_CONFIG.API_KEYS.CART;
        // L'ajout au panier nécessite aussi le contexte du magasin
        headers["x-chronodrive-site-id"] =
          process.env.CHRONODRIVE_SITE_ID || CHRONODRIVE_SITE_ID;
        headers["x-chronodrive-site-mode"] =
          this.session.get("siteMode") || "DRIVE";
        break;
      case "customer":
        headers["x-api-key"] = CHRONODRIVE_CONFIG.API_KEYS.CUSTOMER;
        // Pas besoin des en-têtes de magasin pour le profil client
        break;
      default:
        throw new Error(`Contexte d'API inconnu: ${contextType}`);
    }

    // S'assurer que Content-Type est bien défini pour les requêtes POST/PUT
    if (options.body && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }

    const fetchOptions: RequestInit = {
      method: options.method || "GET",
      headers,
      body: options.body,
    };

    try {
      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        // Gestion du cas 401 : jeton invalide
        if (response.status === 401 && this.session.has("accessToken")) {
          console.warn(
            "CHRONO_API: Token probablement invalide (401). Suppression du token de session."
          );
          this.session.unset("accessToken");
          // Optionnel : relancer la requête une seule fois ici si souhaité
          return await this.fetchAuthenticatedApi(url, contextType, options);
        }

        // Lecture du corps d'erreur pour un message plus utile
        const errorBody = await response.text();
        throw new Error(
          `Erreur API Chronodrive: ${response.status} ${response.statusText}\n${errorBody}`
        );
      }

      // Tentative de parsing JSON, sinon retour brut
      try {
        return await response.json();
      } catch {
        return await response.text();
      }
    } catch (error) {
      // Logging ou reporting d’erreur ici si besoin
      console.error("Erreur lors de l'appel API :", error);
      throw error;
    }
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
    return await this.fetchAuthenticatedApi(url, "search");
  }

  /**
   * Ajoute des articles au panier Chronodrive.
   * @param cartId - L'ID du panier de l'utilisateur.
   * @param payload - Le corps de la requête contenant les articles.
   */
  public async addToCart(payload: AddToCartPayload): Promise<any> {
    const cartId = await this.getCart();
    const url = `${CHRONODRIVE_CONFIG.BASE_API_URL}/v1/carts/${cartId}/items`;

    // Cette méthode doit utiliser fetchAuthenticatedApi mais avec la méthode POST
    await this.ensureAuthenticated();

    const response = await this.fetchAuthenticatedApi(url, "cart", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    console.log("-----------------------------", response);
    return response;
  }

  private async getCart(): Promise<any> {
    const url = `${CHRONODRIVE_CONFIG.BASE_API_URL}/v1/customers/me/carts?withCoupons=true`;
    const response = await this.fetchAuthenticatedApi(url, "customer");
    return response.content[0].id;
  }

  public async getCustomerProfile(): Promise<any> {
    const url = `${CHRONODRIVE_CONFIG.BASE_API_URL}/v1/customers/me`;
    return await this.fetchAuthenticatedApi(url, "customer");
  }
}
