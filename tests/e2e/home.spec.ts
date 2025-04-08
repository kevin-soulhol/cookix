import { test, expect } from '@playwright/test';

test('home page - chargement et recherche de base', async ({ page }) => {
  // Accéder à la page d'accueil
  await page.goto('/');
  
  // Vérifier que le titre est correct
  await expect(page).toHaveTitle(/Cookix/);
  
  // Vérifier que la barre de recherche est présente
  const searchBar = page.locator('input[placeholder*="Rechercher"]');
  await expect(searchBar).toBeVisible();
  
  // Effectuer une recherche simple
  await searchBar.fill('tomate');
  await searchBar.press('Enter');
  
  // Attendre que les résultats de recherche soient chargés
  await page.waitForTimeout(400)
  
  // Vérifier qu'il y a des résultats ou un message "Aucune recette trouvée"
  const results = page.locator('.container-resultcaca');
  await expect(results).toBeVisible();
  
  // Prendre une capture d'écran des résultats
  await page.screenshot({ path: 'test-results/home-search-results.png' });
});