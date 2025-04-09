import { test, expect, Page } from '@playwright/test';
import prisma from './utils/db';
import { scrollPageToBottom } from './utils/tools';
import { title } from 'process';



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

  test('Search - 1 result', async ({ page }) => {
    // Effectuer une recherche simple
    const searchBar = page.locator(searchbarSelector);
    await searchBar.fill('test');
    await searchBar.press('Enter');
    
    // Attendre que les résultats de recherche soient chargés
    await page.waitForTimeout(400)
    
    // Vérifier qu'il y a des résultats ou un message "Aucune recette trouvée"
    const results = page.locator('.container-result .box-recipe');
    await expect(results).toHaveCount(1)
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

  /* test('Filter by meal type', async ({ page }) => {
    const mealName = "Boisson";
    await searchByFilter(page, 'mealType', ''+mealName);
    
    // Vérifier qu'un badge de filtre est visible (pour les types de repas, c'est généralement une classe bg-green-100)
    const mealTypeBadge = page.locator('.bg-green-100');
    await expect(mealTypeBadge).toBeVisible();

    const expectedCount = await prisma.recipe.count({
      where: {
        meals: {
          some: {
            title: {
              equals: mealName
            }
          }
        }
      }
    })

    const results = page.locator('.container-result .box-recipe');
    await expect(results).toHaveCount(expectedCount);
  }); */


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
});

