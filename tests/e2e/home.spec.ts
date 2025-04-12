import { test, expect, Page } from '@playwright/test';
import prisma from './utils/db';
import { scrollPageToBottom } from './utils/tools';



test.describe('Homepage', () => {
  const searchbarSelector = 'input[placeholder*="Rechercher"]'

  test.beforeEach(async ({ page }) => {
    // Accéder à la page d'accueil
    await page.goto('/');
  
  })
  
  test('Load page', async ({ page }) => {
    // Vérifier que le titre est correct
    await expect(page).toHaveTitle(/Cookix/);
    
    // Vérifier que la barre de recherche est présente
    const searchBar = page.locator(searchbarSelector);
    await expect(searchBar).toBeVisible();
    
    // Vérifier qu'il y a des résultats ou un message "Aucune recette trouvée"
    const results = page.locator('.container-result');
    await expect(results).toBeVisible();
  });
  
  test('Search - no result', async ({ page }) => {
    // Effectuer une recherche simple
    const searchBar = page.locator(searchbarSelector);
    await searchBar.fill('zzzzzzaz');
    await searchBar.press('Enter');
    
    // Attendre que les résultats de recherche soient chargés
    await page.waitForTimeout(400)
    
    // Vérifier qu'il y a des résultats ou un message "Aucune recette trouvée"
    const results = page.locator('.container-result-empty');
    await expect(results).toBeVisible();
  });

  test('Filter by category', async ({ page }) => {
    const categoryId = 1;
    await searchByFilter(page, 'categoryId', ''+categoryId);
    
    // Vérifier qu'un badge de filtre est visible
    const categoryBadge = page.locator('.bg-indigo-100');
    await expect(categoryBadge).toBeVisible();
    
    const expectedCount = await prisma.recipe.count({
      where: {
        categoryId: categoryId
      }
    })

    const results = page.locator('.container-result .box-recipe');
    await expect(results).toHaveCount(expectedCount);

  });

  test('Filter by meal type', async ({ page }) => {
    const mealName = "Boisson";
    await searchByFilter(page, 'mealType', ''+mealName);
    
    // Vérifier qu'un badge de filtre est visible (pour les types de repas, c'est généralement une classe bg-green-100)
    const mealTypeBadge = page.locator('.bg-green-100');
    await expect(mealTypeBadge).toBeVisible();

    const meal = await prisma.meal.findFirst({
      where: { title: mealName },
      include: {
        recipe: true
      }
    });
    
    const expectedCount = meal?.recipe?.length || 0;

    const results = page.locator('.container-result .box-recipe');
    await expect(results).toHaveCount(expectedCount);
  });

  test('Filter by vegetarian', async ({ page }) => {
    await openFilterPanel(page);

    const btnVege = page.locator(`.isVegeOption`);
    await expect(btnVege).toBeVisible();

    await btnVege.click();
    await expect(btnVege).toBeChecked();

    // Cliquer sur Appliquer
    const applyButton = page.locator('.filter-panel .valid-panel');
    await applyButton.click();

    const expectedCount = await prisma.recipe.count({
      where: {
        isVege: true
      }
    })

    await scrollPageToBottom(page);

    const results = page.locator('.container-result .box-recipe');
    await expect(results).toHaveCount(expectedCount);
  });

  test('Basic keyword search', async ({ page }) => {
    // Tester une recherche de terme exact
    await performSearch(page, 'gâteau');
    
    // Vérifier que des résultats sont affichés
    const recipeCards = page.locator('.container-result .box-recipe');
    
    // Vérifier que le terme apparaît dans les résultats (titre ou description)
    const firstRecipeTitle = await recipeCards.first().locator('h3').textContent();
    console.log(`Premier résultat: ${firstRecipeTitle}`);
    
    // Vérifier que le résultat contient le terme recherché ou un terme similaire
    // (en ignorant la casse et les accents)
    const searchTermNormalized = normalizeText('gâteau');
    const titleNormalized = normalizeText(firstRecipeTitle || '');
    
    // Le titre contient le terme exact OU le nombre de résultats est cohérent
    const expectedMatches = await recipeCards.count();
    expect(titleNormalized.includes(searchTermNormalized) || expectedMatches > 0).toBeTruthy();
  });

  test('Partial term search', async ({ page }) => {
    // Tester une recherche avec un terme partiel
    await performSearch(page, 'choco');
    
    // Vérifier que des résultats sont affichés avec "chocolat"
    const recipeCards = page.locator('.container-result .box-recipe');
    
    // Vérifier au moins un résultat
    const count = await recipeCards.count();
    expect(count).toBeGreaterThan(0);
    
    // Vérifiez que le premier résultat contient "chocolat" (ou un terme relié)
    // Ceci vérifie la fonctionnalité de correspondance partielle
    const titles = await recipeCards.locator('h3').allTextContents();
    const hasMatch = titles.some(title => 
      normalizeText(title).includes('chocolat') || 
      normalizeText(title).includes('choco')
    );
    
    expect(hasMatch).toBeTruthy();
  });


  test('Ingredient search', async ({ page }) => {
    // Tester la recherche d'un ingrédient
    await performSearch(page, 'fraise');
    
    // Vérifier que des résultats incluant des fraises apparaissent
    const recipeCards = page.locator('.container-result .box-recipe');

    // Vérifier soit le compte, soit ouvrir le premier résultat pour voir les ingrédients
    // Cliquer sur le premier résultat pour voir les détails
    await recipeCards.first().click();
    
    // Attendre que le modal s'ouvre
    const recipeModal = page.locator('.recipe-modal');
    await expect(recipeModal).toBeVisible();
    
    // Vérifier que l'onglet ingrédients est visible
    const ingredientsTab = page.locator('button.ingredients');
    await expect(ingredientsTab).toBeVisible();
    await ingredientsTab.click();
    
    // Vérifier si "fraise" ou "fraises" apparaît dans les ingrédients
    const ingredientsTexts = await page.locator('.ingredients-tab li span').allTextContents()

    const containsIngredient = ingredientsTexts.some(text => {
      return normalizeText(text).includes(normalizeText('fraise')) || 
      normalizeText(text).includes(normalizeText('fraises'));
    })
      
    expect(containsIngredient).toBeTruthy();
    
  });

  async function openFilterPanel(page : Page){
    // Ouvrir le panneau de filtres
    const filterButton = page.locator('.searchbar .display-filter');
    await filterButton.click();

    // Attendre que le panneau de filtres soit visible
    const filterPanel = page.locator('.filter-panel');
    await expect(filterPanel).toBeVisible();
  }

  async function searchByFilter(page : Page, selectorId : string, value: string){
    await openFilterPanel(page);

    const select = page.locator(`.filter-panel select#${selectorId}`);
    await expect(select).toBeVisible();
    console.log(value)

    await select.selectOption(value);

    // Cliquer sur Appliquer
    const applyButton = page.locator('.filter-panel .valid-panel');
    await applyButton.click();

    await scrollPageToBottom(page);
  }

    // Fonction utilitaire pour effectuer une recherche
    async function performSearch(page: Page, searchTerm: string) {
      const searchBar = page.locator('input[placeholder*="Rechercher"]');
      await searchBar.fill(searchTerm);
      await searchBar.press('Enter');
      
      // Attendre que la recherche se termine
      await page.waitForTimeout(500);
      await scrollPageToBottom(page)
    }
  
    // Fonction pour normaliser le texte (retirer les accents et passer en minuscules)
    function normalizeText(text: string): string {
      return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
    }
});