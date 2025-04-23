import test, { expect } from "@playwright/test";
import {
    loginViaApi,
    clearShoppingListForTestUser,
    clearMenuItemsForTestUser, // Optional: If you need menu cleanup too
    addShoppingItemForTestUser
} from "./utils/tools";
// It's often better to import the client instance if needed elsewhere,
// but for cleanup, the specific functions are enough.
// import prisma from "./utils/db"; // Not strictly needed if only using exported functions

const SHOPPING_LIST_URL = "/courses";

// --- Remove UI Helpers ---
// Remove addItemViaUI and clearShoppingListViaUI as they are replaced by DB functions

// --- Tests ---

test.describe('Shopping List Interactions [DB Cleanup]', () => {

    // Se connecter avant chaque test
    test.beforeEach(async ({ page }) => {
        await loginViaApi(page);
        // Ensure the list is clean before the test runs (optional, depends on strategy)
        // await clearShoppingListForTestUser();
    });

    // Nettoyer la liste après chaque test using Prisma
    test.afterEach(async () => {
        await clearShoppingListForTestUser();
        await clearMenuItemsForTestUser();
    });

    test('should display added item and default to non-marketplace [DB Setup]', async ({ page }) => {
        // Setup: Add item directly via DB
        const item = await addShoppingItemForTestUser("Tomates DB Test", 500, "g");

        await page.goto(SHOPPING_LIST_URL);

        // Use the specific item ID for a robust selector
        const selector = `[data-testid="shopping-item-${item.id}"]`
        const itemContent = page.locator(`${selector}`);
        await expect(itemContent).toBeVisible();
        await expect(itemContent).toContainText("Tomates DB Test");
        await expect(itemContent).toContainText("500 g");

        // Vérifier qu'il n'a PAS la bordure verte par défaut
        const shoppingItem = page.locator(`[data-testid="shopping-item-${item.id}"] .drag-item`)
        await expect(shoppingItem).toHaveClass(/border-transparent/);
        await expect(shoppingItem).not.toHaveClass(/border-green-500/);
    });

    test('should toggle item to marketplace category on right slide [DB Setup]', async ({ page }) => {
        // Setup: Add item via DB, ensure it's NOT marketplace initially
        const item = await addShoppingItemForTestUser("Carottes Slide DB", null, null, false);

        await page.goto(SHOPPING_LIST_URL);

        const itemContent = page.locator(`[data-testid="shopping-item-${item.id}"] .drag-item`);
        await expect(itemContent).toHaveClass(/border-transparent/); // Etat initial

        const box = await itemContent.boundingBox();
        expect(box).not.toBeNull();

        // Simuler le slide vers la droite
        await page.mouse.move(box!.x + box!.width * 0.25, box!.y + box!.height / 2);
        await page.mouse.down();
        await page.mouse.move(box!.x + box!.width * 0.25 + 100, box!.y + box!.height / 2, { steps: 5 });
        await page.mouse.up();

        // Attendre la réponse de l'action
         // Make sure the URL matches your Remix action endpoint for shopping list updates
        await page.waitForResponse(response => response.url().includes(SHOPPING_LIST_URL) && response.request().method() === 'POST');

        // Vérifier que l'élément a maintenant la bordure verte
        // Wait slightly for potential optimistic UI updates + re-render after fetch
        await page.waitForTimeout(100); // Small delay can help if UI updates async
        await expect(itemContent).toHaveClass(/border-green-500/);
        await expect(itemContent).not.toHaveClass(/border-transparent/);

         // Optionnel : re-slider pour revenir à l'état initial
         const boxAfterToggle = await itemContent.boundingBox();
         await page.mouse.move(boxAfterToggle!.x + boxAfterToggle!.width * 0.25, boxAfterToggle!.y + boxAfterToggle!.height / 2);
         await page.mouse.down();
         await page.mouse.move(boxAfterToggle!.x + boxAfterToggle!.width * 0.25 + 100, boxAfterToggle!.y + boxAfterToggle!.height / 2, { steps: 5 });
         await page.mouse.up();

         await page.waitForResponse(response => response.url().includes(SHOPPING_LIST_URL) && response.request().method() === 'POST');
         await page.waitForTimeout(100); // Small delay

         // Vérifier le retour à la normale
         await expect(itemContent).toHaveClass(/border-transparent/);
         await expect(itemContent).not.toHaveClass(/border-green-500/);
    });

    test('should delete item when delete button is clicked [DB Setup]', async ({ page }) => {
        // Setup: Add item via DB
        const item = await addShoppingItemForTestUser("A Supprimer DB");

        await page.goto(SHOPPING_LIST_URL);

        const listItem = page.locator(`[data-testid="shopping-item-${item.id}"]`);
        const deleteButton = page.locator(`[data-testid="delete-button-${item.id}"]`);

        // Cliquer sur le bouton supprimer et attendre la réponse
        await Promise.all([
             page.waitForResponse(response => response.url().includes(SHOPPING_LIST_URL) && response.request().method() === 'POST'),
             deleteButton.click()
        ]);
        await page.waitForTimeout(100); // Small delay for DOM update

        // Vérifier que l'élément a disparu
        await expect(listItem).not.toBeVisible();
    });

    test('should check and uncheck an item', async ({ page }) => {
        // Setup: Add a standard item
        const item = await addShoppingItemForTestUser("Poireaux Check Test");

        await page.goto(SHOPPING_LIST_URL);

        const itemContent = page.locator(`[data-testid="shopping-item-${item.id}"]`);
        const checkboxButton = itemContent.locator('.checkbox-btn'); // Initial aria-label
        const ingredientNameSpan = itemContent.locator('span.font-medium:has-text("Poireaux Check Test")');
        const checkmarkSvg = checkboxButton.locator('span > svg'); // Le SVG est dans le span du bouton

        // 1. Vérifier l'état initial (non coché)
        await expect(itemContent).toBeVisible();
        await expect(checkboxButton).toBeVisible(); // Le bouton (pas l'icône) est toujours visible
        await expect(ingredientNameSpan).not.toHaveClass(/line-through/); // Pas de style barré
        await expect(checkmarkSvg).not.toBeVisible(); // Pas de coche SVG visible

        // 2. Cocher l'élément
        console.log(`Attempting to check item ${item.id}...`);
        await Promise.all([
            page.waitForResponse(response => response.url().includes(SHOPPING_LIST_URL) && response.request().method() === 'POST' && response.request().postData()?.includes('_action=toggleItem')),
            checkboxButton.click()
        ]);
        await page.waitForTimeout(150); // Petite pause pour la mise à jour de l'UI si nécessaire

        // 3. Vérifier l'état coché
        console.log(`Verifying checked state for item ${item.id}...`);
        const checkboxButtonChecked = itemContent.locator('.checkbox-btn'); // L'aria-label change
        await expect(checkboxButtonChecked).toBeVisible(); // Vérifier que le bouton avec le nouvel aria-label existe
        await expect(ingredientNameSpan).toHaveClass(/line-through/); // Style barré appliqué
        // Il faut peut-être re-localiser le SVG car le bouton a peut-être été re-rendu
        const checkmarkSvgChecked = checkboxButtonChecked.locator('span > svg');
        await expect(checkmarkSvgChecked).toBeVisible(); // Coche SVG visible

        // 4. Décocher l'élément
        console.log(`Attempting to uncheck item ${item.id}...`);
        await Promise.all([
            page.waitForResponse(response => response.url().includes(SHOPPING_LIST_URL) && response.request().method() === 'POST' && response.request().postData()?.includes('_action=toggleItem')),
            checkboxButtonChecked.click() // Cliquer sur le bouton (qui a maintenant l'aria-label "Décocher")
        ]);
        await page.waitForTimeout(150); // Petite pause pour la mise à jour de l'UI

        // 5. Vérifier l'état final (non coché à nouveau)
        console.log(`Verifying unchecked state for item ${item.id}...`);
        const checkboxButtonUnchecked = itemContent.locator('.checkbox-btn'); // Retour à l'aria-label initial
        await expect(checkboxButtonUnchecked).toBeVisible();
        await expect(ingredientNameSpan).not.toHaveClass(/line-through/); // Style barré retiré
        const checkmarkSvgUnchecked = checkboxButtonUnchecked.locator('span > svg');
        await expect(checkmarkSvgUnchecked).not.toBeVisible(); // Coche SVG non visible

        console.log(`Check/uncheck test completed for item ${item.id}.`);
    });

});