import { test, expect } from '@playwright/test';




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
});

