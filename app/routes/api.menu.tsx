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
  const userId = await getUserId(request);
  const url = new URL(request.url);
  const menuId = url.searchParams.get("id");

  if (!userId) {
    return json({ success: false, message: "Il faut être connecté" }, { status: 401 });
  }

  try {
    // Si un ID de menu spécifique est demandé
    if (menuId) {
      // Vérifier si le menu existe et si l'utilisateur a le droit d'y accéder
      const menu = await prisma.menu.findUnique({
        where: { id: parseInt(menuId) },
      });

      if (!menu) {
        return json({ success: false, message: "Menu non trouvé" }, { status: 404 });
      }

      // Vérifier si l'utilisateur est propriétaire du menu ou s'il a un partage accepté
      const hasAccess = menu.userId === userId || await prisma.menuShare.findFirst({
        where: {
          menuId: parseInt(menuId),
          OR: [
            { sharedWithUserId: userId },
            { sharedWithEmail: { equals: (await prisma.user.findUnique({ where: { id: userId } }))?.email } }
          ],
          isAccepted: true
        }
      });

      if (!hasAccess) {
        return json({ success: false, message: "Vous n'avez pas accès à ce menu" }, { status: 403 });
      }

      // Récupérer les détails du menu
      const menuItems = await prisma.menuItem.findMany({
        where: { menuId: parseInt(menuId) },
        include: { recipe: true },
        orderBy: { id: 'asc' }
      });

      // Trouver la liste de courses associée
      let shoppingList;
      const menuShare = await prisma.menuShare.findFirst({
        where: {
          menuId: parseInt(menuId),
          OR: [
            { sharedWithUserId: userId },
            { sharedWithEmail: { equals: (await prisma.user.findUnique({ where: { id: userId } }))?.email } }
          ],
          isAccepted: true,
          includeShoppingList: true
        }
      });

      if (menuShare?.shoppingListId) {
        shoppingList = await prisma.shoppingList.findUnique({
          where: { id: menuShare.shoppingListId },
          include: {
            _count: {
              select: { items: true }
            }
          }
        });
      } else {
        // Utiliser la liste de courses de l'utilisateur
        shoppingList = await prisma.shoppingList.findFirst({
          where: { userId },
          include: {
            _count: {
              select: { items: true }
            }
          }
        });

        if (!shoppingList) {
          shoppingList = await prisma.shoppingList.create({
            data: { userId },
            include: {
              _count: {
                select: { items: true }
              }
            }
          });
        }
      }

      return json({
        menu,
        menuItems,
        favoriteRecipes: [], // Pour la vue du menu partagé, pas besoin des favoris
        shoppingListCount: shoppingList?._count.items || 0,
        shoppingListId: shoppingList?.id,
        menuShares: [],
        isSharedMenu: menu.userId !== userId,
        canEdit: menu.userId === userId
      });
    }

    // Récupérer le menu actif de l'utilisateur
    let activeMenu = await prisma.menu.findFirst({
      where: { userId },
    });

    // Si aucun menu actif n'existe, en créer un nouveau
    if (!activeMenu) {
      activeMenu = await prisma.menu.create({
        data: {
          userId,
          startDate: new Date(),
          endDate: new Date()
        }
      });
    }

    // Récupérer les éléments du menu avec les détails des recettes
    const menuItems = await prisma.menuItem.findMany({
      where: { menuId: activeMenu.id },
      include: {
        recipe: {
          include: {
            favorites: {
              where: { userId },
              select: { id: true }
            }
          }
        }
      },
      orderBy: { id: 'asc' }
    });

    const transformedMenuItems = menuItems.map(item => {
      // Extraire et transformer la recette
      const transformedRecipe = {
        ...item.recipe,
        isFavorite: !!item.recipe.favorites?.length,
        isInMenu: true // Ces recettes sont déjà dans le menu
      };

      // Supprimer les relations brutes
      delete transformedRecipe.favorites;

      // Retourner l'élément de menu avec la recette transformée
      return {
        ...item,
        recipe: transformedRecipe
      };
    });

    // Récupérer les recettes favorites pour suggestions
    const favoriteRecipes = await prisma.favorite.findMany({
      where: { userId },
      include: { recipe: true },
      take: 3
    });

    const transformedFavoriteRecipes = favoriteRecipes.map(fav => fav.recipe).map(fav => ({ ...fav, isFavorite: true }))

    // Liste de courses
    let shoppingList = await prisma.shoppingList.findFirst({
      where: { userId },
      include: {
        _count: {
          select: { items: true }
        }
      }
    });

    if (!shoppingList) {
      shoppingList = await prisma.shoppingList.create({
        data: { userId },
        include: {
          _count: {
            select: { items: true }
          }
        }
      });
    }


    // Vérifier si le menu a été partagé
    const menuShares = await prisma.menuShare.findMany({
      where: { menuId: activeMenu.id }
    });

    return json({
      menu: activeMenu,
      menuItems: transformedMenuItems,
      favoriteRecipes: transformedFavoriteRecipes,
      shoppingListCount: shoppingList._count.items,
      shoppingListId: shoppingList.id,
      menuShares,
      isSharedMenu: false,
      canEdit: true
    });
  } catch (error) {
    console.error('Erreur lors du chargement du Menu : ', error);
    return json({
      success: false,
      menu: null,
      menuItems: [],
      favoriteRecipes: [],
      shoppingListCount: 0,
      shoppingListId: null,
      error: "Une erreur est survenue lors du chargement du menu"
    }, { status: 500 });
  }
}


export async function action({ request }: ActionFunctionArgs) {
  const userId = await getUserId(request);
  const formData = await request.formData()
  const recipeIdData = formData.get("recipeId");
  const recipeId: number | null = parseInt(recipeIdData);
  const method = request.method.toUpperCase();

  if (!userId) {
    return json({ success: false, message: "Il faut être connecté" }, { status: 400 });
  }

  if (!recipeId) {
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
    const currentDate = new Date();
    const endOfWeek = new Date(currentDate);
    endOfWeek.setDate(currentDate.getDate() + (7 - currentDate.getDay()));

    activeMenu = await prisma.menu.create({
      data: {
        userId,
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
      },
    });

    // Récupérer ou créer la liste de courses active
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

    // Récupérer les ingrédients de la recette
    const recipeIngredients = await prisma.recipeIngredient.findMany({
      where: {
        recipeId: parseInt(recipeId.toString()),
      },
      include: {
        ingredient: true,
      },
    });

    // Ajouter chaque ingrédient à la liste de courses
    for (const recipeIngredient of recipeIngredients) {
      // Vérifier si l'ingrédient existe déjà dans la liste POUR CETTE RECETTE SPÉCIFIQUE
      const existingItem = await prisma.shoppingItem.findFirst({
        where: {
          shoppingListId: activeShoppingList.id,
          ingredientId: recipeIngredient.ingredientId,
          recipeId: parseInt(recipeId.toString()),
          unit: recipeIngredient.unit,
        },
      });

      if (existingItem) {
        // Mettre à jour la quantité si l'ingrédient existe déjà pour cette recette
        await prisma.shoppingItem.update({
          where: {
            id: existingItem.id,
          },
          data: {
            quantity: recipeIngredient.quantity,
            unit: recipeIngredient.unit,
          },
        });
      } else {
        // Créer un nouvel élément avec la référence à la recette
        await prisma.shoppingItem.create({
          data: {
            shoppingListId: activeShoppingList.id,
            ingredientId: recipeIngredient.ingredientId,
            recipeId: parseInt(recipeId.toString()),
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
      return json({ success: true, message: "Recette retirée du menu. Aucune liste de courses trouvée." });
    }

    await prisma.shoppingItem.deleteMany({
      where: {
        shoppingListId: activeShoppingList.id,
        recipeId: recipeId
      }
    });

    return json({ success: true, message: "Recette retirée du menu et ingrédients correspondants supprimés de la liste de courses" });

  } catch (error) {
    console.log("Erreur lors du remove de la recette", error);
    return json({ success: false, message: "Erreur lors du remove de la recette" });
  }
}