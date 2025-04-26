// scripts/seasonality-scraper.js
import { PrismaClient } from '@prisma/client';
import { chromium } from 'playwright';

const prisma = new PrismaClient();

async function scrapeSeasonalityData() {
  console.log('Démarrage du scraping de saisonnalité...');
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // URL du calendrier de saisonnalité de Greenpeace
    await page.goto('https://www.greenpeace.fr/guetteur/calendrier/');
    
    // Attendre que la page soit chargée
    await page.waitForSelector('li.month');
    
    // Objet pour stocker les données
    const seasonalData = {
      fruits: {},
      vegetables: {}
    };
    
    // Correspondance des noms de mois en français -> anglais
    const monthMap = {
      'janvier': 'january',
      'fevrier': 'february',
      'mars': 'march',
      'avril': 'april',
      'mai': 'may',
      'juin': 'june',
      'juillet': 'july',
      'aout': 'august',
      'septembre': 'september',
      'octobre': 'october',
      'novembre': 'november',
      'decembre': 'december'
    };
    
    // On doit d'abord trouver tous les mois et ouvrir chacun d'eux pour voir son contenu
    const months = await page.$$('li.month');
    
    for (let i = 0; i < months.length; i++) {
      const monthElement = months[i];
      
      // Récupérer l'ID du mois
      const monthId = await monthElement.$eval('a.anchor', anchor => anchor.getAttribute('id'));
      const monthName = await monthElement.$eval('h2', h2 => h2.textContent.trim().toLowerCase());
      const monthKey = monthMap[monthId] || monthId;
      
      console.log(`Traitement du mois: ${monthName} (${monthKey})`);
      
      // Si le mois n'est pas ouvert, on clique dessus pour l'ouvrir
      const isOpen = await monthElement.evaluate(el => el.classList.contains('open'));
      if (!isOpen) {
        await monthElement.$eval('header.month-header', header => header.click());
        await page.waitForTimeout(500); // Attendre que l'animation se termine
      }
      
      // Récupérer les légumes
      const vegetablesSelector = `#${monthId}-legumes + article ul li`;
      const vegetables = await page.$$(vegetablesSelector);
      
      for (const veg of vegetables) {
        const name = await veg.evaluate(el => el.textContent.trim().toLowerCase());
        const isPollinatorFriendly = await veg.evaluate(el => el.classList.contains('icon-abeille'));
        
        // Initialiser l'entrée si c'est un nouveau légume
        if (!seasonalData.vegetables[name]) {
          seasonalData.vegetables[name] = {
            isFruit: false,
            isVegetable: true,
            isPerennial: false,
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
            pollinatorFriendly: isPollinatorFriendly
          };
        }
        
        // Marquer ce légume comme disponible pour ce mois
        seasonalData.vegetables[name][monthKey] = true;
      }
      
      // Récupérer les fruits
      const fruitsSelector = `#${monthId}-fruits + article ul li`;
      const fruits = await page.$$(fruitsSelector);
      
      for (const fruit of fruits) {
        const name = await fruit.evaluate(el => el.textContent.trim().toLowerCase());
        const isPollinatorFriendly = await fruit.evaluate(el => el.classList.contains('icon-abeille'));
        
        // Initialiser l'entrée si c'est un nouveau fruit
        if (!seasonalData.fruits[name]) {
          seasonalData.fruits[name] = {
            isFruit: true,
            isVegetable: false,
            isPerennial: false,
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
            pollinatorFriendly: isPollinatorFriendly
          };
        }
        
        // Marquer ce fruit comme disponible pour ce mois
        seasonalData.fruits[name][monthKey] = true;
      }
      
      // Si on a ouvert le mois, le refermer pour libérer des ressources
      if (!isOpen) {
        await monthElement.$eval('header.month-header', header => header.click());
        await page.waitForTimeout(300); // Attendre que l'animation se termine
      }
    }
    
    // Vérifier les produits qui sont disponibles toute l'année
    for (const category of Object.keys(seasonalData)) {
      for (const [name, data] of Object.entries(seasonalData[category])) {
        // Si un produit est disponible tous les mois, marquer comme pérenne
        const monthsAvailable = Object.keys(monthMap).filter(month => data[monthMap[month]]).length;
        if (monthsAvailable === 12) {
          data.isPerennial = true;
        }
      }
    }
    
    console.log(`Données extraites pour ${Object.keys(seasonalData.vegetables).length} légumes et ${Object.keys(seasonalData.fruits).length} fruits.`);
    
    // Mettre à jour la base de données
    await updateDatabase(seasonalData);
    
    return seasonalData;
  } catch (error) {
    console.error('Erreur lors du scraping de saisonnalité:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

async function updateDatabase(seasonalData) {
  console.log('Mise à jour de la base de données...');
  
  const allIngredients = await prisma.ingredient.findMany();
  console.log(`${allIngredients.length} ingrédients trouvés dans la base de données.`);
  
  let matched = 0;
  let perennial = 0;
  
  // Créer un index d'ingrédients pour des recherches plus rapides
  const ingredientsByName = {};
  allIngredients.forEach(ingredient => {
    const key = ingredient.name.toLowerCase().trim();
    ingredientsByName[key] = ingredient;
  });
  
  // Créer une fonction générique pour normaliser les noms
  function normalizeIngredientName(name) {
    return name
      .trim()
      .toLowerCase()
      .replace(/^(les|des|du|de la|le|la)\s+/, '') // Enlever les articles
      .replace(/s$/, '') // Enlever le 's' final (pluriel)
      .replace(/\s+/g, ' '); // Normaliser les espaces
  }
  
  // Traiter les fruits et légumes
  for (const category of ['fruits', 'vegetables']) {
    for (const [name, data] of Object.entries(seasonalData[category])) {
      // Normaliser le nom pour améliorer les correspondances
      const normalizedName = normalizeIngredientName(name);
      
      // Différentes variantes de recherche pour maximiser les correspondances
      const searchVariants = [
        normalizedName,
        // Pour des ingrédients comme "pomme de terre", essayer aussi "pomme" seul
        ...normalizedName.split(' ').filter(part => part.length > 3)
      ];
      
      // Recherche dans l'index d'ingrédients
      const matchingIngredients = allIngredients.filter(ingredient => {
        const ingredientName = normalizeIngredientName(ingredient.name);
        
        // Vérifier différentes formes de correspondance
        return searchVariants.some(variant => 
          ingredientName === variant || 
          ingredientName.includes(variant) || 
          variant.includes(ingredientName)
        );
      });
      
      if (matchingIngredients.length > 0) {
        matched += matchingIngredients.length;
        console.log(`Mise à jour de ${matchingIngredients.length} ingrédients pour "${name}"`);
        
        // Mettre à jour chaque ingrédient correspondant
        for (const ingredient of matchingIngredients) {
          try {
            // Vérifier si une entrée de saisonnalité existe déjà
            const existingEntry = await prisma.ingredientSeason.findUnique({
              where: { ingredientId: ingredient.id }
            });
            
            if (existingEntry) {
              // Mettre à jour l'entrée existante
              await prisma.ingredientSeason.update({
                where: { id: existingEntry.id },
                data: {
                  january: data.january,
                  february: data.february,
                  march: data.march,
                  april: data.april,
                  may: data.may,
                  june: data.june,
                  july: data.july,
                  august: data.august,
                  september: data.september,
                  october: data.october,
                  november: data.november,
                  december: data.december,
                  isFruit: data.isFruit,
                  isVegetable: data.isVegetable,
                  isPerennial: data.isPerennial,
                  updatedAt: new Date()
                }
              });
            } else {
              // Créer une nouvelle entrée
              await prisma.ingredientSeason.create({
                data: {
                  ingredientId: ingredient.id,
                  january: data.january,
                  february: data.february,
                  march: data.march,
                  april: data.april,
                  may: data.may,
                  june: data.june,
                  july: data.july,
                  august: data.august,
                  september: data.september,
                  october: data.october,
                  november: data.november,
                  december: data.december,
                  isFruit: data.isFruit,
                  isVegetable: data.isVegetable,
                  isPerennial: data.isPerennial
                }
              });
            }
          } catch (error) {
            console.error(`Erreur lors de la mise à jour de l'ingrédient ${ingredient.name}:`, error);
          }
        }
      } else {
        console.log(`Aucun ingrédient trouvé pour "${name}"`);
      }
    }
  }
  
  // Marquer tous les ingrédients restants comme non-saisonniers (pérennes)
  const unmarkedIngredients = await prisma.ingredient.findMany({
    where: {
      seasonInfo: null
    }
  });
  
  console.log(`Marquage de ${unmarkedIngredients.length} ingrédients restants comme pérennes...`);
  
  for (const ingredient of unmarkedIngredients) {
    perennial++;
    try {
      await prisma.ingredientSeason.create({
        data: {
          ingredientId: ingredient.id,
          isPerennial: true,
          isFruit: false,
          isVegetable: false,
          january: true,
          february: true,
          march: true,
          april: true,
          may: true,
          june: true,
          july: true,
          august: true,
          september: true,
          october: true,
          november: true,
          december: true
        }
      });
    } catch (error) {
      console.error(`Erreur lors du marquage de l'ingrédient ${ingredient.name} comme pérenne:`, error);
    }
  }
  
  console.log(`Mise à jour terminée: ${matched} ingrédients correspondants, ${perennial} ingrédients marqués comme pérennes.`);
}

// Point d'entrée du script
scrapeSeasonalityData()
  .then(() => {
    console.log('Scraping de saisonnalité terminé avec succès.');
    prisma.$disconnect();
  })
  .catch(error => {
    console.error('Erreur lors du processus de scraping:', error);
    prisma.$disconnect();
    process.exit(1);
  });