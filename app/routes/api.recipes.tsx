import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { prisma } from "~/utils/db.server";
import { getUserId } from "./api.user";

/**
 * Normalise un texte en retirant les accents et en convertissant en minuscules
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * Calcule la similarité entre deux chaînes (détecte les termes partiels)
 * Renvoie un score entre 0 et 1
 */
function calculateStringSimilarity(str1: string, str2: string): number {
  // Normaliser les chaînes
  const s1 = normalizeText(str1);
  const s2 = normalizeText(str2);

  // Si l'un contient complètement l'autre, forte similarité
  if (s1.includes(s2) || s2.includes(s1)) {
    const ratio = Math.min(s1.length, s2.length) / Math.max(s1.length, s2.length);
    return 0.7 + (ratio * 0.3); // Au moins 0.7, plus un bonus selon le ratio de longueur
  }

  // Recherche de similarité partielle (mots tronqués comme "oigno" pour "oignon")
  const words1 = s1.split(/\s+/);
  const words2 = s2.split(/\s+/);

  let matchCount = 0;
  let totalWords = words1.length;

  for (const word1 of words1) {
    if (word1.length < 3) continue; // Ignorer les mots très courts

    for (const word2 of words2) {
      if (word2.length < 3) continue;

      // Si un mot contient au moins 70% d'un autre mot (pour les mots tronqués)
      if (word1.includes(word2) || word2.includes(word1)) {
        const matchLength = Math.min(word1.length, word2.length);
        const maxLength = Math.max(word1.length, word2.length);
        if (matchLength / maxLength > 0.6) { // Au moins 60% de correspondance
          matchCount++;
          break;
        }
      }

      // Distance maximale autorisée (1 pour les mots courts, plus pour les mots longs)
      const maxDistance = Math.max(1, Math.floor(Math.min(word1.length, word2.length) / 4));

      // Calcul simple de la distance d'édition (Levenshtein simplifiée)
      if (levenshteinDistance(word1, word2) <= maxDistance) {
        matchCount++;
        break;
      }
    }
  }

  return matchCount / totalWords;
}

/**
 * Calcule une distance de Levenshtein simplifiée entre deux chaînes
 * (Nombre minimal d'opérations pour transformer une chaîne en une autre)
 */
function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;

  // Cas de base: l'une des chaînes est vide
  if (m === 0) return n;
  if (n === 0) return m;

  // Matrice pour la programmation dynamique
  const d: number[][] = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));

  // Initialiser la première colonne et la première ligne
  for (let i = 0; i <= m; i++) d[i][0] = i;
  for (let j = 0; j <= n; j++) d[0][j] = j;

  // Remplir la matrice
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      d[i][j] = Math.min(
        d[i - 1][j] + 1,      // suppression
        d[i][j - 1] + 1,      // insertion
        d[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return d[m][n];
}

/**
 * Calcule le score de pertinence d'une recette par rapport à un terme de recherche
 */
function calculateRelevanceScore(recipe: any, searchTerms: string[], fullSearch: string): number {
  let score = 0;
  const recipeTitle = normalizeText(recipe.title || '');
  const recipeDescription = normalizeText(recipe.description || '');

  // Vérifier la correspondance complète de la recherche
  const similarity = calculateStringSimilarity(fullSearch, recipeTitle);
  score += similarity * 100; // Max 100 points pour une correspondance parfaite

  // Analyser les ingrédients si disponibles
  if (recipe.ingredients && recipe.ingredients.length) {
    for (const ingredient of recipe.ingredients) {
      const ingredientName = normalizeText(ingredient.ingredient.name || '');
      for (const term of searchTerms) {
        const termSimilarity = calculateStringSimilarity(term, ingredientName);
        if (termSimilarity > 0.7) { // Forte similarité avec un ingrédient
          score += 25;
          break;
        } else if (termSimilarity > 0.5) { // Similarité moyenne
          score += 15;
          break;
        }
      }
    }
  }

  // Vérifier chaque terme individuellement
  for (const term of searchTerms) {
    // Similarité avec le titre
    const titleSimilarity = calculateStringSimilarity(term, recipeTitle);
    score += titleSimilarity * 50; // Max 50 points par terme

    // Mots exacts ou partiels dans le titre
    const words = recipeTitle.split(/\s+/);
    for (const word of words) {
      if (word.length < 3) continue;

      const wordSimilarity = calculateStringSimilarity(term, word);
      if (wordSimilarity > 0.8) {
        score += 20; // Mot très similaire
        break;
      } else if (wordSimilarity > 0.6) {
        score += 10; // Mot partiellement similaire
        break;
      }
    }

    // Similarité avec la description (moins importante)
    const descSimilarity = calculateStringSimilarity(term, recipeDescription);
    score += descSimilarity * 20; // Max 20 points par terme
  }

  // Bonus pour les recettes bien notées (si pertinentes)
  if (score > 0 && recipe.note) {
    score += Math.min(recipe.note, 5) * 3;  // Max +15 points pour une note de 5
  }

  return score;
}

/**
 * Extraire les termes de recherche significatifs
 */
function extractSearchTerms(search: string): string[] {
  // Diviser en mots et filtrer les mots courts ou vides
  return search
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(term => term.length > 2)
    .filter(term => !["les", "des", "est", "aux", "aux", "est", "son", "sur", "ile", "par", "las", "une", "que", "qui", "pour", "dans", "avec", "sans", "mais", "pour", "sous", "sur", "chez", "bon", "foi", "bio"].includes(term));
}

/**
 * Loader pour récupérer les recettes
 */
export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const userId = await getUserId(request);

  // Paramètres de requête
  const id = url.searchParams.get("id");
  const search = url.searchParams.get("search");
  const difficulty = url.searchParams.get("difficulty");
  const categoryId = url.searchParams.get("categoryId");
  const mealType = url.searchParams.get("mealType");
  const maxPreparationTime = url.searchParams.get("maxPreparationTime");
  const sort = url.searchParams.get("sort") || "title";
  const dir = url.searchParams.get("dir") || "asc";
  const limit = url.searchParams.get("limit") ? parseInt(url.searchParams.get("limit") as string) : 50;
  const offset = url.searchParams.get("offset") ? parseInt(url.searchParams.get("offset") as string) : 0;
  const random = url.searchParams.get("random") === "true";
  const diversityLevel = url.searchParams.get("diversity") || "medium";

  try {
    // Cas 1: Recherche d'une recette spécifique par ID
    if (id) {
      return await getRecipeById(parseInt(id), userId);
    }

    // Cas 2: Recherche de recettes avec filtres
    const where: any = buildWhereClause(search, difficulty, categoryId, mealType, maxPreparationTime);

    // Compter le nombre total de recettes (pour la pagination)
    const totalRecipes = await prisma.recipe.count({ where });

    // Si recherche textuelle, utiliser système de score amélioré
    if (search && search.trim().length > 0) {
      return await getRecipesBySearch(where, search, userId, limit, offset);
    }

    // Si pas de recherche textuelle, utiliser le tri standard ou aléatoire
    return await getRecipesByFilters(where, sort, dir, random, diversityLevel, userId, limit, offset, totalRecipes);

  } catch (error) {
    console.error("Erreur lors de la récupération des recettes:", error);
    return json(
      { success: false, message: "Une erreur est survenue lors de la récupération des recettes" },
      { status: 500 }
    );
  }
}

/**
 * Récupère une recette par son ID
 */
async function getRecipeById(recipeId: number, userId: number | null) {
  const includeObj: any = {
    steps: {
      orderBy: {
        stepNumber: 'asc'
      }
    },
    ingredients: {
      include: {
        ingredient: true
      }
    }
  };

  // N'inclure favorites que si userId existe
  if (userId) {
    includeObj.favorites = {
      where: { userId },
      select: { id: true }
    };
    includeObj.menuItems = {
      where: {
        menu: { userId }
      },
      select: { id: true }
    };
  }

  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
    include: includeObj
  });

  if (!recipe) {
    return json({ success: false, message: "Recette non trouvée" }, { status: 404 });
  }

  // Transformer les données pour faciliter leur utilisation côté client
  const transformedRecipe = {
    ...recipe,
    isFavorite: !!recipe.favorites?.length,
    isInMenu: !!(recipe.menuItems?.length && userId),
  };

  // Supprimer les données de relation brutes
  delete transformedRecipe.favorites;
  delete transformedRecipe.menuItems;

  return json({ success: true, recipe: transformedRecipe });
}

/**
 * Construit la clause WHERE pour Prisma
 */
function buildWhereClause(search: string | null, difficulty: string | null, categoryId: string | null,
  mealType: string | null, maxPreparationTime: string | null): any {
  const where: any = {};

  // Pour la recherche textuelle, utiliser une approche très inclusive
  // La filtration avancée sera faite après récupération des données
  if (search) {
    const searchTerms = extractSearchTerms(search);
    const searchPattern = searchTerms
      .map(term => term.length >= 4 ? term.substring(0, term.length - 1) : term) // Tronquer légèrement pour augmenter les correspondances
      .join("|");

    if (searchTerms.length > 0) {
      // Utiliser OR pour être plus inclusif
      where.OR = [
        // Rechercher dans le titre avec expressions régulières si possible
        { title: { contains: search.toLowerCase() } },
        // Rechercher dans la description
        { description: { contains: search.toLowerCase() } },
        // Rechercher chaque terme séparément pour plus de flexibilité
        ...searchTerms.map(term => ({ title: { contains: term } })),
        ...searchTerms.map(term => ({ description: { contains: term } }))
      ];
    }
  }

  // Filtre par difficulté
  if (difficulty) {
    where.difficulty = difficulty;
  }

  // Filtre par catégorie
  if (categoryId) {
    where.categoryId = parseInt(categoryId);
  }

  // Filtre par type de repas
  if (mealType) {
    where.meals = {
      some: {
        meal: {
          title: { equals: mealType }
        }
      }
    };
  }

  // Filtre par temps de préparation maximum
  if (maxPreparationTime) {
    where.preparationTime = {
      lte: parseInt(maxPreparationTime)
    };
  }

  return where;
}

/**
 * Récupère les recettes par recherche textuelle avec système de score avancé
 */
async function getRecipesBySearch(where: any, search: string, userId: number | null, limit: number, offset: number) {
  // Pour une recherche efficace, récupérer plus de résultats que nécessaire
  // pour avoir une bonne base avant d'appliquer notre algorithme de pertinence
  const recipes = await prisma.recipe.findMany({
    where,
    take: limit * 8, // Récupérer beaucoup plus pour avoir un bon pool de candidats
    include: {
      // Inclure les ingrédients pour améliorer la recherche
      ingredients: {
        include: {
          ingredient: true
        }
      },
      ...(userId ? {
        favorites: {
          where: { userId },
          select: { id: true }
        },
        menuItems: {
          where: {
            menu: { userId }
          },
          select: { id: true }
        }
      } : {})
    }
  });

  const searchTerms = extractSearchTerms(search);
  const normalizedSearch = normalizeText(search);

  // Si aucun terme significatif, utiliser la recherche brute
  if (searchTerms.length === 0 && normalizedSearch.length > 2) {
    searchTerms.push(normalizedSearch);
  }

  // Calculer un score de pertinence pour chaque recette
  const scoredRecipes = recipes.map(recipe => {
    const score = calculateRelevanceScore(recipe, searchTerms, normalizedSearch);
    return { ...recipe, searchScore: score };
  });

  // Trier les recettes par score de pertinence décroissant
  scoredRecipes.sort((a, b) => b.searchScore - a.searchScore);

  // Filtrer par score minimal (ajusté plus bas pour être plus inclusif)
  // Plus de termes = score minimal plus élevé
  const minScore = Math.max(5, searchTerms.length * 3);
  const filteredRecipes = scoredRecipes.filter(recipe => recipe.searchScore >= minScore);

  // Appliquer la pagination sur les résultats filtrés
  const paginatedRecipes = filteredRecipes.slice(offset, offset + limit);

  // Transformer pour le client
  const transformedRecipes = paginatedRecipes.map(recipe => ({
    ...recipe,
    isFavorite: !!recipe.favorites?.length,
    isInMenu: !!(recipe.menuItems?.length && userId),
    favorites: undefined,
    menuItems: undefined,
    ingredients: undefined, // Ne pas renvoyer les ingrédients détaillés dans les résultats de recherche
    searchScore: undefined,
  }));

  return json({
    success: true,
    recipes: transformedRecipes,
    pagination: {
      total: filteredRecipes.length,
      limit,
      offset
    }
  });
}

/**
 * Récupère les recettes par filtres non textuels
 */
async function getRecipesByFilters(where: any, sort: string, dir: string, random: boolean,
  diversityLevel: string, userId: number | null,
  limit: number, offset: number, totalRecipes: number) {
  // Tri standard
  const orderBy = { [sort]: dir };

  const recipes = await prisma.recipe.findMany({
    where,
    orderBy,
    take: limit,
    skip: offset,
    select: {
      id: true,
      title: true,
      categoryId: true,
      preparationTime: true,
      cookingTime: true,
      servings: true,
      difficulty: true,
      note: true,
      imageUrl: true,
      sourceUrl: true,
      description: true,
      createdAt: true,
      updatedAt: true,
      voteNumber: true,
      ...(userId ? {
        favorites: {
          where: { userId },
          select: { id: true }
        },
        menuItems: {
          where: {
            menu: { userId }
          },
          select: { id: true }
        }
      } : {})
    }
  });

  // Appliquer la randomisation si demandée
  if (random) {
    shuffleRecipesByDiversity(recipes, diversityLevel);
  }

  // Transformer les données pour le client
  const transformedRecipes = recipes.map(recipe => ({
    ...recipe,
    isFavorite: !!recipe.favorites?.length,
    isInMenu: !!(recipe.menuItems?.length && userId),
    favorites: undefined,
    menuItems: undefined,
  }));

  return json({
    success: true,
    recipes: transformedRecipes,
    pagination: {
      total: totalRecipes,
      limit,
      offset
    }
  });
}

/**
 * Mélange les recettes selon le niveau de diversité choisi
 */
function shuffleRecipesByDiversity(recipes: any[], diversityLevel: string) {
  let RATING_WEIGHT, VOTE_COUNT_WEIGHT, RANDOM_WEIGHT;

  switch (diversityLevel) {
    case "low":
      RATING_WEIGHT = 0.7;
      VOTE_COUNT_WEIGHT = 0.25;
      RANDOM_WEIGHT = 0.05;
      break;
    case "high":
      RATING_WEIGHT = 0.4;
      VOTE_COUNT_WEIGHT = 0.1;
      RANDOM_WEIGHT = 0.5;
      break;
    case "medium":
    default:
      RATING_WEIGHT = 0.6;
      VOTE_COUNT_WEIGHT = 0.2;
      RANDOM_WEIGHT = 0.2;
      break;
  }

  const maxVoteCount = Math.max(...recipes.map(r => r.voteNumber || 0));
  const maxRating = 5;

  const calculateScore = (recipe: any) => {
    const rating = recipe.note || 0;
    const voteCount = recipe.voteNumber || 0;
    const normalizedVoteCount = maxVoteCount > 0
      ? Math.tanh(voteCount / (maxVoteCount * 0.25))
      : 0;
    const normalizedRating = rating / maxRating;
    const randomFactor = Math.random();

    return (normalizedRating * RATING_WEIGHT) +
      (normalizedVoteCount * VOTE_COUNT_WEIGHT) +
      (randomFactor * RANDOM_WEIGHT);
  };

  recipes.sort((a, b) => {
    const scoreA = calculateScore(a);
    const scoreB = calculateScore(b);
    return scoreB - scoreA;
  });
}

/**
 * Action pour gérer les opérations CRUD sur les recettes
 */
export async function action({ request }: ActionFunctionArgs) {
  const url = new URL(request.url);
  const path = url.pathname.split('/').pop();

  try {
    // Cas: Recherche par catégories
    if (path === "categories") {
      return await getCategories();
    }

    // Méthode non prise en charge
    return json({
      success: false,
      message: "Méthode non prise en charge"
    }, { status: 405 });

  } catch (error) {
    console.error("Erreur lors de la gestion des recettes:", error);
    return json(
      { success: false, message: "Une erreur est survenue lors de la gestion des recettes" },
      { status: 500 }
    );
  }
}

/**
 * Récupère toutes les catégories
 */
async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { title: 'asc' }
    });

    return json({
      success: true,
      categories
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories:", error);
    return json(
      { success: false, message: "Une erreur est survenue lors de la récupération des catégories" },
      { status: 500 }
    );
  }
}