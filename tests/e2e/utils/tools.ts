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

/**
 * Finds the user ID for the predefined test user email.
 * Throws an error if the user is not found.
 */
async function getTestUserId(): Promise<number> {
  const user = await prisma.user.findUnique({
      where: { email: TEST_USER.email },
      select: { id: true }, // Only select the ID
  });

  if (!user) {
      throw new Error(`Test user with email ${TEST_USER.email} not found in the database.`);
  }
  return user.id;
}

/**
 * Deletes all shopping list items associated with the test user's primary shopping list.
 */
export async function clearShoppingListForTestUser() {
  try {
      const userId = await getTestUserId();

      // Find the shopping list associated with the user
      const shoppingList = await prisma.shoppingList.findFirst({
          where: { userId: userId },
          select: { id: true },
      });

      // If the user has a shopping list, delete its items
      if (shoppingList) {
          const { count } = await prisma.shoppingItem.deleteMany({
              where: { shoppingListId: shoppingList.id },
          });
          console.log(`🧹 Cleared ${count} shopping items for user ${TEST_USER.email}`);
      } else {
          console.log(`🧹 No shopping list found for user ${TEST_USER.email}, nothing to clear.`);
      }
  } catch (error) {
      console.error(`Error clearing shopping list for ${TEST_USER.email}:`, error);
      // Rethrow or handle as needed for test stability
      throw error;
  }
}

/**
 * Deletes all menu items associated with any menus owned by the test user.
 * (Equivalent to the goal of your original checkNoRecipeAdded)
 */
export async function clearMenuItemsForTestUser() {
  try {
      const userId = await getTestUserId();

      // Find all menu IDs owned by the test user
      const menus = await prisma.menu.findMany({
          where: { userId: userId },
          select: { id: true },
      });

      if (menus.length > 0) {
          const menuIds = menus.map(menu => menu.id);

          // Delete all menu items linked to those menus
          const { count } = await prisma.menuItem.deleteMany({
              where: {
                  menuId: {
                      in: menuIds,
                  },
              },
          });
          console.log(`🧹 Cleared ${count} menu items for user ${TEST_USER.email}`);
      } else {
          console.log(`🧹 No menus found for user ${TEST_USER.email}, no menu items to clear.`);
      }
  } catch (error) {
      console.error(`Error clearing menu items for ${TEST_USER.email}:`, error);
      throw error;
  }
}

/**
* Helper function to add a specific item to the test user's shopping list.
* Useful for setting up specific test states.
* Returns the created shopping item.
*/
export async function addShoppingItemForTestUser(
  ingredientName: string,
  quantity: number | null = null,
  unit: string | null = null,
  marketplace: boolean = false,
  recipeId: number | null = null,
  otherDataItem: any = {}
): Promise<import('@prisma/client').ShoppingItem> {
  try {
      const userId = await getTestUserId();

      // Find or create the shopping list
      let shoppingList = await prisma.shoppingList.findFirst({
          where: { userId: userId },
      });
      if (!shoppingList) {
          shoppingList = await prisma.shoppingList.create({
              data: { userId: userId },
          });
           console.log(`🛒 Created shopping list for user ${TEST_USER.email}`);
      }

      // Find or create the ingredient
      let ingredient = await prisma.ingredient.findUnique({
          where: { name: ingredientName },
      });
      if (!ingredient) {
          ingredient = await prisma.ingredient.create({
              data: { name: ingredientName, ...otherDataItem },
          });
           console.log(`🌿 Created ingredient: ${ingredientName}`);
      }

      // Create the shopping item
      // Handle potential unique constraint violation if item already exists (e.g., re-adding same manual item)
      // For simplicity here, we assume it doesn't exist or test logic handles it.
      // A real-world scenario might use upsert or check existence first.
      const newItem = await prisma.shoppingItem.create({
          data: {
              shoppingListId: shoppingList.id,
              ingredientId: ingredient.id,
              recipeId: recipeId, // Link to recipe if provided
              quantity: quantity,
              unit: unit,
              isChecked: false,
              marketplace: marketplace,
          },
      });
       console.log(`➕ Added shopping item "${ingredientName}" for user ${TEST_USER.email}`);
      return newItem;

  } catch (error) {
      console.error(`Error adding shopping item "${ingredientName}" for ${TEST_USER.email}:`, error);
      throw error;
  }
}

export async function cleanLoggged(page: Page){
  await page.context().clearCookies()
}