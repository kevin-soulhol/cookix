import { json } from "@remix-run/node";
import { prisma } from "~/utils/db.server";

export async function loader() {

    try {
        const mealTypes = await prisma.meal.findMany({
            orderBy: { title: 'asc' }
        });
        return json({
            success: true,
            mealTypes
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des types de repas:", error);
        return json(
            { success: false, message: "Une erreur est survenue lors de la récupération des type de repas" },
            { status: 500 }
        );

    }
}