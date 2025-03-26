import { json } from "@remix-run/node";
import { prisma } from "~/utils/db.server";

export async function loader() {

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