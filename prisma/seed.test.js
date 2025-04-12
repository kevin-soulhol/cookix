// prisma/seed.test.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function seedTestData() {

  // Ajouter les catégories
  const categories = await prisma.category.createMany({
    data: [
      { title: 'Entrées', sourceUrl: 'http://test.com/entrees' },
      { title: 'Plats', sourceUrl: 'http://test.com/plats' },
      { title: 'Desserts', sourceUrl: 'http://test.com/desserts' },
      { title: 'Boissons', sourceUrl: 'http://test.com/boissons' },
      { title: 'Accompagnements', sourceUrl: 'http://test.com/accompagnements' }
    ],
    skipDuplicates: true
  });

  // Ajouter les types de repas
  await prisma.meal.createMany({
    data: [
      { title: 'Petit-déjeuner', sourceUrl: 'http://test.com/petit-dejeuner' },
      { title: 'Déjeuner', sourceUrl: 'http://test.com/dejeuner' },
      { title: 'Dîner', sourceUrl: 'http://test.com/diner' },
      { title: 'Boisson', sourceUrl: 'http://test.com/boisson' },
      { title: 'Collation', sourceUrl: 'http://test.com/collation' }
    ],
    skipDuplicates: true
  });

  // Récupérer les IDs des catégories et types de repas pour les utiliser plus tard
  const categoryList = await prisma.category.findMany();
  const mealTypes = await prisma.meal.findMany();
  
  // Mapping pour un accès facile par nom
  const categoryMap = categoryList.reduce((map, cat) => {
    map[cat.title] = cat.id;
    return map;
  }, {});
  
  const mealTypeMap = mealTypes.reduce((map, meal) => {
    map[meal.title] = meal.id;
    return map;
  }, {});

  // Ajouter une variété d'ingrédients
  await prisma.ingredient.createMany({
    data: [
      { name: 'Farine' },
      { name: 'Œufs' },
      { name: 'Sucre' },
      { name: 'Sel' },
      { name: 'Lait' },
      { name: 'Beurre' },
      { name: 'Chocolat' },
      { name: 'Levure' },
      { name: 'Vanille' },
      { name: 'Pommes' },
      { name: 'Tomates' },
      { name: 'Poulet' },
      { name: 'Bœuf' },
      { name: 'Riz' },
      { name: 'Pâtes' },
      { name: 'Oignons' },
      { name: 'Ail' },
      { name: 'Carottes' },
      { name: 'Citron' },
      { name: 'Café' },
      { name: 'Fraises' },
      { name: 'Bananes' },
      { name: 'Crème' },
      { name: 'Fromage' }
    ],
    skipDuplicates: true
  });

  // Récupérer la liste des ingrédients
  const ingredients = await prisma.ingredient.findMany();
  
  // Mapping des ingrédients pour un accès facile par nom
  const ingredientMap = ingredients.reduce((map, ing) => {
    map[ing.name] = ing.id;
    return map;
  }, {});

  // Définir les recettes avec leurs détails
  const recipeData = [
    {
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
      categoryId: categoryMap['Desserts'],
      mealTypes: ['Collation'],
      ingredients: [
        { name: 'Farine', quantity: 200, unit: 'g' },
        { name: 'Œufs', quantity: 3, unit: null },
        { name: 'Sucre', quantity: 150, unit: 'g' },
        { name: 'Chocolat', quantity: 200, unit: 'g' },
        { name: 'Beurre', quantity: 100, unit: 'g' },
        { name: 'Levure', quantity: 1, unit: 'sachet' }
      ],
      steps: [
        { stepNumber: 1, instruction: 'Préchauffez le four à 180°C.' },
        { stepNumber: 2, instruction: 'Faites fondre le chocolat avec le beurre.' },
        { stepNumber: 3, instruction: 'Mélangez les œufs avec le sucre, puis ajoutez le mélange chocolat-beurre.' },
        { stepNumber: 4, instruction: 'Incorporez la farine et la levure.' },
        { stepNumber: 5, instruction: 'Versez la préparation dans un moule et enfournez pendant 30 minutes.' }
      ]
    },
    {
      title: 'Salade César',
      description: 'Une salade fraîche et croquante avec sa sauce crémeuse',
      preparationTime: 15,
      cookingTime: '0 min',
      servings: 4,
      difficulty: 'Facile',
      note: 4.3,
      voteNumber: 85,
      isVege: false,
      imageUrl: 'https://example.com/caesar-salad.jpg',
      sourceUrl: 'https://test.com/salade-cesar',
      categoryId: categoryMap['Entrées'],
      mealTypes: ['Déjeuner', 'Dîner'],
      ingredients: [
        { name: 'Laitue', quantity: 1, unit: 'pièce' },
        { name: 'Poulet', quantity: 200, unit: 'g' },
        { name: 'Œufs', quantity: 1, unit: null },
        { name: 'Fromage', quantity: 50, unit: 'g' },
        { name: 'Ail', quantity: 1, unit: 'gousse' }
      ],
      steps: [
        { stepNumber: 1, instruction: 'Lavez et coupez la laitue.' },
        { stepNumber: 2, instruction: 'Faites cuire le poulet et coupez-le en morceaux.' },
        { stepNumber: 3, instruction: 'Préparez la sauce avec l\'ail, l\'œuf et l\'huile.' },
        { stepNumber: 4, instruction: 'Mélangez tous les ingrédients et parsemez de fromage râpé.' }
      ]
    },
    {
      title: 'Risotto aux champignons',
      description: 'Un risotto crémeux aux champignons de Paris',
      preparationTime: 15,
      cookingTime: '25 min',
      servings: 4,
      difficulty: 'Moyen',
      note: 4.8,
      voteNumber: 110,
      isVege: true,
      imageUrl: 'https://example.com/mushroom-risotto.jpg',
      sourceUrl: 'https://test.com/risotto-champignons',
      categoryId: categoryMap['Plats'],
      mealTypes: ['Déjeuner', 'Dîner'],
      ingredients: [
        { name: 'Riz', quantity: 300, unit: 'g' },
        { name: 'Champignons', quantity: 250, unit: 'g' },
        { name: 'Oignons', quantity: 1, unit: 'pièce' },
        { name: 'Ail', quantity: 2, unit: 'gousses' },
        { name: 'Fromage', quantity: 50, unit: 'g' },
        { name: 'Beurre', quantity: 30, unit: 'g' }
      ],
      steps: [
        { stepNumber: 1, instruction: 'Faites revenir les oignons et l\'ail dans le beurre.' },
        { stepNumber: 2, instruction: 'Ajoutez le riz et faites-le nacrer.' },
        { stepNumber: 3, instruction: 'Ajoutez progressivement le bouillon chaud tout en remuant.' },
        { stepNumber: 4, instruction: 'Incorporez les champignons à mi-cuisson.' },
        { stepNumber: 5, instruction: 'Terminez avec le fromage et servez chaud.' }
      ]
    },
    {
      title: 'Smoothie aux fruits rouges',
      description: 'Un smoothie rafraîchissant aux fruits rouges et banane',
      preparationTime: 5,
      cookingTime: '0 min',
      servings: 2,
      difficulty: 'Facile',
      note: 4.7,
      voteNumber: 95,
      isVege: true,
      imageUrl: 'https://example.com/berry-smoothie.jpg',
      sourceUrl: 'https://test.com/smoothie-fruits-rouges',
      categoryId: categoryMap['Boissons'],
      mealTypes: ['Petit-déjeuner', 'Collation', 'Boisson'],
      ingredients: [
        { name: 'Fraises', quantity: 150, unit: 'g' },
        { name: 'Framboises', quantity: 100, unit: 'g' },
        { name: 'Bananes', quantity: 1, unit: 'pièce' },
        { name: 'Lait', quantity: 200, unit: 'ml' },
        { name: 'Miel', quantity: 1, unit: 'cuillère à soupe' }
      ],
      steps: [
        { stepNumber: 1, instruction: 'Lavez et équeutez les fraises.' },
        { stepNumber: 2, instruction: 'Épluchez et coupez la banane en morceaux.' },
        { stepNumber: 3, instruction: 'Mettez tous les ingrédients dans un blender.' },
        { stepNumber: 4, instruction: 'Mixez jusqu\'à obtenir une texture homogène.' }
      ]
    },
    {
      title: 'Lasagnes à la bolognaise',
      description: 'Un classique italien réconfortant',
      preparationTime: 30,
      cookingTime: '45 min',
      servings: 6,
      difficulty: 'Moyen',
      note: 4.9,
      voteNumber: 150,
      isVege: false,
      imageUrl: 'https://example.com/lasagna.jpg',
      sourceUrl: 'https://test.com/lasagnes-bolognaise',
      categoryId: categoryMap['Plats'],
      mealTypes: ['Déjeuner', 'Dîner'],
      ingredients: [
        { name: 'Pâtes à lasagne', quantity: 12, unit: 'feuilles' },
        { name: 'Bœuf', quantity: 500, unit: 'g' },
        { name: 'Tomates', quantity: 400, unit: 'g' },
        { name: 'Oignons', quantity: 1, unit: 'pièce' },
        { name: 'Ail', quantity: 2, unit: 'gousses' },
        { name: 'Fromage', quantity: 100, unit: 'g' }
      ],
      steps: [
        { stepNumber: 1, instruction: 'Préparez la sauce bolognaise avec la viande, les tomates, l\'oignon et l\'ail.' },
        { stepNumber: 2, instruction: 'Préparez la béchamel avec du beurre, de la farine et du lait.' },
        { stepNumber: 3, instruction: 'Alternez les couches de pâtes, de sauce bolognaise et de béchamel dans un plat.' },
        { stepNumber: 4, instruction: 'Terminez par une couche de fromage râpé.' },
        { stepNumber: 5, instruction: 'Enfournez à 180°C pendant 45 minutes.' }
      ]
    },
    {
      title: 'Tiramisu',
      description: 'Le dessert italien par excellence',
      preparationTime: 25,
      cookingTime: '0 min',
      servings: 8,
      difficulty: 'Moyen',
      note: 4.8,
      voteNumber: 130,
      isVege: true,
      imageUrl: 'https://example.com/tiramisu.jpg',
      sourceUrl: 'https://test.com/tiramisu',
      categoryId: categoryMap['Desserts'],
      mealTypes: ['Collation'],
      ingredients: [
        { name: 'Mascarpone', quantity: 250, unit: 'g' },
        { name: 'Œufs', quantity: 3, unit: null },
        { name: 'Sucre', quantity: 100, unit: 'g' },
        { name: 'Café', quantity: 200, unit: 'ml' },
        { name: 'Cacao', quantity: 30, unit: 'g' },
        { name: 'Biscuits', quantity: 24, unit: 'pièces' }
      ],
      steps: [
        { stepNumber: 1, instruction: 'Séparez les blancs des jaunes d\'œufs.' },
        { stepNumber: 2, instruction: 'Mélangez les jaunes avec le sucre puis incorporez le mascarpone.' },
        { stepNumber: 3, instruction: 'Montez les blancs en neige et incorporez-les délicatement au mélange.' },
        { stepNumber: 4, instruction: 'Trempez rapidement les biscuits dans le café et disposez-les dans le fond d\'un plat.' },
        { stepNumber: 5, instruction: 'Alternez couches de crème et biscuits, terminez par une couche de crème.' },
        { stepNumber: 6, instruction: 'Saupoudrez de cacao et réservez au frais pendant au moins 4 heures.' }
      ]
    },
    {
      title: 'Ratatouille',
      description: 'Un plat provençal coloré et savoureux',
      preparationTime: 20,
      cookingTime: '45 min',
      servings: 6,
      difficulty: 'Facile',
      note: 4.6,
      voteNumber: 85,
      isVege: true,
      imageUrl: 'https://example.com/ratatouille.jpg',
      sourceUrl: 'https://test.com/ratatouille',
      categoryId: categoryMap['Accompagnements'],
      mealTypes: ['Déjeuner', 'Dîner'],
      ingredients: [
        { name: 'Aubergines', quantity: 2, unit: 'pièces' },
        { name: 'Courgettes', quantity: 2, unit: 'pièces' },
        { name: 'Poivrons', quantity: 2, unit: 'pièces' },
        { name: 'Tomates', quantity: 4, unit: 'pièces' },
        { name: 'Oignons', quantity: 1, unit: 'pièce' },
        { name: 'Ail', quantity: 3, unit: 'gousses' }
      ],
      steps: [
        { stepNumber: 1, instruction: 'Coupez tous les légumes en dés de taille similaire.' },
        { stepNumber: 2, instruction: 'Faites revenir l\'oignon et l\'ail dans de l\'huile d\'olive.' },
        { stepNumber: 3, instruction: 'Ajoutez les légumes un à un en commençant par les plus fermes.' },
        { stepNumber: 4, instruction: 'Assaisonnez avec des herbes de Provence, du sel et du poivre.' },
        { stepNumber: 5, instruction: 'Laissez mijoter à couvert pendant 45 minutes à feu doux.' }
      ]
    },
    {
      title: 'Tarte aux pommes',
      description: 'Un classique de la pâtisserie française',
      preparationTime: 30,
      cookingTime: '40 min',
      servings: 8,
      difficulty: 'Moyen',
      note: 4.7,
      voteNumber: 110,
      isVege: true,
      imageUrl: 'https://example.com/apple-pie.jpg',
      sourceUrl: 'https://test.com/tarte-pommes',
      categoryId: categoryMap['Desserts'],
      mealTypes: ['Petit-déjeuner', 'Collation'],
      ingredients: [
        { name: 'Pâte brisée', quantity: 1, unit: 'pièce' },
        { name: 'Pommes', quantity: 6, unit: 'pièces' },
        { name: 'Sucre', quantity: 100, unit: 'g' },
        { name: 'Beurre', quantity: 50, unit: 'g' },
        { name: 'Cannelle', quantity: 1, unit: 'cuillère à café' }
      ],
      steps: [
        { stepNumber: 1, instruction: 'Étalez la pâte dans un moule à tarte.' },
        { stepNumber: 2, instruction: 'Épluchez et coupez les pommes en fines tranches.' },
        { stepNumber: 3, instruction: 'Disposez les pommes sur la pâte en cercles concentriques.' },
        { stepNumber: 4, instruction: 'Saupoudrez de sucre et de cannelle, ajoutez des noisettes de beurre.' },
        { stepNumber: 5, instruction: 'Enfournez à 180°C pendant 40 minutes.' }
      ]
    },
    {
      title: 'Cappuccino maison',
      description: 'Un café crémeux comme au café',
      preparationTime: 10,
      cookingTime: '0 min',
      servings: 2,
      difficulty: 'Facile',
      note: 4.5,
      voteNumber: 70,
      isVege: true,
      imageUrl: 'https://example.com/cappuccino.jpg',
      sourceUrl: 'https://test.com/cappuccino',
      categoryId: categoryMap['Boissons'],
      mealTypes: ['Petit-déjeuner', 'Boisson'],
      ingredients: [
        { name: 'Café', quantity: 50, unit: 'ml' },
        { name: 'Lait', quantity: 150, unit: 'ml' },
        { name: 'Sucre', quantity: 1, unit: 'cuillère à café' },
        { name: 'Cacao', quantity: 1, unit: 'pincée' }
      ],
      steps: [
        { stepNumber: 1, instruction: 'Préparez un café fort.' },
        { stepNumber: 2, instruction: 'Faites chauffer le lait.' },
        { stepNumber: 3, instruction: 'Faites mousser le lait avec un mousseur ou un fouet.' },
        { stepNumber: 4, instruction: 'Versez le café dans une tasse, puis ajoutez le lait mousseux.' },
        { stepNumber: 5, instruction: 'Saupoudrez d\'une pincée de cacao.' }
      ]
    },
    {
      title: 'Cocktail Mojito',
      description: 'Un cocktail cubain rafraîchissant',
      preparationTime: 10,
      cookingTime: '0 min',
      servings: 2,
      difficulty: 'Facile',
      note: 4.9,
      voteNumber: 95,
      isVege: true,
      imageUrl: 'https://example.com/mojito.jpg',
      sourceUrl: 'https://test.com/mojito',
      categoryId: categoryMap['Boissons'],
      mealTypes: ['Boisson'],
      ingredients: [
        { name: 'Rhum blanc', quantity: 100, unit: 'ml' },
        { name: 'Menthe', quantity: 20, unit: 'feuilles' },
        { name: 'Citron vert', quantity: 2, unit: 'pièces' },
        { name: 'Sucre', quantity: 2, unit: 'cuillères à soupe' },
        { name: 'Eau gazeuse', quantity: 200, unit: 'ml' },
        { name: 'Glace pilée', quantity: 200, unit: 'g' }
      ],
      steps: [
        { stepNumber: 1, instruction: 'Pilez les feuilles de menthe avec le sucre et le jus de citron vert.' },
        { stepNumber: 2, instruction: 'Ajoutez le rhum et mélangez bien.' },
        { stepNumber: 3, instruction: 'Remplissez le verre de glace pilée.' },
        { stepNumber: 4, instruction: 'Complétez avec de l\'eau gazeuse et décorez d\'une tranche de citron vert.' }
      ]
    }
  ];

  // Fonction pour créer une recette avec toutes ses relations
  async function createRecipeWithRelations(recipeInfo) {
    // Créer la recette de base
    const recipe = await prisma.recipe.create({
      data: {
        title: recipeInfo.title,
        description: recipeInfo.description,
        preparationTime: recipeInfo.preparationTime,
        cookingTime: recipeInfo.cookingTime,
        servings: recipeInfo.servings,
        difficulty: recipeInfo.difficulty,
        note: recipeInfo.note,
        voteNumber: recipeInfo.voteNumber,
        isVege: recipeInfo.isVege,
        imageUrl: recipeInfo.imageUrl,
        sourceUrl: recipeInfo.sourceUrl,
        categoryId: recipeInfo.categoryId
      }
    });

    // Ajouter les ingrédients à la recette
    if (recipeInfo.ingredients && recipeInfo.ingredients.length > 0) {
      const recipeIngredients = recipeInfo.ingredients.map(ing => {
        // Trouver l'id de l'ingrédient ou créer s'il n'existe pas
        let ingredientId = ingredientMap[ing.name];
        
        // Si l'ingrédient n'existe pas, on l'ajoute
        if (!ingredientId) {
          console.warn(`Ingrédient "${ing.name}" non trouvé dans la base. Vérifiez l'orthographe.`);
        }
        
        return {
          recipeId: recipe.id,
          ingredientId: ingredientId,
          quantity: ing.quantity,
          unit: ing.unit
        };
      }).filter(ing => ing.ingredientId); // Filtrer les ingrédients qui n'ont pas d'ID

      if (recipeIngredients.length > 0) {
        await prisma.recipeIngredient.createMany({
          data: recipeIngredients,
          skipDuplicates: true
        });
      }
    }

    // Ajouter les étapes de préparation
    if (recipeInfo.steps && recipeInfo.steps.length > 0) {
      await prisma.recipeStep.createMany({
        data: recipeInfo.steps.map(step => ({
          recipeId: recipe.id,
          stepNumber: step.stepNumber,
          instruction: step.instruction
        })),
        skipDuplicates: true
      });
    }

    // Ajouter les types de repas
    if (recipeInfo.mealTypes && recipeInfo.mealTypes.length > 0) {
      const mealAssociations = recipeInfo.mealTypes.map(mealName => {
        const mealId = mealTypeMap[mealName];
        if (!mealId) {
          console.warn(`Type de repas "${mealName}" non trouvé dans la base. Vérifiez l'orthographe.`);
          return null;
        }
        return {
          recipeId: recipe.id,
          mealId: mealId
        };
      }).filter(Boolean); // Filtrer les valeurs null

      if (mealAssociations.length > 0) {
        await prisma.mealOnRecipe.createMany({
          data: mealAssociations,
          skipDuplicates: true
        });
      }
    }

    return recipe;
  }

  // Créer toutes les recettes
  for (const recipeInfo of recipeData) {
    await createRecipeWithRelations(recipeInfo);
  }

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