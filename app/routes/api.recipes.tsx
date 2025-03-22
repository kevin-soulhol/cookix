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

  // Pour un vrai système d'authentification, vous devriez récupérer l'userId depuis la session
  const userId = await getUserId(request); // ID utilisateur fictif

  // Paramètres de requête
  const id = url.searchParams.get("id");
  const search = url.searchParams.get("search");
  const difficulty = url.searchParams.get("difficulty");
  const maxPreparationTime = url.searchParams.get("maxPreparationTime");
  const sort = url.searchParams.get("sort") || "title";
  const dir = url.searchParams.get("dir") || "asc";
  const limit = url.searchParams.get("limit") ? parseInt(url.searchParams.get("limit")!) : 50;
  const offset = url.searchParams.get("offset") ? parseInt(url.searchParams.get("offset")!) : 0;
  const random = url.searchParams.get("random") === "true";

  console.log("______________________", userId, id)

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
        isFavorite: recipe.favorites.length > 0
      };

      // Supprimer les données de relation brutes
      delete transformedRecipe.favorites;

      return json({ success: true, recipe: transformedRecipe });
    }

    // Cas 2: Recherche de recettes avec filtres
    const where: any = {};

    // Filtre par texte (titre ou description)
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } }
      ];
    }

    // Filtre par difficulté
    if (difficulty) {
      where.difficulty = difficulty;
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


    const recipes = await prisma.recipe.findMany({
      where,
      orderBy,
      take: limit,
      skip: offset,
      include: includeObj
    });


    if (random) {
      recipes.sort(() => Math.random() - 0.5);
    }

    // Compter le nombre total de recettes (pour la pagination)
    const totalRecipes = await prisma.recipe.count({ where });

    // Transformer les données pour faciliter leur utilisation côté client
    const transformedRecipes = recipes.map(recipe => ({
      ...recipe,
      isFavorite: recipe.favorites?.length > 0,
      isInMenu: recipe.menuItems?.length > 0 && userId,
      favorites: undefined // Supprimer les données de relation brutes
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

  // Pour un vrai système d'authentification, vous devriez vérifier 
  // si l'utilisateur a les permissions nécessaires

  try {
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