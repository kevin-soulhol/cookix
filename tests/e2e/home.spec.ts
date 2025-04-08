import { test, expect } from '@playwright/test';

test('home page - go to', async ({ page }) => {
  // Accéder à la page d'accueil
  await page.goto('/');
  
  // Vérifier que le titre est correct
  await expect(page).toHaveTitle(/Cookix/);
  
  // Vérifier que la barre de recherche est présente
  const searchBar = page.locator('input[placeholder*="Rechercher"]');
  await expect(searchBar).toBeVisible();
  
  // Vérifier qu'il y a des résultats ou un message "Aucune recette trouvée"
  const results = page.locator('.container-result');
  await expect(results).toBeVisible();
});

test('home page - chargement et recherche de base - no result', async ({ page }) => {
  // Accéder à la page d'accueil
  await page.goto('/');
  
  // Vérifier que le titre est correct
  await expect(page).toHaveTitle(/Cookix/);
  
  // Vérifier que la barre de recherche est présente
  const searchBar = page.locator('input[placeholder*="Rechercher"]');
  await expect(searchBar).toBeVisible();
  
  // Effectuer une recherche simple
  await searchBar.fill('zzzzzzaz');
  await searchBar.press('Enter');
  
  // Attendre que les résultats de recherche soient chargés
  await page.waitForTimeout(400)
  
  // Vérifier qu'il y a des résultats ou un message "Aucune recette trouvée"
  const results = page.locator('.container-result-empty');
  await expect(results).toBeVisible();
});