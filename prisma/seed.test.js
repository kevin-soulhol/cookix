// prisma/seed.test.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedTestData() {
  // Ajouter quelques catégories
  await prisma.category.createMany({
    data: [
      { title: 'Entrées', sourceUrl: 'http://test.com/entrees' },
      { title: 'Plats', sourceUrl: 'http://test.com/plats' },
      { title: 'Desserts', sourceUrl: 'http://test.com/desserts' }
    ],
    skipDuplicates: true
  });

  // Ajouter quelques types de repas
  await prisma.meal.createMany({
    data: [
      { title: 'Petit-déjeuner', sourceUrl: 'http://test.com/petit-dejeuner' },
      { title: 'Déjeuner', sourceUrl: 'http://test.com/dejeuner' },
      { title: 'Dîner', sourceUrl: 'http://test.com/diner' }
    ],
    skipDuplicates: true
  });

  // Ajouter quelques ingrédients
  await prisma.ingredient.createMany({
    data: [
      { name: 'Farine' },
      { name: 'Œufs' },
      { name: 'Sucre' },
      { name: 'Sel' },
      { name: 'Lait' }
    ],
    skipDuplicates: true
  });

  // Ajouter quelques recettes de test
  // (Cette partie peut être plus complexe en fonction de vos modèles)
  const categories = await prisma.category.findMany();
  const dessertCategory = categories.find(c => c.title === 'Desserts');

  // Exemple de recette
  const recipe1 = await prisma.recipe.create({
    data: {
      title: 'Gâteau au chocolat',
      description: 'Un délicieux gâteau au chocolat facile à préparer',
      preparationTime: 20,
      cookingTime: '30 min',
      servings: 8,
      difficulty: 'Facile',
      note: 4.5,
      voteNumber: 120,
      isVege: true,
      imageUrl: 'https://example.com/chocolate-cake.jpg',
      sourceUrl: 'https://test.com/gateau-chocolat',
      categoryId: dessertCategory?.id
    }
  });

  // Ajouter les ingrédients à la recette
  const ingredients = await prisma.ingredient.findMany();
  
  // Ajouter les ingrédients à la recette
  await prisma.recipeIngredient.createMany({
    data: [
      {
        recipeId: recipe1.id,
        ingredientId: ingredients.find(i => i.name === 'Farine')!.id,
        quantity: 200,
        unit: 'g'
      },
      {
        recipeId: recipe1.id,
        ingredientId: ingredients.find(i => i.name === 'Œufs')!.id,
        quantity: 3,
        unit: null
      },
      {
        recipeId: recipe1.id,
        ingredientId: ingredients.find(i => i.name === 'Sucre')!.id,
        quantity: 150,
        unit: 'g'
      }
    ]
  });

  // Ajouter les étapes de préparation
  await prisma.recipeStep.createMany({
    data: [
      {
        recipeId: recipe1.id,
        stepNumber: 1,
        instruction: 'Préchauffez le four à 180°C.'
      },
      {
        recipeId: recipe1.id,
        stepNumber: 2,
        instruction: 'Mélangez tous les ingrédients dans un saladier.'
      },
      {
        recipeId: recipe1.id,
        stepNumber: 3,
        instruction: 'Versez la préparation dans un moule et enfournez pendant 30 minutes.'
      }
    ]
  });

  // Ajouter d'autres recettes de test selon vos besoins
  
  console.log('Base de données de test remplie avec succès !');
}

seedTestData()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });