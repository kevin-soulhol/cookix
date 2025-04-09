// prisma/seed-test.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Initialisation de la base de données de test...');
  
  // Créer une catégorie de test
  const category = await prisma.category.create({
    data: { title: 'Test Category', sourceUrl: 'https://testcategory.fr' }
  });
  
  // Créer un utilisateur de test
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: '$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u', // "password" hashé
    }
  });
  
  // Créer une recette de test
  const recipe = await prisma.recipe.create({
    data: {
      title: 'Test Recipe',
      description: 'Test Description',
      preparationTime: 30,
      cookingTime: 45,
      servings: 4,
      difficulty: 'facile',
      categoryId: category.id,
      sourceUrl: 'https://testrecipe.fr',
      imageUrl: 'https://example.com/image.jpg',
      steps: {
        create: [
          { stepNumber: 1, instruction: 'Step 1' },
          { stepNumber: 2, instruction: 'Step 2' }
        ]
      }
    }
  });
  
  // Enregistrer les IDs des données de test dans un fichier pour les récupérer dans les tests
  const fs = require('fs');
  const path = require('path');
  
  const testDataDir = path.join(__dirname, '../tests/e2e/fixtures');
  if (!fs.existsSync(testDataDir)) {
    fs.mkdirSync(testDataDir, { recursive: true });
  }
  
  fs.writeFileSync(
    path.join(testDataDir, 'test-data.json'), 
    JSON.stringify({
      users: [{ id: user.id, email: user.email }],
      categories: [{ id: category.id, title: category.title }],
      recipes: [{ id: recipe.id, title: recipe.title }]
    })
  );
  
  console.log('Base de données de test initialisée avec succès');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });