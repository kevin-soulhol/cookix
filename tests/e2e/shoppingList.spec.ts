import test, { expect } from "@playwright/test";
import {
    loginViaApi,
    clearShoppingListForTestUser,
    clearMenuItemsForTestUser, // Optional: If you need menu cleanup too
    addShoppingItemForTestUser,
    performSearch,
    getTestUserId
} from "./utils/tools";
import prisma from "./utils/db";
// It's often better to import the client instance if needed elsewhere,
// but for cleanup, the specific functions are enough.
// import prisma from "./utils/db"; // Not strictly needed if only using exported functions

const SHOPPING_LIST_URL = "/courses";

// --- Remove UI Helpers ---
// Remove addItemViaUI and clearShoppingListViaUI as they are replaced by DB functions

async function clearLastIngredientCreated(newItemName : string){
    const userId = await getTestUserId();

    const addedIngredient = await prisma.ingredient.findUnique( {
        where: {
            name: newItemName
        }
    })

    if(addedIngredient){
        const addedItemInDb = await prisma.shoppingItem.findFirst({
            where: {
                shoppingList: { userId: userId },
                ingredient: { id: addedIngredient.id },
            },
            include: { ingredient: true } // Inclure l'ingrédient pour vérifier le nom
        });

        if(addedItemInDb){
            await prisma.shoppingItem.delete({ where: { id: addedItemInDb.id }});
            await prisma.ingredient.delete({ where: { id: addedIngredient.id }});
        }
    }
}

// --- Tests ---

test.describe('Shopping List Interactions [DB Cleanup]', () => {

    // Se connecter avant chaque test
    test.beforeEach(async ({ page }) => {
        await loginViaApi(page);
        await clearMenuItemsForTestUser();
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

    test('a fruit or vegetable are on marketplace when i add at menu', async ({ page }) => {
        const ingredientName = "Fraises"
        const ingredient = await prisma.ingredient.findFirst({
            where: {
                name : ingredientName
            }
        })
        const recipe = await prisma.recipe.findFirst({
            where: {
                title: {
                    contains: ingredientName
                }
              },
        });

        await page.goto('/')
        await performSearch(page, ingredientName);


        await page.locator('.box-recipe:nth-child(1) .add-menu-btn').click();
        await expect(page.locator('.box-recipe:nth-child(1) .add-menu-btn.bg-green-100')).toBeVisible();
        
        await page.goto(SHOPPING_LIST_URL);
        const itemContent = page.locator(`.drag-item[data-testidingredient="shopping-item-ingredient-${ingredient.id}"].border-green-500`);
        await expect(itemContent).toBeVisible()
    });

    test('should add a new item via the Add Item modal', async ({ page }) => {
        await page.goto(SHOPPING_LIST_URL);

        const newItemName = "My fake ingredient";
        const newItemQty = "4";
        const newItemUnit = "grammes"; // Assurez-vous que cette unité est gérée ou existe dans AutocompleteUnits

        // 1. Repérer et cliquer sur le bouton "+ Ajouter"
        const addButton = page.locator('button.add-ingredient'); // Utiliser la classe ajoutée
        await expect(addButton).toBeVisible();
        await addButton.click();

        // 2. Attendre que la modale apparaisse et repérer les champs
        const modal = page.locator('.add-ingredient-modal'); // Sélecteur générique pour la modale
        await expect(modal).toBeVisible();
        const nameInput = modal.locator('.ingredient-name input'); // Assurez-vous que l'input a un 'name' ou un ID
        const qtyInput = modal.locator('#quantity');
        const unitInput = modal.locator('.autocomplete-units input'); // Pour AutocompleteUnits, l'input réel peut être caché, ciblez le composant ou l'input visible s'il y en a un.
        const submitButton = modal.locator('.add-ingredient-valid');

        await expect(nameInput).toBeVisible();
        await expect(qtyInput).toBeVisible();
        await expect(unitInput).toBeVisible(); // Ou le wrapper d'AutocompleteUnits
        await expect(submitButton).toBeVisible();

        // 3. Remplir le formulaire
        await nameInput.fill(newItemName);
        const createItem = page.locator('.create-item')
        await expect(createItem).toBeVisible()
        await createItem.click()
        await qtyInput.fill(newItemQty);
        // Gérer AutocompleteUnits : taper ou sélectionner une suggestion si applicable
        await unitInput.fill(newItemUnit);
        await page.locator('.suggest-0').click()
        //await unitInput.press('Enter');

        // 4. Soumettre le formulaire et attendre la réponse/mise à jour
        await Promise.all([
            page.waitForResponse(response => response.url().includes(SHOPPING_LIST_URL) && response.request().method() === 'POST' && response.request().postData()?.includes('_action=addItem')),
            submitButton.click(),
        ]);

        // 5. Attendre que la modale disparaisse (optionnel mais bon pour la robustesse)
        await expect(modal).not.toBeVisible();

        // 6. Vérifier que le nouvel élément est dans la liste
        //    Il est difficile de connaître l'ID à l'avance, donc on cherche par texte.
        //    ATTENTION : Ceci est moins robuste que de chercher par ID.
        //    Si possible, adaptez votre 'addItem' action pour retourner l'ID du nouvel item
        //    ou trouvez l'item via Prisma après l'ajout et utilisez son ID.
        //    Pour l'instant, cherchons par texte :
        const newItemLocator = page.locator(`.shopping-item:has-text("${newItemName}")`);
        await expect(newItemLocator).toBeVisible();
        await expect(newItemLocator).toContainText(newItemName);
        await expect(newItemLocator).toContainText(`${newItemQty} ${newItemUnit}`);

        // Optionnel: Vérifier la catégorie (par défaut, devrait être non-marketplace)
        const dragItem = newItemLocator.locator('.drag-item');
        // Ajustez la classe attendue (indigo ou transparent, selon votre implémentation par défaut)
        await expect(dragItem).toHaveClass(/border-indigo-500|border-transparent/);
        await expect(dragItem).not.toHaveClass(/border-green-500/);
        await clearLastIngredientCreated(newItemName);
    });

});