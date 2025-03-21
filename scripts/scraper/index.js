const { chromium } = require('playwright');
const { PrismaClient } = require('@prisma/client');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// Initialisation avec gestion des erreurs
let prisma;
try {
  prisma = new PrismaClient({
    // Pour plus de détails sur les erreurs
    log: ['query', 'info', 'warn', 'error']
  });
  console.log("Prisma Client initialized successfully");
} catch (error) {
  console.error("Failed to initialize Prisma Client:", error);
  process.exit(1);
}

async function main() {
  logWithTimestamp('Starting scheduled recipe scraper...');
  
  const browser = await chromium.launch({
    headless: true
  });
  
  try {
    logWithTimestamp('Scraper initialized successfully');
    
    // Liste des sites à scraper
    const sites = [
      {
        name: 'Cookomix',
        url: 'https://www.cookomix.com/recettes-thermomix/',
        scraper: scrapeCookomix
      }
    ];
    
    for (const site of sites) {
      logWithTimestamp(`Scraping ${site.name}...`);
      await site.scraper(browser);
      logWithTimestamp(`Finished scraping ${site.name}`);
    }
    
  } catch (error) {
    logWithTimestamp('Error running scraper:', error);
  } finally {
    await browser.close();
    await prisma.$disconnect();
    logWithTimestamp('Scraper finished');
  }
}

async function scrapeCookomix(browser) {
  const page = await browser.newPage();

  // Configurer des en-têtes réalistes
    await page.setExtraHTTPHeaders({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Referer': 'https://www.google.com/'
    });
  
  try {
    // Accéder à la page principale des recettes avec plus de timeout et attente
    await page.goto('https://www.cookomix.com/recettes-thermomix/', {
        waitUntil: 'networkidle',
        timeout: 60000  // Augmenter le timeout à 60 secondes
      });
    
     console.log('Checking page content...');
     // Vérifier si la page est chargée correctement
    const pageTitle = await page.title();
    console.log(`Page title: ${pageTitle}`);

    // Vérifier si nous sommes bien sur la bonne page
    const selectorCategories = 'main .recipe-list.recipe-filter ul.category li a'
    const selectorRecipes = 'main .entries .entry'

    // Récupérer les liens des catégories
    const categoryLinks = await page.$$eval(selectorCategories, links => 
      links.map(link => {
        return {
            title: link.querySelector('span').textContent.trim(),
            url: `https://www.cookomix.com/recettes/categories/${link.dataset.taxonomyTerms}/`
        }
      })
    );
    
    console.log(`Found ${categoryLinks.length} categories`);

    let recipeLinks =[];
    for (let i = 0; i < Math.min(2, categoryLinks.length); i++) {
        await wait(3, 7);

        const category = categoryLinks[i];
        console.log(`Processing category: ${category.title} - ${category.url}`);


        await page.goto(category.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
        await scrollPageToBottom(page);
        await page.waitForTimeout(400);
        const recipesInPage = await page.$$eval(selectorRecipes, recipes => 
            recipes.map(recipe => ({
                title: recipe.querySelector('h2'),
                url: recipe.querySelector('a').href
            }))  
        )
        recipeLinks = [...recipeLinks, ...recipesInPage];

        // Pour chaque recette, extraire les détails (limité à 3 recettes par catégorie pour les tests)
        for (let j = 0; j < Math.min(5, recipesInPage.length); j++) {
            const recipe = recipesInPage[j];
            await scrapeRecipeDetails(page, recipe.url, category.title);
        }
    }

    console.log(`Found ${recipeLinks.length} recipes`);

    
  } catch (error) {
    console.error('Error scraping Cookomix:', error);
  } finally {
    await page.close();
  }
}


async function scrapeRecipeDetails(page, url, category) {
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      console.log(`Scraping recipe at ${url}`);
      
      // Extraire les détails de la recette
      const recipeData = await page.evaluate(() => {
        // Fonction pour nettoyer le texte
        const cleanText = text => text ? text.trim().replace(/\s+/g, ' ') : null;
        
        // Extraire le titre
        const title = cleanText(document.querySelector('h1.entry-title').textContent);
        
        // Extraire la description
        const description = cleanText(document.querySelector('.recipe-container .recipe-content .intro')?.textContent);
        
        // Extraire les temps et autres infos
        const preparationTime = parseInt(document.querySelector('.basic.prez dd:nth-child(2)')?.textContent) || null;
        const cookingTime = parseInt(document.querySelector('.basic.prez dd:nth-child(4)')?.textContent) || null;
        const servings = parseInt(document.querySelector('.basic.prez dd:nth-child(8)')?.textContent) || null;
        
        // Extraire la difficulté
        const difficulty = document.querySelector('.basic.prez dd:nth-child(6)')?.textContent;
        
        // Extraire l'image
        const imageUrl = document.querySelector('.recipe-container .recipe-img img')?.src;
        
        // Extraire les ingrédients
        const ingredients = [];
        const tmpIngredients = document.querySelectorAll('#sidebar .ingredients dt');

        document.querySelectorAll('#sidebar .ingredients dd').forEach((el, i)=> {
          const quantityEl = tmpIngredients[i]?.textContent
          const name = el.querySelector('a')?.textContent;


          
          if (name && quantityEl && typeof quantityEl === 'string') {
            let match = quantityEl?.match(/^([\d.,]+)\s*([\wéèà ]+)?$/)

            let quantity = parseFloat(match[1]?.replace(',', '.') || 0); // Remplacer la virgule par un point pour un format numérique valide
            let unit = match[2]; // L'unité (ex. : kilogrammes)
            const ingredient = {
              quantity,
              unit,
              name: name
            };
            ingredients.push(ingredient);
          }
        });

        // extraire la note
        const note = parseFloat(document.querySelector('.ec-stars-rating-value')?.textContent.replace(",", ".")) ;
        
        // Extraire les étapes
        const steps = [];
        document.querySelectorAll('.recipe-content .instructions li').forEach((el, index) => {
          steps.push({
            stepNumber: index + 1,
            instruction: cleanText(el.textContent)
          });
        });
        
        return {
          title,
          description,
          preparationTime,
          cookingTime,
          servings,
          difficulty,
          note,
          imageUrl,
          sourceUrl: window.location.href,
          ingredients,
          steps
        };
      });
      
      console.log(`Scraped recipe: ${recipeData.title}`);
      
      // Enregistrer la recette dans la base de données
      await saveRecipe(recipeData, category);
      
    } catch (error) {
      console.error(`Error scraping recipe at ${url}:`, error);
    }
  }

// Fonction d'attente avec délai aléatoire
async function wait(minSeconds = 2, maxSeconds = 5) {
    const delay = Math.floor(Math.random() * (maxSeconds - minSeconds + 1) + minSeconds) * 1000;
    console.log(`Waiting for ${delay/1000} seconds...`);
    return new Promise(resolve => setTimeout(resolve, delay));
}

async function scrollPageToBottom(page, maxScrolls = 10, scrollDelay = 300) {
    // Passer les arguments en un seul objet
    await page.evaluate(({ maxScrolls, delay }) => {
        return new Promise((resolve) => {
            let scrollCount = 0;
            const distance = 400;
            const timer = setInterval(() => {
                window.scrollBy(0, distance);
                scrollCount++;

                if (scrollCount >= maxScrolls || 
                    window.innerHeight + window.scrollY >= document.body.scrollHeight) {
                        clearInterval(timer);
                        resolve();
                }
            }, delay);
        });
    }, { maxScrolls, delay: scrollDelay });
}


async function saveRecipe(recipeData, category) {
  try {
    // Vérifier si la recette existe déjà
    const existingRecipe = await prisma.recipe.findFirst({
      where: {
        sourceUrl: recipeData.sourceUrl
      }
    });
    
    if (existingRecipe) {
      logWithTimestamp(`Recipe already exists: ${recipeData.title} [ID: ${existingRecipe.id}]`);

      // Vous pourriez ajouter ici une logique de mise à jour si nécessaire
      // Ex: mettre à jour la note ou d'autres attributs qui peuvent changer
      const updatedFields = {};
      
      // Mise à jour de la note si elle est différente
      if (recipeData.note !== existingRecipe.note && recipeData.note !== null) {
        updatedFields.note = recipeData.note;
      }
      
      // Mise à jour du temps de préparation si celui-ci a changé
      if (recipeData.preparationTime !== existingRecipe.preparationTime && recipeData.preparationTime !== null) {
        updatedFields.preparationTime = recipeData.preparationTime;
      }
      
      // Mise à jour du temps de cuisson s'il a changé
      if (recipeData.cookingTime !== existingRecipe.cookingTime && recipeData.cookingTime !== null) {
        updatedFields.cookingTime = recipeData.cookingTime;
      }
      
      // Mise à jour du nombre de portions s'il a changé
      if (recipeData.servings !== existingRecipe.servings && recipeData.servings !== null) {
        updatedFields.servings = recipeData.servings;
      }
      
      // Si l'image est vide dans la base de données mais disponible maintenant, la mettre à jour
      if (!existingRecipe.imageUrl && recipeData.imageUrl) {
        updatedFields.imageUrl = recipeData.imageUrl;
      }
      
      // Si la description est vide dans la base de données mais disponible maintenant, la mettre à jour
      if (!existingRecipe.description && recipeData.description) {
        updatedFields.description = recipeData.description;
      }
      
      // Si nous avons des champs à mettre à jour
      if (Object.keys(updatedFields).length > 0) {
        const updatedRecipe = await prisma.recipe.update({
          where: { id: existingRecipe.id },
          data: updatedFields
        });
        
        logWithTimestamp(`Updated recipe ${existingRecipe.id} - ${existingRecipe.title} with new data: ${JSON.stringify(updatedFields)}`);
      } else {
        logWithTimestamp(`No updates needed for recipe ${existingRecipe.id}`);
      }
      
      return;
    }
    
    // Créer une nouvelle recette
    const recipe = await prisma.recipe.create({
      data: {
        title: recipeData.title,
        description: recipeData.description,
        preparationTime: recipeData.preparationTime,
        cookingTime: recipeData.cookingTime,
        servings: recipeData.servings,
        difficulty: recipeData.difficulty,
        note: recipeData.note,
        imageUrl: recipeData.imageUrl,
        sourceUrl: recipeData.sourceUrl,
        // Créer les étapes de la recette
        steps: {
          create: recipeData.steps
        }
      }
    });
    
    logWithTimestamp(`Created recipe: ${recipe.id} - ${recipe.title}`);
    
    // Ajouter les ingrédients
    for (const ingredientData of recipeData.ingredients) {
      // Trouver ou créer l'ingrédient
      let ingredient = await prisma.ingredient.findUnique({
        where: { name: ingredientData.name }
      });
      
      if (!ingredient) {
        ingredient = await prisma.ingredient.create({
          data: { name: ingredientData.name }
        });
      }
      
      // Associer l'ingrédient à la recette
      await prisma.recipeIngredient.create({
        data: {
          recipeId: recipe.id,
          ingredientId: ingredient.id,
          quantity: ingredientData.quantity,
          unit: ingredientData.unit
        }
      });
    }
    
    console.log(`Added ${recipeData.ingredients.length} ingredients to recipe ${recipe.id}`);
    
  } catch (error) {
    logWithTimestamp('Error saving recipe to database:', error);
  }
}

// Fonction utilitaire pour logger avec horodatage
function logWithTimestamp(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

// Fonction pour exécuter avec des tentatives
async function runWithRetry(fn, maxRetries = 3, initialDelay = 5000) {
  let lastError = null;
  let delay = initialDelay;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      logWithTimestamp(`Attempt ${attempt}/${maxRetries} failed: ${error.message}`);
      
      if (attempt < maxRetries) {
        logWithTimestamp(`Retrying in ${delay/1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Délai exponentiel
      }
    }
  }
  
  throw lastError;
}


/* main().catch(error => {
  console.error('Unhandled error in main function:', error);
  process.exit(1);
}); */