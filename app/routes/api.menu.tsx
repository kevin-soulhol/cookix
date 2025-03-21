import { json, ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { prisma } from "~/utils/db.server";
import { RecipeType } from "~/components/BoxRecipe";
import { getUserId } from "./api.user";

export type TypeMenuItem = {
  id: number;
  menuId: number;
  recipeId: number;
  recipe: RecipeType[]
}

export async function loader({ request }: LoaderFunctionArgs) {

  console.log("------------------------------------- request headers", request.headers);
  const userId = await getUserId(request);
  console.log("------------------------------------- userId", userId);

  if (!userId) {
    return json({ success: false, message: "Il faut être connecté" }, { status: 400 });
  }

  try {
    // Récupérer le menu actif de l'utilisateur
    let activeMenu = await prisma.menu.findFirst({
      where: {
        userId,
      }
    });

    // Si aucun menu actif n'existe, en créer un nouveau
    if (!activeMenu) {
      activeMenu = await prisma.menu.create({
        data: {
          userId,
          name: `Menu du ${new Date().toLocaleDateString('fr-FR')}`,
          startDate: new Date(),
          endDate: new Date()
        }
      });
    }

    // Récupérer les éléments du menu avec les détails des recettes
    const menuItems = await prisma.menuItem.findMany({
      where: {
        menuId: activeMenu.id
      },
      include: {
        recipe: true
      },
      orderBy: {
        id: 'asc'
      }
    });

    // Récupérer les recettes favorites pour suggestions
    const favoriteRecipes = await prisma.favorite.findMany({
      where: {
        userId
      },
      include: {
        recipe: true
      },
      take: 3
    });

    // Compter le nombre d'ingrédients dans la liste de courses pour afficher un badge
    let shoppingList = await prisma.shoppingList.findFirst({
      where: {
        userId,
      },
      include: {
        _count: {
          select: {
            items: true
          }
        }
      }
    });

    // Si aucune liste de courses active n'existe, en créer une nouvelle
    if (!shoppingList) {
      shoppingList = await prisma.shoppingList.create({
        data: {
          userId,
        },
        include: {
          _count: {
            select: {
              items: true
            }
          }
        }
      });
    }

    // Vérifier si le menu a été partagé
    const menuShares = await prisma.menuShare.findMany({
      where: {
        menuId: activeMenu.id
      }
    });


    return {
      menu: activeMenu,
      menuItems,
      favoriteRecipes: favoriteRecipes.map(fav => fav.recipe),
      shoppingListCount: shoppingList._count.items,
      shoppingListId: shoppingList.id,
      menuShares
    };
  } catch (error) {
    console.log('Erreur lors du chargement du Menu : ', error)

    return {
      menu: [],
      menuItems: [],
      favoriteRecipes: [],
      shoppingListCount: 3,
      shoppingListId: 2,
      menuShares: [],
      error: error
    };
  }
}


export async function action({ request }: ActionFunctionArgs) {
  const userId = await getUserId(request);
  const formData = await request.formData()
  const recipeIdData = formData.get("recipeId");
  const recipeId: number | null = parseInt(recipeIdData);
  const method = request.method.toUpperCase();
  console.log(recipeId, method)

  if (!userId) {
    return json({ success: false, message: "Il faut être connecté" }, { status: 400 });
  }

  if (!recipeId) {
    console.log("Pas de recipeId", recipeId)

    return json({ success: false, message: "ID de recette manquant" }, { status: 400 });
  }

  try {
    if (method === "POST") {
      return await addRecipeToMenu(recipeId, userId);
    }

    if (method === "DELETE") {
      return await deleteRecipeFromMenu(recipeId, userId);
    }

  } catch (error) {
    console.error("Erreur lors de la gestion des menus:", error);
    return json(
      { success: false, message: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

async function getMenuByUserId(userId: number) {
  if (!userId) {
    return json({ success: false, message: "Il faut être connecté" }, { status: 400 });
  }

  let activeMenu = await prisma.menu.findFirst({
    where: {
      userId,
    },
  });

  // Si aucun menu actif n'existe, en créer un nouveau
  if (!activeMenu) {
    console.log("Aucun Menu déjà existant")
    const currentDate = new Date();
    const endOfWeek = new Date(currentDate);
    endOfWeek.setDate(currentDate.getDate() + (7 - currentDate.getDay()));

    activeMenu = await prisma.menu.create({
      data: {
        userId,
        name: `Menu du ${currentDate.toLocaleDateString('fr-FR')}`,
        startDate: currentDate,
        endDate: endOfWeek,
      },
    });
  }

  return activeMenu;
}


async function addRecipeToMenu(recipeId: number, userId: number) {
  if (!recipeId) {
    console.log("Pas de recipeId", recipeId)

    return json({ success: false, message: "ID de recette manquant" }, { status: 400 });
  }

  try {
    // Créer ou récupérer le menu actif de l'utilisateur
    const activeMenu = await getMenuByUserId(userId);

    // Ajouter la recette au menu
    await prisma.menuItem.create({
      data: {
        menuId: activeMenu.id,
        recipeId: parseInt(recipeId.toString()),
        // Vous pourriez ajouter d'autres champs comme le jour de la semaine, le type de repas, etc.
      },
    });

    // Une fois la recette ajoutée au menu, ajoutez automatiquement ses ingrédients à la liste de courses

    // 1. Récupérer ou créer la liste de courses active
    let activeShoppingList = await prisma.shoppingList.findFirst({
      where: {
        userId,
      },
    });

    if (!activeShoppingList) {
      activeShoppingList = await prisma.shoppingList.create({
        data: {
          userId,
        },
      });
    }

    // 2. Récupérer les ingrédients de la recette
    const recipeIngredients = await prisma.recipeIngredient.findMany({
      where: {
        recipeId: parseInt(recipeId.toString()),
      },
      include: {
        ingredient: true,
      },
    });

    // 3. Ajouter chaque ingrédient à la liste de courses
    for (const recipeIngredient of recipeIngredients) {
      // Vérifier si l'ingrédient existe déjà dans la liste
      const existingItem = await prisma.shoppingItem.findFirst({
        where: {
          shoppingListId: activeShoppingList.id,
          ingredientId: recipeIngredient.ingredientId,
        },
      });

      if (existingItem && existingItem.unit === recipeIngredient.unit) {
        // Si l'ingrédient existe déjà et que unit est pareil, mettre à jour la quantité
        await prisma.shoppingItem.update({
          where: {
            id: existingItem.id,
          },
          data: {
            quantity: existingItem.quantity + recipeIngredient.quantity,
            // Conserver l'unité existante ou utiliser celle de la nouvelle recette
            unit: existingItem.unit,
          },
        });
      } else {
        // Sinon, créer un nouvel élément dans la liste
        await prisma.shoppingItem.create({
          data: {
            shoppingListId: activeShoppingList.id,
            ingredientId: recipeIngredient.ingredientId,
            quantity: recipeIngredient.quantity,
            unit: recipeIngredient.unit,
            isChecked: false,
          },
        });
      }
    }

    return json({
      success: true,
      message: "Recette ajoutée au menu et ingrédients ajoutés à la liste de courses"
    });

  } catch (error) {
    console.error("Erreur lors de l'ajout au menu:", error);
    return json(
      { success: false, message: "Une erreur est survenue lors de l'ajout au menu" },
      { status: 500 }
    );
  }
}

async function deleteRecipeFromMenu(recipeId: number, userId: number) {
  if (!recipeId) {
    return json({ success: false, message: "ID de recette manquant" }, { status: 400 });
  }

  try {
    const activeMenu = await getMenuByUserId(userId);

    // Supprimer l'élément du menu
    await prisma.menuItem.deleteMany({
      where: {
        recipeId: recipeId,
        menuId: activeMenu.id,
        menu: {
          userId
        }
      },
    });

    // Récupérer la liste de courses active
    const activeShoppingList = await prisma.shoppingList.findFirst({
      where: {
        userId,
      }
    });

    if (!activeShoppingList) {
      return json({ success: true, message: "Recette retirée des Menus. Aucune liste de courses trouvée." });
    }

    // Récupérer les ingrédients de la recette supprimée
    const recipeIngredients = await prisma.recipeIngredient.findMany({
      where: {
        recipeId: recipeId,
      }
    });

    // Pour chaque ingrédient de la recette supprimée
    for (const recipeIngredient of recipeIngredients) {
      // Vérifier si l'ingrédient existe dans la liste de courses
      const shoppingItem = await prisma.shoppingItem.findFirst({
        where: {
          shoppingListId: activeShoppingList.id,
          ingredientId: recipeIngredient.ingredientId,
          unit: recipeIngredient.unit
        },
      });

      if (!shoppingItem) continue; // Si l'ingrédient n'est pas dans la liste, passer au suivant

      // Vérifier si cet ingrédient est utilisé dans d'autres recettes du menu
      // Récupérer tous les autres éléments du menu
      const otherMenuItems = await prisma.menuItem.findMany({
        where: {
          menuId: activeMenu.id,
          recipeId: {
            not: recipeId // Exclure la recette qu'on vient de supprimer
          }
        },
        select: {
          recipeId: true
        }
      });

      // Récupérer les IDs des autres recettes
      const otherRecipeIds = otherMenuItems.map(item => item.recipeId);

      // Calculer la quantité totale de cet ingrédient dans les autres recettes
      let quantityInOtherRecipes = 0;

      if (otherRecipeIds.length > 0) {
        // Trouver les entrées RecipeIngredient pour le même ingrédient dans d'autres recettes
        const sameIngredientsInOtherRecipes = await prisma.recipeIngredient.findMany({
          where: {
            ingredientId: recipeIngredient.ingredientId,
            unit: recipeIngredient.unit,
            recipeId: {
              in: otherRecipeIds
            }
          }
        });

        // Calculer la quantité totale
        for (const ing of sameIngredientsInOtherRecipes) {
          if (ing.quantity) {
            quantityInOtherRecipes += ing.quantity;
          }
        }
      }

      // Si l'ingrédient n'est plus utilisé, le supprimer complètement
      if (quantityInOtherRecipes === 0) {
        await prisma.shoppingItem.delete({
          where: {
            id: shoppingItem.id
          }
        });
      }
      // Sinon, ajuster la quantité
      else {
        // Nouvelle quantité = max(quantité dans les autres recettes, quantité actuelle - quantité de la recette supprimée)
        const newQuantity = Math.max(
          quantityInOtherRecipes,
          (shoppingItem.quantity || 0) - (recipeIngredient.quantity || 0)
        );

        await prisma.shoppingItem.update({
          where: {
            id: shoppingItem.id
          },
          data: {
            quantity: newQuantity
          }
        });
      }
    }

    return json({ success: true, message: "Recette retirée des Menus et ingrédients mis à jour dans la liste de courses" });

  } catch (error) {
    console.log("Erreur lors du remove de la recette", error);
    return json({ success: false, message: "Erreur lors du remove de la recette" });
  }
}