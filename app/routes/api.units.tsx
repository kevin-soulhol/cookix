import { json } from "@remix-run/node";
import { prisma } from "~/utils/db.server";

export async function loader() {
    try {
        // Récupérer toutes les unités uniques de la table RecipeIngredient
        const recipeIngredients = await prisma.recipeIngredient.findMany({
            select: {
                unit: true
            },
            distinct: ['unit'],
            where: {
                unit: {
                    not: null
                }
            }
        });

        // Extraire et trier les unités
        const units = recipeIngredients
            .map(item => item.unit)
            .filter(Boolean) // Filtrer les valeurs null ou undefined
            .sort();

        return json({
            success: true,
            units
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des unités:", error);
        return json(
            { success: false, message: "Erreur lors de la récupération des unités", units: [] },
            { status: 500 }
        );
    }
}