import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { prisma } from "~/utils/db.server";
import { getUserId } from "./api.user";

/**
 * Loader pour récupérer les recettes
 * GET /api/recipes -> Toutes les recettes
 * GET /api/recipes?id=123 -> Une recette spécifique
 * GET /api/recipes?search=poulet -> Recherche de recettes
 * GET /api/recipes?difficulty=Facile -> Filtrage par difficulté
 * GET /api/recipes?sort=preparationTime&dir=asc -> Tri
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
  const limit = url.searchParams.get("limit") ? parseInt(url.searchParams.get("limit")!) : 50;
  const offset = url.searchParams.get("offset") ? parseInt(url.searchParams.get("offset")!) : 0;
  const random = url.searchParams.get("random") === "true";
  const diversityLevel = url.searchParams.get("diversity") || "medium";

  try {
    // Cas 1: Recherche d'une recette spécifique par ID
    if (id) {
      const includeObj = {
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
          where: {
            userId
          },
          select: {
            id: true
          }
        };
        includeObj.menuItems = {
          where: {
            menu: {
              userId
            }
          },
          select: {
            id: true
          }
        }
      }

      const recipe = await prisma.recipe.findUnique({
        where: {
          id: parseInt(id)
        },
        include: includeObj
      });

      if (!recipe) {
        return json({ success: false, message: "Recette non trouvée" }, { status: 404 });
      }

      // Transformer les données pour faciliter leur utilisation côté client
      const transformedRecipe = {
        ...recipe,
        isFavorite: recipe.favorites?.length > 0,
        isInMenu: recipe.menuItems?.length > 0 && userId,
      };

      // Supprimer les données de relation brutes
      delete transformedRecipe.favorites;

      return json({ success: true, recipe: transformedRecipe });
    }

    // Cas 2: Recherche de recettes avec filtres
    const where: any = {};

    // Traitement de la recherche
    if (search) {
      const searchTerms = search.toLowerCase().trim().split(/\s+/).filter(term => term.length > 1);

      if (searchTerms.length > 0) {
        // Créer une condition OR pour chaque terme de recherche
        where.OR = searchTerms.flatMap(term => [
          { title: { contains: term.toLowerCase() } },
          { description: { contains: term.toLowerCase() } }
        ]);
      }
    }

    // Filtre par difficulté
    if (difficulty) {
      where.difficulty = difficulty;
    }

    if (categoryId) {
      where.categoryId = parseInt(categoryId);
    }

    console.log("____________________________", mealType)
    if (mealType) {
      where.meals = {
        some: {
          meal: {
            title: {
              equals: mealType
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

    // Tri standard
    const orderBy = {
      [sort]: dir
    };

    // Récupérer les recettes
    let includeObj = {}
    if (userId) {
      includeObj = {
        favorites: {
          where: {
            userId
          },
          select: {
            id: true
          }
        },
        menuItems: {
          where: {
            menu: {
              userId
            }
          },
          select: {
            id: true
          }
        }
      }
    }

    // Optimisation: sélection conditionnelle des champs
    const selectObj = {
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
      createdAt: true,
      updatedAt: true,
      // Toujours inclure la description pour le système de score
      description: true,
    };

    // Compter le nombre total de recettes (pour la pagination)
    const totalRecipes = await prisma.recipe.count({ where });

    // Si on a une recherche textuelle, utiliser notre système de score personnalisé
    if (search && search.trim().length > 0) {
      const recipes = await prisma.recipe.findMany({
        where,
        orderBy,
        // Pour la recherche, récupérer toutes les recettes correspondantes pour le tri par score
        // (mais limiter à un nombre raisonnable pour éviter les problèmes de performance)
        take: limit * 3, // Prendre plus de résultats pour avoir assez après filtrage par score
        select: {
          ...selectObj,
          note: true,
          voteNumber: true,
          ...(userId ? {
            favorites: includeObj.favorites,
            menuItems: includeObj.menuItems
          } : {})
        }
      });

      const searchTerms = search.toLowerCase().trim().split(/\s+/).filter(term => term.length > 1);

      // Calculer un score de pertinence pour chaque recette
      const scoredRecipes = recipes.map(recipe => {
        let score = 0;
        const recipeTitle = recipe.title?.toLowerCase() || '';
        const recipeDescription = recipe.description?.toLowerCase() || '';

        // Points pour les correspondances dans le titre (plus important)
        searchTerms.forEach(term => {
          if (recipeTitle.includes(term)) {
            score += 10;
            // Bonus pour le terme au début du titre
            if (recipeTitle.startsWith(term)) score += 5;
          }

          if (recipeDescription.includes(term)) {
            score += 3;
          }
        });

        // Bonus pour la proximité des termes dans le titre
        if (searchTerms.length > 1 && recipeTitle.includes(search.toLowerCase())) {
          score += 15;
        }

        // Bonus pour tous les termes présents dans le titre
        if (searchTerms.every(term => recipeTitle.includes(term))) {
          score += 20;
        }

        return { ...recipe, searchScore: score };
      });

      // Trier les recettes par score de pertinence décroissant
      scoredRecipes.sort((a, b) => b.searchScore - a.searchScore);

      // Filtrer par score minimal - plus stricte pour les recherches multi-termes
      const minScore = searchTerms.length > 1 ? 15 : 5;
      const filteredRecipes = scoredRecipes.filter(recipe => recipe.searchScore >= minScore);

      // Appliquer la pagination sur les résultats filtrés
      const paginatedRecipes = filteredRecipes.slice(offset, offset + limit);

      // Transformer pour le client
      const transformedRecipes = paginatedRecipes.map(recipe => ({
        ...recipe,
        isFavorite: recipe.favorites?.length > 0,
        isInMenu: recipe.menuItems?.length > 0 && userId,
        // Supprimer les données non nécessaires
        favorites: undefined,
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
    // Si pas de recherche textuelle, utiliser le tri standard
    else {
      const recipes = await prisma.recipe.findMany({
        where,
        orderBy,
        take: limit,
        skip: offset,
        select: {
          ...selectObj,
          note: true,
          voteNumber: true,
          ...(userId ? {
            favorites: includeObj.favorites,
            menuItems: includeObj.menuItems
          } : {})
        }
      });

      if (random) {
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

        const calculateScore = (recipe) => {
          const rating = recipe.note || 0;
          const voteCount = recipe.voteNumber || 0;
          const normalizedVoteCount = maxVoteCount > 0
            ? Math.tanh(voteCount / (maxVoteCount * 0.25))
            : 0;
          const normalizedRating = rating / maxRating;
          const randomFactor = Math.random();
          const score = (normalizedRating * RATING_WEIGHT) +
            (normalizedVoteCount * VOTE_COUNT_WEIGHT) +
            (randomFactor * RANDOM_WEIGHT);
          return score;
        };

        recipes.sort((a, b) => {
          const scoreA = calculateScore(a);
          const scoreB = calculateScore(b);
          return scoreB - scoreA;
        });
      }

      // Transformer les données pour le client
      const transformedRecipes = recipes.map(recipe => ({
        ...recipe,
        isFavorite: recipe.favorites?.length > 0,
        isInMenu: recipe.menuItems?.length > 0 && userId,
        favorites: undefined,
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

  } catch (error) {
    console.error("Erreur lors de la récupération des recettes:", error);
    return json(
      { success: false, message: "Une erreur est survenue lors de la récupération des recettes" },
      { status: 500 }
    );
  }
}

/**
 * Action pour créer, modifier ou supprimer des recettes
 * POST /api/recipes -> Créer une nouvelle recette
 * PUT /api/recipes?id=123 -> Modifier une recette existante
 * DELETE /api/recipes?id=123 -> Supprimer une recette
 */
export async function action({ request }: ActionFunctionArgs) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const method = request.method.toUpperCase();


  try {

    //Recherche par catégories
    if (path === "categories") {
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

    // Cas 1: Création d'une nouvelle recette (POST)
    if (method === "POST") {
      const formData = await request.formData();
      const recipeData = JSON.parse(formData.get("data") as string);

      // Validation des données
      if (!recipeData.title) {
        return json({ success: false, message: "Le titre est requis" }, { status: 400 });
      }

      // Créer la recette
      const newRecipe = await prisma.recipe.create({
        data: {
          title: recipeData.title,
          description: recipeData.description || "",
          preparationTime: recipeData.preparationTime ? parseInt(recipeData.preparationTime) : null,
          cookingTime: recipeData.cookingTime ? parseInt(recipeData.cookingTime) : null,
          servings: recipeData.servings ? parseInt(recipeData.servings) : null,
          difficulty: recipeData.difficulty || null,
          note: recipeData.note ? parseFloat(recipeData.note) : null,
          imageUrl: recipeData.imageUrl || null,
          sourceUrl: recipeData.sourceUrl || null,
        },
      });

      // Si des étapes sont fournies, les créer
      if (recipeData.steps && Array.isArray(recipeData.steps)) {
        for (let i = 0; i < recipeData.steps.length; i++) {
          await prisma.recipeStep.create({
            data: {
              recipeId: newRecipe.id,
              stepNumber: i + 1,
              instruction: recipeData.steps[i],
            },
          });
        }
      }

      // Si des ingrédients sont fournis, les créer
      if (recipeData.ingredients && Array.isArray(recipeData.ingredients)) {
        for (const ingredientData of recipeData.ingredients) {
          // Trouver ou créer l'ingrédient
          let ingredient = await prisma.ingredient.findUnique({
            where: { name: ingredientData.name }
          });

          if (!ingredient) {
            ingredient = await prisma.ingredient.create({
              data: { name: ingredientData.name }
            });
          }

          // Associer l'ingrédient à la recette
          await prisma.recipeIngredient.create({
            data: {
              recipeId: newRecipe.id,
              ingredientId: ingredient.id,
              quantity: ingredientData.quantity || null,
              unit: ingredientData.unit || null,
            },
          });
        }
      }

      return json({
        success: true,
        message: "Recette créée avec succès",
        recipe: newRecipe
      });
    }

    // Cas 2: Modification d'une recette existante (PUT)
    if (method === "PUT" && id) {
      const formData = await request.formData();
      const recipeData = JSON.parse(formData.get("data") as string);

      // Vérifier si la recette existe
      const existingRecipe = await prisma.recipe.findUnique({
        where: { id: parseInt(id) }
      });

      if (!existingRecipe) {
        return json({ success: false, message: "Recette non trouvée" }, { status: 404 });
      }

      // Mettre à jour la recette
      const updatedRecipe = await prisma.recipe.update({
        where: { id: parseInt(id) },
        data: {
          title: recipeData.title || existingRecipe.title,
          description: recipeData.description !== undefined ? recipeData.description : existingRecipe.description,
          preparationTime: recipeData.preparationTime !== undefined ? parseInt(recipeData.preparationTime) : existingRecipe.preparationTime,
          cookingTime: recipeData.cookingTime !== undefined ? parseInt(recipeData.cookingTime) : existingRecipe.cookingTime,
          servings: recipeData.servings !== undefined ? parseInt(recipeData.servings) : existingRecipe.servings,
          difficulty: recipeData.difficulty !== undefined ? recipeData.difficulty : existingRecipe.difficulty,
          note: recipeData.note !== undefined ? parseFloat(recipeData.note) : existingRecipe.note,
          imageUrl: recipeData.imageUrl !== undefined ? recipeData.imageUrl : existingRecipe.imageUrl,
          sourceUrl: recipeData.sourceUrl !== undefined ? recipeData.sourceUrl : existingRecipe.sourceUrl,
        },
      });

      // Si des étapes sont fournies, mettre à jour
      if (recipeData.steps && Array.isArray(recipeData.steps)) {
        // Supprimer les étapes existantes
        await prisma.recipeStep.deleteMany({
          where: { recipeId: parseInt(id) }
        });

        // Créer les nouvelles étapes
        for (let i = 0; i < recipeData.steps.length; i++) {
          await prisma.recipeStep.create({
            data: {
              recipeId: parseInt(id),
              stepNumber: i + 1,
              instruction: recipeData.steps[i],
            },
          });
        }
      }

      // Si des ingrédients sont fournis, mettre à jour
      if (recipeData.ingredients && Array.isArray(recipeData.ingredients)) {
        // Supprimer les associations d'ingrédients existantes
        await prisma.recipeIngredient.deleteMany({
          where: { recipeId: parseInt(id) }
        });

        // Créer les nouvelles associations
        for (const ingredientData of recipeData.ingredients) {
          // Trouver ou créer l'ingrédient
          let ingredient = await prisma.ingredient.findUnique({
            where: { name: ingredientData.name }
          });

          if (!ingredient) {
            ingredient = await prisma.ingredient.create({
              data: { name: ingredientData.name }
            });
          }

          // Associer l'ingrédient à la recette
          await prisma.recipeIngredient.create({
            data: {
              recipeId: parseInt(id),
              ingredientId: ingredient.id,
              quantity: ingredientData.quantity || null,
              unit: ingredientData.unit || null,
            },
          });
        }
      }

      return json({
        success: true,
        message: "Recette mise à jour avec succès",
        recipe: updatedRecipe
      });
    }

    // Cas 3: Suppression d'une recette (DELETE)
    if (method === "DELETE" && id) {
      // Vérifier si la recette existe
      const existingRecipe = await prisma.recipe.findUnique({
        where: { id: parseInt(id) }
      });

      if (!existingRecipe) {
        return json({ success: false, message: "Recette non trouvée" }, { status: 404 });
      }

      // Supprimer les étapes
      await prisma.recipeStep.deleteMany({
        where: { recipeId: parseInt(id) }
      });

      // Supprimer les associations d'ingrédients
      await prisma.recipeIngredient.deleteMany({
        where: { recipeId: parseInt(id) }
      });

      // Supprimer les favoris associés
      await prisma.favorite.deleteMany({
        where: { recipeId: parseInt(id) }
      });

      // Supprimer les éléments de menu associés
      await prisma.menuItem.deleteMany({
        where: { recipeId: parseInt(id) }
      });

      // Supprimer la recette
      await prisma.recipe.delete({
        where: { id: parseInt(id) }
      });

      return json({
        success: true,
        message: "Recette supprimée avec succès"
      });
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