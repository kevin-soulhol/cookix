import { expect, Page } from "@playwright/test";
import prisma from "./db";
import bcrypt from "bcryptjs";

export async function scrollPageToBottom(page : Page, scrollDelay = 300, maxScrollTime = 90000) {
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

export async function openFilterPanel(page : Page){
  // Ouvrir le panneau de filtres
  const filterButton = page.locator('.searchbar .display-filter');
  await filterButton.click();

  // Attendre que le panneau de filtres soit visible
  const filterPanel = page.locator('.filter-panel');
  await expect(filterPanel).toBeVisible();
}

export async function searchByFilter(page : Page, selectorId : string, value: string){
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
export async function performSearch(page: Page, searchTerm: string) {
  const searchBar = page.locator('input[placeholder*="Rechercher"]');
  await searchBar.fill(searchTerm);
  await searchBar.press('Enter');
  
  // Attendre que la recherche se termine
  await page.waitForTimeout(500);
  await scrollPageToBottom(page)
}

// Constantes pour l'utilisateur de test
const TEST_USER = {
  email: 'test_e2e@example.com',
  password: 'Password123!'
};

// Fonction pour créer un utilisateur de test si nécessaire
async function ensureTestUser() {
  // Vérifier si l'utilisateur de test existe déjà
  let user = await prisma.user.findUnique({
    where: { email: TEST_USER.email }
  });
  
  // Si l'utilisateur n'existe pas, le créer
  if (!user) {
    // Hacher le mot de passe correctement
    const hashedPassword = await bcrypt.hash(TEST_USER.password, 10);
    
    user = await prisma.user.create({
      data: {
        email: TEST_USER.email,
        password: hashedPassword
      }
    });
    console.log('Utilisateur de test créé');
  }
  
  return user;
}

// Fonction pour s'authentifier via l'API
export async function loginViaApi(page: Page) {
  // S'assurer que l'utilisateur de test existe
  const user = await ensureTestUser();
  // Faire une requête API directe pour se connecter
  const loginResponse = await page.request.post('http://localhost:3000/api/user', {
    form: {
      _action: 'login',
      email: TEST_USER.email,
      password: TEST_USER.password,
      redirectTo: '/'
    }
  });

  if (loginResponse.ok()) {
    // Vérifier le status de la réponse
    const responseData = await loginResponse.json();
    console.log(responseData)
    
    // Si la réponse contient un cookie, l'ajouter
    if (responseData.cookie) {
      // Extraire le cookie de la réponse
      const cookieParts = responseData.cookie.split(';')[0].split('=');
      const cookieName = cookieParts[0];
      const cookieValue = cookieParts[1];
      
      await page.context().addCookies([{
        name: cookieName,
        value: cookieValue,
        domain: 'localhost',
        path: '/'
      }]);
      
      console.log('Authentification via API réussie');
      return true;
    }
  } else {
    throw await loginResponse.json();
  }
}

export async function cleanLoggged(page: Page){
  await page.context().clearCookies()
}