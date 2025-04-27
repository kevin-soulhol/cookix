import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function resetAllSeasonalityFlags() {
  console.log('Début de la réinitialisation des données de saisonnalité...');

  try {
    // Mettre à jour TOUTES les entrées dans IngredientSeason
    const updateResult = await prisma.ingredientSeason.updateMany({
      where: {}, // Appliquer à toutes les lignes
      data: {
        // Remettre à zéro les indicateurs de type
        isFruit: false,
        isVegetable: false,

        // Remettre à zéro le statut pérenne
        // Le scraper le recalculera si nécessaire pour les vrais fruits/légumes
        isPerennial: true,

        // Remettre à zéro tous les mois
        // Le scraper les remplira correctement lors de la prochaine exécution
        january: false,
        february: false,
        march: false,
        april: false,
        may: false,
        june: false,
        july: false,
        august: false,
        september: false,
        october: false,
        november: false,
        december: false,

        // Optionnel : vous pourriez aussi vouloir vider apiIdentifier et lastChecked
        // apiIdentifier: null,
        // lastChecked: null,
      }
    });

    console.log(`Réinitialisation terminée. ${updateResult.count} enregistrements IngredientSeason ont été mis à jour.`);
    console.log('Tous les ingrédients sont maintenant marqués comme ni fruit, ni légume, non pérennes, et non disponibles pour aucun mois.');
    console.log('Exécutez maintenant le script de scraping (seasonality-scraper.js) pour remplir les données correctes.');

  } catch (error) {
    console.error('Erreur lors de la réinitialisation des données de saisonnalité:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter la fonction de réinitialisation
resetAllSeasonalityFlags();