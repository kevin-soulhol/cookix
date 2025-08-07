/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { GoogleGenAI } from '@google/genai';
import { prisma } from "~/utils/db.server";
import { getUserId } from "./api.user";
import { Ingredient, Recipe, RecipeIngredient, RecipeStep } from "@prisma/client";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export type RecipeType = Recipe & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  favorites?: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  menuItems?: any[];
}

export type RecipeWithRelations = RecipeType & {
  ingredients?: (RecipeIngredient & { ingredient: Ingredient })[];
  steps?: RecipeStep[];
  isFavorite?: boolean;
  isInMenu?: boolean;
};

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
  const totalWords = words1.length;

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
 * FCalcule le score de pertinence d'une recette par rapport à son vote et aux nombres de vote
 */
function calculateRelevanceScoreByRating(recipe: any): number {
  // Seuil de confiance minimal (nombre de votes considéré comme significatif)
  const CONFIDENCE_THRESHOLD = 4000;
  // Seuil bas de votes (en dessous duquel les recettes sont fortement pénalisées)
  const LOW_VOTES_THRESHOLD = 10;
  // Seuil élevé pour considérer qu'une recette a beaucoup de votes
  const HIGH_VOTES_THRESHOLD = 2000;
  // Seuil pour les notes excellentes (4.5/5 et plus)
  const EXCELLENT_RATING_THRESHOLD = 4.5;

  const rating = parseFloat(recipe.note) || 0;
  const votes = parseInt(recipe.voteNumber) || 0;

  // Normaliser la note sur une échelle de 0 à 1
  const normalizedRating = rating / 5;

  // Pénalité spéciale pour les recettes avec très peu de votes
  let lowVotesPenalty = 0;
  if (votes < LOW_VOTES_THRESHOLD) {
    // Appliquer une pénalité sévère qui diminue progressivement jusqu'au seuil
    // Cette formule donne une pénalité de 0.4 pour 0 vote, et qui diminue vers 0 à mesure qu'on approche du seuil
    lowVotesPenalty = 0, 4 * (1 - votes / LOW_VOTES_THRESHOLD);
  }

  // Calculer un facteur de confiance basé sur le nombre de votes
  // Ce facteur tend vers 1 quand le nombre de votes augmente
  const confidenceFactor = votes / (votes + CONFIDENCE_THRESHOLD);

  // Ajuster la note en fonction du nombre de votes
  // Une note avec peu de votes sera tirée vers la moyenne (0.5)
  const adjustedRating = confidenceFactor * normalizedRating + (1 - confidenceFactor) * 0.5;

  // Ajouter un bonus pour les recettes avec beaucoup de votes
  // Ce bonus est significatif seulement pour les recettes bien notées
  let votesBonus = normalizedRating > 0.7 ?
    Math.log10(1 + votes / 10) * 0.05 : 0;

  // Bonus supplémentaire pour les notes excellentes avec beaucoup de votes
  if (rating >= EXCELLENT_RATING_THRESHOLD) {
    // Intensifier l'impact du nombre de votes pour les excellentes notes
    // Cette formule crée une différence substantielle entre 100 et 1000+ votes
    const excellenceBonus = Math.min(0.2, Math.log10(votes / HIGH_VOTES_THRESHOLD) * 0.1);

    // N'appliquer ce bonus que si le nombre de votes dépasse le seuil élevé
    if (votes > HIGH_VOTES_THRESHOLD) {
      votesBonus += excellenceBonus;
    }
  }

  // Stocker pour le débogage
  recipe._rating = rating;
  recipe._votes = votes;
  recipe._adjustedRating = adjustedRating;
  recipe._votesBonus = votesBonus;

  // Score final combinant note ajustée et bonus de votes
  return adjustedRating + votesBonus - lowVotesPenalty;
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
  const sort = url.searchParams.get("sort") || "note";
  const dir = url.searchParams.get("dir") || "asc";
  const limit = url.searchParams.get("limit") ? parseInt(url.searchParams.get("limit") as string) : 50;
  const offset = url.searchParams.get("offset") ? parseInt(url.searchParams.get("offset") as string) : 0;
  const random = url.searchParams.get("random") === "true";
  const onlyVege = url.searchParams.get("onlyVege") === "true";
  const forBaby = url.searchParams.get("forBaby") === "true";
  const seasonal = url.searchParams.get("seasonal") === "true";
  const diversityLevel = url.searchParams.get("diversity") || "medium";

  try {
    // Cas 1: Recherche d'une recette spécifique par ID
    if (id) {
      return await getRecipeById(parseInt(id), userId);
    }

    // Cas 2: Recherche de recettes avec filtres
    const where: any = buildWhereClause(search, difficulty, categoryId, mealType, maxPreparationTime, onlyVege, forBaby, seasonal);

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

    // En mode production, on veut une erreur générique
    const errorMessage = process.env.NODE_ENV === 'production'
      ? "Une erreur est survenue lors de la récupération des recettes"
      : (error as Error).message; // En dev/test, on veut le vrai message d'erreur

    return json(
      {
        // Ajoutons la clé "error" à la réponse principale pour que ce soit cohérent avec ce que vous avez vu
        error: errorMessage,
        success: false,
        message: errorMessage, // Gardons `message` pour la rétrocompatibilité
        trace: error
      },
      // Retourner 500 n'est peut-être pas idéal pour le débogage, mais gardons-le pour l'instant
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
        ingredient: {
          include: {
            seasonInfo: true
          }
        }
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
  }) as RecipeWithRelations;

  if (!recipe) {
    return json({ success: false, message: "Recette non trouvée" }, { status: 404 });
  }

  // Obtenir le mois actuel pour déterminer la saisonnalité
  const currentDate = new Date();
  const currentMonth = process.env.NODE_ENV === "production" ? currentDate.toLocaleString('en-US', { month: 'long' }).toLowerCase() : 'april';

  // Transformer les données pour faciliter leur utilisation côté client
  const transformedRecipe = {
    ...recipe,
    isFavorite: !!recipe.favorites?.length,
    isInMenu: !!(recipe.menuItems?.length && userId),
    ingredients: recipe.ingredients?.map(item => {
      // @ts-expect-error error with Prisma schema
      const seasonInfo = item.ingredient.seasonInfo;
      const isInSeason = seasonInfo ?
        (seasonInfo.isPerennial || seasonInfo[currentMonth]) :
        true; // Par défaut, considérer comme pérenne si pas d'info

      return {
        ...item,
        isInSeason,
        isPermanent: seasonInfo?.isPerennial || false,
        isFruit: seasonInfo?.isFruit || false,
        isVegetable: seasonInfo?.isVegetable || false,
        // Enlever les infos de saisonnalité complètes pour alléger la réponse
        ingredient: {
          id: item.ingredient.id,
          name: item.ingredient.name
        }
      };
    })
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
  mealType: string | null, maxPreparationTime: string | null, onlyVege: boolean | null, forBaby: boolean | null, seasonal: boolean | null): any {
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
        { title: { contains: searchPattern.toLowerCase() } },
        // Rechercher dans la description
        { description: { contains: searchPattern.toLowerCase() } },
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

  // Filtre par difficulté
  if (onlyVege) {
    where.isVege = true;
  }

  // Filtre par difficulté
  if (forBaby) {
    where.isBabyFood = true;
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

  //filtre par saisonnalité
  if (seasonal) {
    // Obtenir le mois actuel
    const currentDate = new Date();
    const currentMonth = process.env.NODE_ENV === "production" ? currentDate.toLocaleString('en-US', { month: 'long' }).toLowerCase() : 'april';



    // Nous voulons les recettes où TOUS les ingrédients sont soit pérennes, soit de saison
    where.ingredients = {
      every: {
        ingredient: {
          seasonInfo: {
            OR: [
              { isPerennial: true }, // Ingrédient pérenne
              { [currentMonth]: true } // Ingrédient de saison pour le mois actuel
            ]
          }
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
  let notedRecipes = recipes.map(recipe => {
    return { ...recipe, searchScore: calculateRelevanceScore(recipe, searchTerms, normalizedSearch) };
  });

  notedRecipes = notedRecipes.map(recipe => {
    return { ...recipe, noteScore: calculateRelevanceScoreByRating(recipe) };

  });

  const NOTE_IMPORTANCE = 100;
  notedRecipes = notedRecipes.map(recipe => {
    // @ts-expect-error noteScore dont exist cause based on recipe type
    const totalScore = recipe.searchScore + (recipe.noteScore * NOTE_IMPORTANCE);
    return { ...recipe, totalScore: totalScore }
  })

  // Trier les recettes par score de pertinence décroissant
  // @ts-expect-error totalScore dont exist cause based on recipe type
  notedRecipes.sort((a, b) => b.totalScore - a.totalScore);

  const minScore = Math.max(5, searchTerms.length * 3);
  // @ts-expect-error totalScore dont exist cause based on recipe type
  const filteredRecipes = notedRecipes.filter(recipe => recipe.totalScore >= minScore);


  // Appliquer la pagination sur les résultats filtrés
  const paginatedRecipes = filteredRecipes.slice(offset, offset + limit);

  // Transformer pour le client
  const transformedRecipes = santizeData(paginatedRecipes, userId)

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

  // Configuration du tri
  let orderBy: any;

  // Si tri par note, gérer manuellement le tri après récupération des données
  const byRating = true;

  if (!byRating) {
    // Tri standard pour les autres critères
    orderBy = { [sort]: dir };
  } else {
    // Pour le tri par note, toujours récupérer les données dans l'ordre décroissant des notes d'abord
    // Le tri avancé sera appliqué après
    orderBy = { note: 'desc' };
  }
  const recipes = await prisma.recipe.findMany({
    where,
    orderBy,
    take: byRating ? undefined : limit, // Si tri par note, récupérer toutes les recettes pour le tri personnalisé
    skip: byRating ? 0 : offset,        // Si tri par note, pas de pagination à ce stade
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
      isVege: true,
      onRobot: true,
      isBabyFood: true,
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
  console.log(recipes)

  // Appliquer la randomisation si demandée
  let sortedRecipes = recipes;
  if (random) {
    sortedRecipes = shuffleRecipesByDiversity(recipes, diversityLevel);
  } else {
    // Appliquer le tri personnalisé par note+votes
    sortedRecipes = sortRecipesByRatingAndVotes(recipes);
  }
  // Appliquer la pagination manuellement après le tri
  const paginatedRecipes = sortedRecipes.slice(offset, offset + limit);
  sortedRecipes.length = 0; // Vider le tableau original
  sortedRecipes.push(...paginatedRecipes); // Le remplir avec les éléments paginés

  // Transformer les données pour le client
  const transformedRecipes = santizeData(sortedRecipes, userId)

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

  return recipes.sort((a, b) => {
    const scoreA = calculateScore(a);
    const scoreB = calculateScore(b);
    return scoreB - scoreA;
  });
}

/**
 * Fonction de tri qui combine la note et le nombre de votes
 * Avec une formule optimisée pour la pertinence
 */
function sortRecipesByRatingAndVotes(recipes: any[]) {
  // Calculer le score combiné pour chaque recette
  let notedRecipes = recipes.map(recipe => {
    const score = calculateRelevanceScoreByRating(recipe)
    return { ...recipe, noteScore: score };

  });

  // Tri basé sur le score combiné
  notedRecipes = notedRecipes.sort((a, b) => {
    const scoreA = a.noteScore || 0;
    const scoreB = b.noteScore || 0;

    return scoreB - scoreA
  });

  return notedRecipes;
}

function santizeData(recipes: RecipeType[], userId: number | null) {
  return recipes.map(recipe => ({
    ...recipe,
    isFavorite: !!recipe.favorites?.length,
    isInMenu: !!(recipe.menuItems?.length && userId),
    favorites: undefined,
    menuItems: undefined,
    ingredients: undefined, // Ne pas renvoyer les ingrédients détaillés dans les résultats de recherche
    searchScore: undefined,
    sourceUrl: isValidUrl(recipe.sourceUrl) && recipe.sourceUrl
  }));
}

function isValidUrl(string: string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

/**
 * Action pour gérer les opérations CRUD sur les recettes
 */
export async function action({ request }: ActionFunctionArgs) {
  const url = new URL(request.url);
  const path = url.pathname.split('/').pop();
  const formData = await request.formData()
  const action = formData.get("_action");

  try {
    // Cas: Recherche par catégories
    if (path === "categories") {
      return await getCategories();
    }

    if (action === "uploadImage") {
      const file = formData.get("image");
      if (file) return await addRecipeFromGemini(file as Blob);
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

async function addRecipeFromGemini(file: Blob) {
  try {
    const dataFromGemini = await getJSONToGemini(file);

    if (!dataFromGemini) {
      return json(
        { success: false, message: "Une erreur est survenue lors de la transformation des données", data: dataFromGemini },
        { status: 500 }
      );
    }

    const addedRecipes = await addJSONRecipes(dataFromGemini);
    console.log('Added recipes : ', addedRecipes)
    return json(
      { success: true, message: `Nouvelle recette ajoutée`, recipes: addedRecipes },
    );

  } catch (e) {
    return json(
      { success: false, message: "Une erreur est survenue lors de l'ajout de la recette" },
      { status: 500 }
    );

  }
}

const promptGemini = `
Votre Rôle :
Vous êtes un assistant culinaire expert en traitement de données. Votre mission est de convertir avec une précision extrême une ou plusieurs images de pages de recettes en un fichier JSON structuré, en suivant rigoureusement les règles et le schéma définis ci-dessous.

Objectif Principal :
Analyser l'image fournie, transcrire tout le contenu textuel pertinent, et le transformer en un tableau JSON d'objets Recipe, en appliquant une logique d'inférence pour les champs non explicites.

Règles Générales :

Un Fichier, Plusieurs Recettes : Si l'image contient plusieurs recettes, le JSON final doit être un tableau contenant un objet pour chaque recette.

Omission de imageUrl : Vous ne devez jamais inclure le champ imageUrl dans le JSON de sortie. Il sera géré automatiquement par un autre script.

Inférence Logique : Si un ingrédient est mentionné dans les étapes mais pas dans la liste officielle (ex: "un peu d'huile", "cacahuètes hachées"), vous devez l'ajouter logiquement à la liste des ingrédients.

Ton et Style : Le champ description doit être rédigé dans un style engageant et appétissant. Les étapes doivent être claires et concises.

Schéma JSON et Règles de Remplissage par Champ
sourceUrl (string)

Règle : Créer un identifiant unique de type "slug".

Format : theme-du-livre/titre-de-la-recette-en-minuscules-et-avec-tirets. Si le thème n'est pas évident, utilisez un mot-clé pertinent (ex: salades, plats-vegetariens).

Exemple : amerique/moules-farcies-nouvelle-angleterre

title (string)

Règle : Transcrire exactement le titre de la recette, en minuscule avec une majuscule à la première lettre.

description (string)

Règle : Générer une description concise (1-2 paragraphes) qui résume le plat de manière attrayante. Ce champ n'est pas une transcription directe.

Exemple : "Un grand classique vietnamien revisité en version vegan, avec du tofu mariné et doré, des crudités croquantes et une sauce savoureuse."

preparationTime (number)

Règle : Transcrire uniquement la valeur numérique du temps de préparation. Ne pas inclure "min".

cookingTime (string)

Règle : Transcrire la valeur et l'unité du temps de cuisson (ex: "15 min", "3 heures"). Si non spécifié, mettre "0 min".

servings (number)

Règle : Transcrire le nombre de personnes/personnes.

difficulty (string)

Règle : Inférence basée sur la complexité de la recette.

Facile : Moins de 5 étapes, techniques de base.

Moyen : 5-8 étapes, ou nécessite plusieurs préparations distinctes (marinade, sauce, etc.).

Difficile : Plus de 8 étapes, techniques complexes, gestion précise des cuissons.

isVege (boolean)

Règle : Mettre true si l'étiquette "VEGGIE" ou "VEGAN" est présente. Sinon, inférer : si la recette ne contient ni viande ni poisson, mettre true. Autrement, false.

isBabyFood (boolean)

Règle : Mettre true si la recette fait référence à un bébé, ou qu'elle est adaptée à un bébé. Autrement, false.

categoryId (number)

Règle : Classifier la recette et assigner l'ID correspondant à la catégorie la plus pertinente de la liste ci-dessous.

mealIds (array de numbers)

Règle : Classifier la recette et assigner un tableau contenant les IDs de tous les repas correspondants de la liste ci-dessous.

steps (array de strings)

Règle : Transcrire chaque étape de la préparation. Reformuler légèrement si nécessaire pour la clarté et la concision. S'assurer que chaque élément du tableau est une action logique. Si un temps de repos est indiqué, l'inclure dans la description ou comme une étape.

ingredients (array d'objets)

Règle : Créer un objet pour chaque ingrédient avec la structure { "name": string, "quantity": number | null, "unit": string | null }.

Gestion des quantités :

"1/2" devient 0.5.

"une pincée", "quelques feuilles" : quantity: null, unit: "pincée" ou unit: "quelques feuilles".

Ingrédient sans quantité (ex: "Sel") : quantity: null, unit: null.

Unité implicite (ex: "2 oignons") : quantity: 2, unit: "pièces" ou null.

Données de Référence pour la Classification
Liste des Catégories (categoryId)

1: Soupes

2: Purées

3: Gratins

4: Salades

5: Pâtes

6: Riz

7: Pains

8: Pizzas

9: Quiches

10: Dips & Sauces

11: Ragoût

12: Terrines

13: Pâtisseries

14: Viennoiseries

15: Flans & Crèmes

16: Confiseries

17: Confitures

18: Glaces

Liste des Repas (mealIds)

1: Petit déjeuner

2: Apéritif

3: Entrée

4: Plat principal

5: Accompagnement

6: Dessert

7: Boisson

Instruction finale : Appliquez l'ensemble de ces règles à l'image que je vais vous fournir. Assurez-vous que la sortie est un JSON valide et complet. Je suis prêt à vous envoyer l'image.
    `;

export async function getJSONToGemini(file: Blob) {
  try {
    // Conversion du fichier en base64
    console.log("Type réel :", typeof file, file && file.constructor && file.constructor.name);
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Image = buffer.toString("base64");

    // Préparation du contenu pour Gemini
    const contents = [
      {
        inlineData: {
          mimeType: file.type || "image/jpeg",
          data: base64Image,
        },
      },
      {
        text: promptGemini,
      },
    ];

    // Appel à l'API Gemini
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents,
      config: {
        responseMimeType: "application/json",
        candidateCount: 1,
        temperature: 0.7,
      },
    });


    // Vérification et retour du résultat
    if (response.text) {
      const result = JSON.parse(response.text);
      console.log("Données renvoyées par Gemini :", result);

      return result as RecipeSeedData[];
    } else {
      console.warn("Aucune donnée texte renvoyée par Gemini.");
      return false;
    }

  } catch (error) {
    console.error("Erreur survenue dans Gemini :", error);
    return false;
  }
}

// Définir des types clairs pour vos données d'entrée
type IngredientSeedData = {
  name: string;
  quantity: number | null;
  unit: string | null;
};

type RecipeSeedData = {
  sourceUrl: string;
  title: string;
  description?: string;
  preparationTime?: number;
  cookingTime?: string;
  servings?: number;
  difficulty?: string;
  isVege?: boolean;
  isBabyFood?: boolean;
  imageUrl?: string | null;
  categoryId: number;
  mealIds?: number[];
  steps: string[];
  ingredients: IngredientSeedData[];
  onRobot?: boolean;
};

// --- La fonction améliorée ---

async function addJSONRecipes(recipesData: RecipeSeedData[]) {

  const addedRecipes: Recipe[] = [];
  // On utilise une boucle for...of pour bien gérer l'asynchronisme
  for (const recipeData of recipesData) {
    try {
      console.log(`\nProcessing recipe: ${recipeData.title}`);

      const existing = await prisma.recipe.findFirst({
        where: {
          title: recipeData.title
        }
      })

      if (existing) {
        addedRecipes.push(existing);
        console.log(`Recette ${recipeData.title} existe déjà.`)
      } else {
        // 1. Récupération de l'image si nécessaire
        if (!recipeData.imageUrl) {
          recipeData.imageUrl = await fetchRecipeImage(recipeData.title);
        }

        // 2. Transaction Prisma pour garantir l'intégrité
        await prisma.$transaction(async (tx) => {
          // --- Vérifications de robustesse ---
          const category = await tx.category.findUnique({ where: { id: recipeData.categoryId } });
          if (!category) {
            // On arrête tout de suite avec une erreur claire
            throw new Error(`La catégorie avec l'ID ${recipeData.categoryId} est introuvable.`);
          }

          // --- Gestion des ingrédients (avec normalisation) ---
          const ingredientPayloads = await Promise.all(
            recipeData.ingredients.map(async (ingData) => {
              const normalizedName = ingData.name.trim();
              const ingredient = await tx.ingredient.upsert({
                where: { name: normalizedName },
                update: {},
                create: { name: normalizedName },
              });
              return {
                ingredientId: ingredient.id,
                quantity: ingData.quantity || 1,
                unit: ingData.unit,
              };
            })
          );

          const uniqueIngredientPayloads = Array.from(
            new Map(
              ingredientPayloads.map(item => [item.ingredientId, item])
            ).values()
          );
          console.log(`  -> ${ingredientPayloads.length} ingredients processed (${uniqueIngredientPayloads.length}).`);
          console.log(uniqueIngredientPayloads)

          // --- Gestion des repas (avec vérification) ---
          const mealConnectPayload = (recipeData.mealIds || []).map(mealId => ({
            meal: { connect: { id: mealId } },
          }));
          if (mealConnectPayload.length > 0) {
            console.log(`  -> ${mealConnectPayload.length} meals processed.`);
          }

          // --- Création d'un payload de données commun (DRY) ---
          const recipePayload = {
            title: recipeData.title,
            description: recipeData.description,
            preparationTime: recipeData.preparationTime,
            cookingTime: recipeData.cookingTime,
            servings: recipeData.servings,
            difficulty: recipeData.difficulty,
            isVege: recipeData.isVege,
            isBabyFood: recipeData.isBabyFood,
            imageUrl: recipeData.imageUrl,
            onRobot: recipeData.onRobot || false,
            steps: {
              // Dans la partie `update`, il faut d'abord supprimer avant de recréer
              deleteMany: {},
              create: recipeData.steps.map((instruction, index) => ({
                stepNumber: index + 1,
                instruction: instruction,
              })),
            },
            ingredients: {
              deleteMany: {},
              create: uniqueIngredientPayloads,
            },
            meals: {
              deleteMany: {},
              create: mealConnectPayload,
            },
          };

          // --- Upsert final, beaucoup plus propre ---
          addedRecipes.push(await tx.recipe.upsert({
            where: { sourceUrl: recipeData.sourceUrl },
            update: {
              ...recipePayload,
              category: { connect: { id: category.id } }, // La connexion se fait ici pour l'update
            },
            create: {
              ...recipePayload,
              sourceUrl: recipeData.sourceUrl, // sourceUrl n'est que pour la création
              category: { connect: { id: category.id } },
              // Pour 'create', on ne peut pas faire deleteMany, on ne garde que 'create'
              steps: { create: recipePayload.steps.create },
              ingredients: { create: recipePayload.ingredients.create },
              meals: { create: recipePayload.meals.create },
            },
          }));

          console.log(`  -> ✅ Recipe "${recipeData.title}" upserted successfully!`);
        });
      }

    } catch (error) {
      // Un bloc catch par recette pour ne pas bloquer tout le script
      console.error(`❌ Une erreur est survenue lors de l'ajout de la recette "${recipeData.title}":`, error);
    }
  }

  console.log('\n✅ Seeding terminé.');
  return addedRecipes;
}

async function fetchRecipeImage(query: string) {
  // On vérifie que la clé API est bien présente
  if (!process.env.PEXELS_API_KEY) {
    console.warn('  -> ⚠️ PEXELS_API_KEY non définie. Impossible de chercher une image.');
    return null;
  }

  try {
    console.log(`  -> 📸 Recherche d'une image pour "${query}" sur Pexels...`);
    const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`, {
      headers: {
        Authorization: process.env.PEXELS_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur API Pexels: ${response.statusText}`);
    }

    const data = await response.json();

    // Si on a des photos, on retourne l'URL de la meilleure qualité
    if (data.photos && data.photos.length > 0) {
      const imageUrl = data.photos[0].src.large2x; // ou .original, .large, etc.
      console.log(`  -> ✨ Image trouvée : ${imageUrl}`);
      return imageUrl;
    }

    console.log('  -> 😕 Aucune image trouvée.');
    return null;
  } catch (error) {
    console.error('  -> ❌ Erreur lors de la recherche d\'image sur Pexels :', error);
    return null;
  }
}
