import { PrismaClient } from '@prisma/client';
import { readFile } from 'fs/promises';
import { connect } from 'http2';
import path from 'path';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();

async function seed() {
  // Récupérer le nom du fichier depuis les arguments
  const filename = process.argv[2];
  if (!filename) {
    console.error('❌ Erreur : Veuillez spécifier un nom de fichier JSON à charger.');
    console.log('   Exemple: npm run db:add -- recettes_completes.json');
    process.exit(1);
  }

  console.log(`🚀 Démarrage du seeding avec le fichier : ${filename}`);

  try {
    // Lire et parser le fichier de données
    const currentDir = path.dirname(fileURLToPath(import.meta.url));
    const dataPath = path.join(currentDir, 'data', filename);
    const fileContent = await readFile(dataPath, 'utf-8');
    const recipesData = JSON.parse(fileContent);

    for (const recipeData of recipesData) {
      console.log(`\nProcessing recipe: ${recipeData.title}`);

      if (!recipeData.imageUrl) {
        recipeData.imageUrl = await fetchRecipeImage(recipeData.title);
      }

      // On utilise une transaction pour garantir l'intégrité des données pour chaque recette
      await prisma.$transaction(async (tx) => {
        const category = await tx.category.findUnique({ where : { id: recipeData.categoryId}})

        const mealConnectPayload = await Promise.all(
          (recipeData.meals || []).map(async (mealId) => { // "|| []" pour éviter les erreurs si le tableau est absent
            const meal = await tx.meal.findUnique({
              where: { id: mealId },
            });
            // On prépare la structure pour la relation many-to-many
            return { meal: { connect: { id: meal.id } } };
          })
        );
        if (mealConnectPayload.length > 0) {
            console.log(`  -> ${mealConnectPayload.length} meals processed.`);
        }

        // 2. Préparation des données pour les ingrédients
        // On doit d'abord s'assurer que tous les ingrédients existent
        // pour ensuite pouvoir les lier à la recette.
        const ingredientPayloads = await Promise.all(
          recipeData.ingredients.map(async (ingData) => {
            const ingredient = await tx.ingredient.upsert({
              where: { name: ingData.name },
              update: {}, // Rien à mettre à jour sur l'ingrédient lui-même
              create: { name: ingData.name },
            });
            return {
              ingredientId: ingredient.id,
              quantity: ingData.quantity,
              unit: ingData.unit,
            };
          })
        );
        console.log(`  -> ${ingredientPayloads.length} ingredients processed.`);

        // 3. Upsert de la Recette principale avec ses relations
        await tx.recipe.upsert({
          where: { sourceUrl: recipeData.sourceUrl },
          // Données à mettre à jour si la recette existe déjà
          update: {
            title: recipeData.title,
            description: recipeData.description,
            preparationTime: recipeData.preparationTime,
            cookingTime: recipeData.cookingTime,
            servings: recipeData.servings,
            difficulty: recipeData.difficulty,
            isVege: recipeData.isVege,
            imageUrl: recipeData.imageUrl,
            category: {
              connect: { id: category.id } // Correct, on connecte une relation
            },
            meals: {
              deleteMany: {}, // Supprime les anciens pas
              create: mealConnectPayload
            },
            onRobot: false,
            // Pour les relations "many", la stratégie est de tout supprimer
            // puis de tout recréer pour refléter parfaitement le fichier JSON.
            steps: {
              deleteMany: {}, // Supprime les anciens pas
              create: recipeData.steps.map((instruction, index) => ({
                stepNumber: index + 1,
                instruction: instruction,
              })),
            },
            ingredients: {
              deleteMany: {}, // Supprime les anciens liens d'ingrédients
              create: ingredientPayloads.map((payload) => ({
                ingredientId: payload.ingredientId,
                quantity: payload.quantity,
                unit: payload.unit,
              })),
            },
          },
          // Données à créer si la recette n'existe pas
          create: {
            sourceUrl: recipeData.sourceUrl,
            title: recipeData.title,
            description: recipeData.description,
            preparationTime: recipeData.preparationTime,
            cookingTime: recipeData.cookingTime,
            servings: recipeData.servings,
            difficulty: recipeData.difficulty,
            isVege: recipeData.isVege,
            imageUrl: recipeData.imageUrl,
            category: {
              connect: { id: category.id },
            },
            meals: {
              create: mealConnectPayload
            },
            onRobot: false,
            steps: {
              create: recipeData.steps.map((instruction, index) => ({
                stepNumber: index + 1,
                instruction: instruction,
              })),
            },
            ingredients: {
              create: ingredientPayloads.map((payload) => ({
                ingredientId: payload.ingredientId,
                quantity: payload.quantity,
                unit: payload.unit,
              })),
            },
          },
        });
        console.log(`  -> ✅ Recipe "${recipeData.title}" upserted successfully!`);
      });
    }

    console.log('\n✅ Seeding terminé avec succès !');

  } catch (error ) {
    if (error.code === 'ENOENT') {
      console.error(`❌ Erreur : Le fichier '${filename}' est introuvable dans 'prisma/data/'.`);
    } else {
      console.error('❌ Une erreur est survenue pendant le seeding :', error);
    }
    process.exit(1);
  }
}

// --- NOUVELLE FONCTION POUR CHERCHER L'IMAGE ---
async function fetchRecipeImage(query) {
  // On vérifie que la clé API est bien présente
  if (!process.env.PEXELS_API_KEY) {
    console.warn('  -> ⚠️ PEXELS_API_KEY non définie. Impossible de chercher une image.');
    return null;
  }

  try {
    console.log(`  -> 📸 Recherche d'une image pour "${query}" sur Pexels...`);
    const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`, {
      headers: {
        Authorization: process.env.PEXELS_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur API Pexels: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Si on a des photos, on retourne l'URL de la meilleure qualité
    if (data.photos && data.photos.length > 0) {
      const imageUrl = data.photos[0].src.large2x; // ou .original, .large, etc.
      console.log(`  -> ✨ Image trouvée : ${imageUrl}`);
      return imageUrl;
    }

    console.log('  -> 😕 Aucune image trouvée.');
    return null;
  } catch (error) {
    console.error('  -> ❌ Erreur lors de la recherche d\'image sur Pexels :', error);
    return null;
  }
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });