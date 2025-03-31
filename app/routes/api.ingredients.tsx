import { LoaderFunctionArgs, json } from "@remix-run/node";
import { prisma } from "~/utils/db.server";

// Fonction pour normaliser le texte (retirer les accents)
function normalizeText(text: string): string {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

// Fonction pour calculer la pertinence d'un ingrédient par rapport à la recherche
function calculateRelevance(ingredientName: string, searchTerm: string): number {
    const normalizedName = normalizeText(ingredientName);
    const normalizedSearch = normalizeText(searchTerm);

    // Critères de pertinence (du plus important au moins important)
    let score = 0;

    // 1. Correspondance exacte (bonus maximum)
    if (normalizedName === normalizedSearch) {
        score += 1000;
    }

    // 2. Commence par le terme de recherche (très bon score)
    if (normalizedName.startsWith(normalizedSearch)) {
        score += 500;
    }

    // 3. Le terme recherché est un mot complet dans le nom
    const words = normalizedName.split(/\s+/);
    if (words.some(word => word === normalizedSearch)) {
        score += 200;
    }

    // 4. Contient le terme de recherche (score de base)
    if (normalizedName.includes(normalizedSearch)) {
        score += 100;
    }

    // 5. Bonus inversement proportionnel à la différence de longueur
    // (favorise les noms courts qui correspondent bien)
    const lengthDifference = Math.abs(normalizedName.length - normalizedSearch.length);
    score += Math.max(0, 50 - lengthDifference * 2);

    return score;
}

export async function loader({ request }: LoaderFunctionArgs) {
    const url = new URL(request.url);
    const search = url.searchParams.get("search");

    if (!search || search.length < 2) {
        return json({ ingredients: [] });
    }

    try {
        const allIngredients = await prisma.ingredient.findMany({
            select: {
                id: true,
                name: true,
            },
        });

        // Filtrer et trier les ingrédients par pertinence
        const filteredAndScoredIngredients = allIngredients
            .map(ingredient => {
                // Calculer un score de pertinence pour chaque ingrédient
                const relevance = calculateRelevance(ingredient.name, search);
                return { ...ingredient, relevance };
            })
            .filter(ingredient => ingredient.relevance > 0) // Ne garder que les ingrédients pertinents
            .sort((a, b) => b.relevance - a.relevance) // Trier par score décroissant
            .slice(0, 10); // Limiter à 10 résultats

        // Nettoyer les scores avant de renvoyer les résultats
        const ingredients = filteredAndScoredIngredients.map(({ id, name }) => ({ id, name }));

        return json({ ingredients });
    } catch (error) {
        console.error("Erreur lors de la recherche d'ingrédients:", error);
        return json(
            { success: false, message: "Une erreur est survenue", ingredients: [] },
            { status: 500 }
        );
    }
}