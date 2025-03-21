import { ActionFunctionArgs, json } from "@remix-run/node";
import { prisma } from "~/utils/db.server";
import { getUserId } from "./api.user";

export async function action({ request }: ActionFunctionArgs) {
  const userId = await getUserId(request);

  const formData = await request.formData();
  const recipeId = formData.get("recipeId");
  const actionType = formData.get("action");

  if (!userId) {
    return json({ success: false, message: "Il faut être connecté" }, { status: 400 });
  }
  if (!recipeId) {
    return json({ success: false, message: "ID de recette manquant" }, { status: 400 });
  }

  try {
    if (actionType === "add") {
      // Ajouter aux favoris
      await prisma.favorite.create({
        data: {
          userId,
          recipeId: parseInt(recipeId.toString()),
        },
      });

      return json({ success: true, message: "Recette ajoutée aux favoris" });
    } else if (actionType === "remove") {
      // Supprimer des favoris
      await prisma.favorite.deleteMany({
        where: {
          userId,
          recipeId: parseInt(recipeId.toString()),
        },
      });

      return json({ success: true, message: "Recette retirée des favoris" });
    } else {
      return json({ success: false, message: "Action non reconnue" }, { status: 400 });
    }
  } catch (error) {
    console.error("Erreur lors de la gestion des favoris:", error);
    return json(
      { success: false, message: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}