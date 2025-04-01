const { chromium } = require('playwright');
const { PrismaClient, Prisma } = require('@prisma/client');
const path = require('path');
// eslint-disable-next-line no-undef
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const AuthorizedOnlyTypeMeal = ['Plat principal', "Accompagnement", "Boisson", "Apéritif", "Dessert", "Entrée", "Petit déjeuner"]
const StartByTypeMeal = process.argv[2] ||false ;
// Initialisation avec gestion des erreurs
let prisma;
try {
  prisma = new PrismaClient({
    // Pour plus de détails sur les erreurs
    log: ['query', 'info', 'warn', 'error']
  });
  logWithTimestamp(`Prisma Client initialized successfully`);
} catch (error) {
  console.error("Failed to initialize Prisma Client:", error);
  // eslint-disable-next-line no-undef
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

    // Récupérer les liens des catégories
    const categoryLinks = await getAndSaveCategories(page);

    //Récupérer les types de plats
    const mealTypeLinks = await getAndSaveMealType(page);

      const trouverIndexParTitre = function(tableau, titreRecherche) {
        return tableau.findIndex(objet => objet.title === titreRecherche);
      }

    let startAt = 0;
    if(StartByTypeMeal){
      //commence par une des catégories
      startAt = trouverIndexParTitre(categoryLinks, StartByTypeMeal);
      for(let d = startAt; d < categoryLinks.length; d++){
        const recipesInPage = await getAllLinkRecipeBy(page, categoryLinks[d]);
        for (let i = 0; i < recipesInPage.length; i++) {
          await scrapeRecipeDetailsAndSave(page, recipesInPage[i], i, categoryLinks.length);
        }
      }
    } else {
      // Sinon, en random
      const CategoryRandom = getRandomElement(categoryLinks);
      await scrapeRecipeDetailsAndSave(page, CategoryRandom, 1, 1);
    }

    logWithTimestamp(`Start scrap by ${StartByTypeMeal}:${startAt}`)


    
  } catch (error) {
    console.error('Error scraping Cookomix:', error);
  } finally {
    await page.close();
  }
}

async function getAndSaveCategories(page){
  logWithTimestamp('Récupération des catégories');
  const selectorCategories = 'main .recipe-list.recipe-filter ul.category li a'

  // Récupérer les liens des catégories
  const categoryLinks = await page.$$eval(selectorCategories, links => 
    links.map(link => {
      return {
          title: link.querySelector('span').textContent.trim(),
          sourceUrl: `https://www.cookomix.com/recettes/categories/${link.dataset.taxonomyTerms}/`
      }
    })
  );

  try {

    for (let i = 0; i < categoryLinks.length; i++) {
      const category = categoryLinks[i]
      const newCategory = await prisma.category.upsert({
        where : {
          sourceUrl: category.sourceUrl
        },
        create : {
          title: category.title,
          sourceUrl: category.sourceUrl
        },
        update: {
          title: category.title
        }
      })

      if(newCategory.createdAt === newCategory.updatedAt){
        logWithTimestamp(`Création de la catégorie : ${newCategory.title}`);
      }
    }

    return categoryLinks;
  } catch(error){
    logWithTimestamp("Erreur dans l'enregistrement des catégories", error);
  }

  return categoryLinks;
}

async function getAndSaveMealType(page){
  logWithTimestamp('Récupération des types de plat');
  const selectorMealType = 'main .recipe-list.recipe-filter ul.meal-course li a'

  // Récupérer les liens des catégories
  const mealLinks = await page.$$eval(selectorMealType, links => 
    links.map(link => {
      return {
          title: link.querySelector('span').textContent.trim(),
          sourceUrl: `https://www.cookomix.com/recettes/type-plat/${link.dataset.taxonomyTerms}/`
      }
    })
  );

  try {
    for (let i = 0; i < mealLinks.length; i++) {
      const type = mealLinks[i]
      const newType = await prisma.meal.upsert({
        where : {
          sourceUrl: type.sourceUrl
        },
        create : {
          title: type.title,
          sourceUrl: type.sourceUrl
        },
        update: {
          title: type.title
        }
      })
      if(newType.createdAt === newType.updatedAt){
        logWithTimestamp(`Création du type de repas : ${newType.title}`);
      }
    }

    return mealLinks;
  } catch(error){
    logWithTimestamp("Erreur dans l'enregistrement des type de repas", error);
  }

  return mealLinks;
}

async function getAllLinkRecipeBy(page, category){
  logWithTimestamp(`Début de la récupération des recettes de la page ${category.title}`)
  const selectorRecipes = 'main .entries .entry';

  await page.goto(category.sourceUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await scrollPageToBottom(page);
  const recipesInPage = await page.$$eval(selectorRecipes, recipes => 
    recipes.map(recipe => ({
        title: recipe.querySelector('h2').textContent.trim(),
        sourceUrl: recipe.querySelector('a').href
    }))  
  )

  logWithTimestamp(`Find ${recipesInPage.length} recipes in ${category.sourceUrl}`);
  return recipesInPage;
}

async function scrapeRecipeDetailsAndSave(page, recipe, number, maxRecipe) {
    try {
      await page.goto(recipe.sourceUrl, { waitUntil: 'domcontentloaded' });
      logWithTimestamp(`(${number}/${maxRecipe})  Scraping recipe at ${recipe.sourceUrl}`);
      
      // Extraire les détails de la recette
      const recipeData = await page.evaluate(() => {
        // Fonction pour nettoyer le texte
        const cleanText = text => text ? text.trim().replace(/\s+/g, ' ') : null;
        
        // Extraire la description
        const descriptionElement = document.querySelector('.recipe-container .recipe-content .intro');
        const description = descriptionElement ? descriptionElement.innerHTML : null;
      

        let preparationTime = null;
        let cookingTime = null;
        let servings = null;
        let difficulty = null;

        // Récupérer toutes les paires dt/dd
        const dtElements = document.querySelectorAll('.basic.prez dt');
        const ddElements = document.querySelectorAll('.basic.prez dd');

        // Parcourir toutes les paires
        for (let i = 0; i < dtElements.length; i++) {
          const label = cleanText(dtElements[i].textContent).toLowerCase();
          const value = cleanText(ddElements[i].textContent);
          
          if (label.includes('préparation')) {
            preparationTime = parseInt(value) || null;
          } else if (label.includes('durée totale') || label.includes('cuisson')) {
            cookingTime = value || null;
          } else if (label.includes('difficulté')) {
            difficulty = value;
          } else if (label.includes('parts') || label.includes('portion')) {
            servings = parseInt(value) || null;
          }
        }
        
        // Extraire l'image
        const imageUrl = document.querySelector('.recipe-container .recipe-img img')?.src;
        
        //Extraire le type de repas
        const meals = []
        document.querySelectorAll('.recipe-themes .meal-course').forEach(el => {
          meals.push({
            title: el.textContent,
            sourceUrl: el.href
          })
        })

        //extraire les catégories
        const categories = [];
        document.querySelectorAll('.recipe-themes .category').forEach(el => {
          categories.push({
            title: el.textContent,
            sourceUrl: el.href
          })
        })

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
        const voteNumber = parseFloat(document.querySelector('.ec-stars-rating-count')?.textContent.replace(",", ".")) ;
        
        
        // Extraire les étapes
        const steps = [];
        document.querySelectorAll('.recipe-content .instructions li').forEach((el, index) => {
          steps.push({
            stepNumber: index + 1,
            instruction: el.innerHTML
          });
        });

        
        return {
          description,
          preparationTime,
          cookingTime,
          servings,
          difficulty,
          note,
          voteNumber,
          imageUrl,
          ingredients,
          steps,
          meals,
          category: categories[0]
        };
      });

      recipeData.title = recipe.title;
      recipeData.sourceUrl = recipe.sourceUrl;
      
      // Enregistrer la recette dans la base de données
      await saveRecipe(recipeData);
      
    } catch (error) {
      logWithTimestamp(`Error scraping recipe at ${recipe.title}:`, error);
    }
}

// Fonction d'attente avec délai aléatoire
async function wait(minSeconds = 2, maxSeconds = 5) {
    const delay = Math.floor(Math.random() * (maxSeconds - minSeconds + 1) + minSeconds) * 1000;
    return new Promise(resolve => setTimeout(resolve, delay));
}

async function scrollPageToBottom(page, scrollDelay = 300, maxScrollTime = 90000) {
  // Définit une durée maximale pour éviter un défilement infini
  return await page.evaluate(async (delay) => {
    return new Promise((resolve) => {

      const startTime = Date.now();
      let lastScrollY = 0;
      let unchangedScrollCount = 0;
      
      const scrollInterval = setInterval(() => {
        // Scroll vers le bas
        window.scrollBy(0, 500);
        
        // Vérifier si nous avons atteint le bas
        const currentScrollY = window.scrollY;
        
        // Si la position de scroll n'a pas changé après plusieurs tentatives, 
        // ou si la durée maximale est dépassée, on considère qu'on a atteint le bas
        if (currentScrollY === lastScrollY) {
          unchangedScrollCount++;
          if (unchangedScrollCount >= 3) { // 3 tentatives sans changement
            clearInterval(scrollInterval);
            console.log("Fin de scroll: position inchangée après plusieurs tentatives");
            resolve();
          }
        } else {
          // Réinitialiser si le scroll a changé
          unchangedScrollCount = 0;
          lastScrollY = currentScrollY;
        }
        
        // Vérifier si le temps maximum est écoulé
        if (Date.now() - startTime > maxScrollTime) {
          clearInterval(scrollInterval);
          console.log("Fin de scroll: temps maximum écoulé");
          resolve();
        }

      }, delay);
    });
  }, scrollDelay);
}

async function saveRecipe(recipeData) {
  try {
    let data = {
      where : {
        sourceUrl: recipeData.sourceUrl
      },
      create: {
        title: recipeData.title,
        description: recipeData.description,
        preparationTime: recipeData.preparationTime,
        cookingTime: recipeData.cookingTime,
        servings: recipeData.servings,
        difficulty: recipeData.difficulty,
        note: recipeData.note,
        voteNumber: recipeData.voteNumber,
        imageUrl: recipeData.imageUrl,
        sourceUrl: recipeData?.sourceUrl,
        steps: {
          create: recipeData.steps
        },
        meals: {
          create: recipeData.meals.map(meal => ({
            meal : {
              connectOrCreate: {
                where: {
                  sourceUrl: meal?.sourceUrl
                },
                create:{
                  title: meal.title,
                  sourceUrl: meal?.sourceUrl
                }
              }
            }
          }))
        },
      },
      update: {
        description: recipeData.description,
        preparationTime: recipeData.preparationTime,
        cookingTime: recipeData.cookingTime,
        servings: recipeData.servings,
        difficulty: recipeData.difficulty,
        note: recipeData.note,
        voteNumber: recipeData.voteNumber,
        imageUrl: recipeData.imageUrl,
      }
    }

    if(recipeData.category?.sourceUrl){
      data.create.category = {
        connect : {
          sourceUrl : recipeData.category.sourceUrl
        }
      }
    }

    const recipe = await prisma.recipe.upsert(data);

    const isNewRecipe = recipe.createdAt.getTime() === recipe.updatedAt.getTime();

    if (!isNewRecipe) {
      // Récupérer les étapes existantes
      const existingSteps = await prisma.recipeStep.findMany({
        where: { recipeId: recipe.id },
        orderBy: { stepNumber: 'asc' }
      });
      
      // Vérifier si les étapes ont changé
      let stepsChanged = false;
      
      if (existingSteps.length !== recipeData.steps.length) {
        stepsChanged = true;
      } else {
        // Comparer chaque étape
        for (let i = 0; i < existingSteps.length; i++) {
          if (existingSteps[i].instruction !== recipeData.steps[i].instruction) {
            stepsChanged = true;
            break;
          }
        }
      }
      
      // Si les étapes ont changé, les mettre à jour
      if (stepsChanged) {
        // Supprimer toutes les étapes existantes
        await prisma.recipeStep.deleteMany({
          where: { recipeId: recipe.id }
        });
        
        // Créer les nouvelles étapes
        for (const step of recipeData.steps) {
          await prisma.recipeStep.create({
            data: {
              recipeId: recipe.id,
              stepNumber: step.stepNumber,
              instruction: step.instruction
            }
          });
        }
        
        logWithTimestamp(`Updated steps for recipe ${recipe.id} - ${recipe.title}`);
      }
    }

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
      await prisma.recipeIngredient.upsert({
        where: {
          recipeId_ingredientId: {
            recipeId: recipe.id,
            ingredientId:ingredient.id
          }
        },
        create: {
          recipeId: recipe.id,
          ingredientId: ingredient.id,
          quantity: ingredientData.quantity,
          unit: ingredientData.unit
        },
        update: {
          quantity: ingredientData.quantity,
          unit: ingredientData.unit
        }
      });
      }


    if(isNewRecipe){
      logWithTimestamp(`Création de la recette : ${recipe.title}`);
    }

  } catch (error) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== 'P2002') {    
      logWithTimestamp(`Error saving recipe to database: ${JSON.stringify(recipeData)}`, error);
    } 
  }
}

function getRandomElement(array) {
  if (array.length === 0) {
      return null; // ou une valeur par défaut si le tableau est vide
  }
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

// Fonction utilitaire pour logger avec horodatage
function logWithTimestamp(message, error) {
  console.log(`
    -------------------------------------------- \n
    [${new Date().toISOString()}] ${message} \n
     ${error ? `${error}\n` : ``}
    -------------------------------------------- \n
    `);
}

// Fonction pour exécuter avec des tentatives
/*
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
  */


main().catch(error => {
  console.error('Unhandled error in main function:', error);
  // eslint-disable-next-line no-undef
  process.exit(1);
});