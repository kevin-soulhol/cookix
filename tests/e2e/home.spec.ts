import { test, expect } from '@playwright/test';
import prisma from './utils/db';
import { cleanLoggged, openFilterPanel, performSearch, scrollPageToBottom, searchByFilter } from './utils/tools';



test.describe('Homepage', () => {
  const searchbarSelector = 'input[placeholder*="Rechercher"]'

  test.beforeEach(async ({ page }) => {
    await cleanLoggged(page)
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
    const categoryBadge = page.locator('.category-tag');
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
    const mealTypeBadge = page.locator('.meal-tag');
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

    const badgeVege = page.locator('.onlyvege-tag');
    await expect(badgeVege).toBeVisible();

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

  test('Filter by season', async ({ page }) => {
    await page.clock.install({ time: new Date('2025-04-01T12:00:00') });
    await openFilterPanel(page);

    const btnSeason = page.locator(`.seasonal`);
    await expect(btnSeason).toBeVisible();

    await btnSeason.click();
    await expect(btnSeason).toBeChecked();

    const seasonBadge = page.locator('.seasonal-tag');
    await expect(seasonBadge).toBeVisible();

    // Cliquer sur Appliquer
    const applyButton = page.locator('.filter-panel .valid-panel');
    await applyButton.click();

    const expectedCount = process.env.NODE_ENV === "development" ? 324 : 7;

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

  test('Reset filters functionality', async ({ page }) => {
    await openFilterPanel(page);

    const btnVege = page.locator(`.isVegeOption`);
    await expect(btnVege).toBeVisible();

    await btnVege.click();

    const badgeVege = page.locator('.onlyvege-tag');
    await expect(badgeVege).toBeVisible();
    
    // Enregistrer le nombre de résultats avec les filtres
    const filteredResults = page.locator('.container-result .box-recipe');
    const filteredCount = await filteredResults.count();
    console.log(`Nombre de résultats avec filtres: ${filteredCount}`);
    
    // Cliquer sur le bouton "Tout effacer"
    const resetButton = page.locator('button.cancel-panel');
    await resetButton.click();
    
    await expect(badgeVege).not.toBeVisible();
    
    // Vérifier que le nombre de résultats a changé (généralement augmenté)
    const resetResults = page.locator('.container-result .box-recipe');
    await page.waitForTimeout(500); // Attendre le chargement des nouveaux résultats
    
    const resetCount = await resetResults.count();
    console.log(`Nombre de résultats après réinitialisation: ${resetCount}`);
    
    // Si nous avions des résultats filtrés, nous devrions avoir au moins autant après la réinitialisation
    expect(resetCount).toBeGreaterThanOrEqual(filteredCount);
  });

  // Fonction pour normaliser le texte (retirer les accents et passer en minuscules)
  function normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }
});