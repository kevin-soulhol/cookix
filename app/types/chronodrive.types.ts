// --- Configuration ---

// Il est VIVEMENT recommandé de stocker les secrets dans des variables d'environnement.
// Exemple : const PASSWORD = process.env.CHRONODRIVE_PASSWORD ?? '';
// L'opérateur ?? '' assure que la variable est de type string même si elle est undefined.
//const pass = "03XM&X2iH2!qA$";

export const CHRONODRIVE_CONFIG = {
  // Identifiants de l'application cliente
  CLIENT_ID: "DrJyWDmbpV6yYP8ndN8m",
  API_KEY: process.env.CHRONODRIVE_API_KEY ?? "",

  // URLs des endpoints
  BASE_IDENTITY_URL: "https://connect.chronodrive.com",
  BASE_API_URL: "https://api.chronodrive.com",

  // Paramètres OAuth statiques
  REDIRECT_URI: "https://www.chronodrive.com",
  SCOPE: "openid profile email phone full_write offline_access",

  // Paramètres PKCE statiques (devraient être dynamiques pour une sécurité maximale)
  CODE_CHALLENGE: "OsHjHqTqr8k34UdtniITqp5ZyFq5l680Lbcv5TN2Pmk",
  CODE_CHALLENGE_METHOD: "S256",
  CODE_VERIFIER: "Vj892m7rKTFoBGCJaW2F499aH7vFig2Mds4-t5MfCog",

  // En-têtes de base pour simuler un navigateur
  BASE_HEADERS: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
    Origin: "https://www.chronodrive.com",
    Referer: "https://www.chronodrive.com/",
    "x-chronodrive-site-id": "1034",
    "x-chronodrive-site-mode": "DRIVE",
  },
} as const; // 'as const' rend les propriétés readonly, ce qui est plus sûr.

// --- Interfaces TypeScript ---

// Les identifiants de connexion de l'utilisateur
export interface UserCredentials {
  email: string;
  password?: string; // Le mot de passe peut être optionnel si on utilise d'autres méthodes
}

// Réponse de l'API de login initial
export interface InitialTokenResponse {
  tkn: string;
  // Ajoutez d'autres champs si nécessaire
}

// L'objet envoyé via postMessage
export interface AuthCodeResponse {
  type: "authorization_response";
  response: {
    code: string;
  };
}

// Réponse de l'API /oauth/token
export interface AccessTokenResponse {
  access_token: string;
  id_token: string;
  refresh_token: string;
  token_type: "Bearer";
  expires_in: number;
  scope: string;
}

// Structure de l'objet utilisateur (à adapter selon la réponse réelle de l'API)
export interface UserProfile {
  customer_id: string;
  civility: string;
  firstname: string;
  lastname: string;
  email: string;
  phone_number: string;
  birthdate?: string; // Optionnel
  // ... ajoutez d'autres champs de l'objet utilisateur ici
}

export interface ProductSearchResult {
  id: string;
  isEligible: boolean;
  packType: "NONE" | "PACK"; // Et potentiellement d'autres valeurs

  // Champs complexes (objets)
  characteristics: ProductCharacteristics;
  prices: ProductPriceInfo;
  images: ProductImageInfo;
  packaging: ProductPackaging;
  flags: ProductFlags;

  // Champs optionnels ou qui peuvent être des objets vides
  animation?: Record<string, any>; // Objet avec structure inconnue, peut être vide.
  descriptions?: Record<string, string>; // ex: { "legal": "...", "marketing": "..." }
  labels?: Record<string, any>;

  // Champs de stock
  stock: "HIGH_STOCK" | "MEDIUM_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
  remainingStock: number;
  maxCartQuantity: number;

  // Champs relationnels (tableaux)
  complementaryProducts: string[]; // Probablement des IDs de produits
  substitutionProducts: string[]; // Probablement des IDs de produits
  productsInPack: string[]; // Probablement des IDs de produits
  masterCategories: string[]; // Probablement des IDs de catégories
  eans: string[];

  // Champs de tracking
  trackingCode: string;
}

// Réponse de l'API de recherche
export interface SearchSuggestionsResponse {
  keywords: string[];
  products: ProductSearchResult[];
  categories: any[]; // Le type est inconnu, on le laisse en 'any' pour l'instant
}

/**
 * Représente les informations sur les prix d'un produit.
 */
export interface ProductPriceInfo {
  // Le prix final affiché à l'utilisateur.
  sellingPrice: {
    amount: number; // en centimes
    currency: string; // ex: "EUR"
  };
  // Le prix à l'unité de mesure (ex: prix au kilo).
  unitPrice?: {
    amount: number;
    currency: string;
    unit: string; // ex: "KGM" pour kilogramme
  };
  // Le prix barré en cas de promotion.
  strikeThroughPrice?: {
    amount: number;
    currency: string;
  };
  // Autres champs de prix possibles...
}

/**
 * Représente les différentes images associées à un produit.
 */
export interface ProductImageInfo {
  // L'URL de l'image principale.
  main: string;
  // D'autres tailles ou vues pourraient être disponibles.
  thumbnail?: string;
  large?: string;
}

/**
 * Représente les caractéristiques d'un produit (marque, nom, etc.).
 */
export interface ProductCharacteristics {
  brand?: string;
  fullName: string;
  shortName?: string;
  // ... autres caractéristiques
}

/**
 * Représente le format d'emballage du produit.
 */
export interface ProductPackaging {
  unit: string; // ex: "KGM", "PCE" (pièce), "L"
  quantity: number;
  consumerInformation: string; // ex: "Le sachet de 1kg"
}

/**
 * Représente les "drapeaux" ou badges sur un produit (bio, promo, etc.).
 */
export interface ProductFlags {
  isOrganic?: boolean;
  isPromo?: boolean;
  isNew?: boolean;
  // ... autres drapeaux
}
