import test, { expect } from "@playwright/test";
import { cleanLoggged, clearMenuItemsForTestUser, loginViaApi } from "./utils/tools";

test.describe('Box Recipes', () => {

    test.afterEach(async ( { page }) => {
        await clearMenuItemsForTestUser();
        await cleanLoggged(page)
    });

    test('can add to menu when logged', async function ({ page }) {
        await loginViaApi(page)
        await page.goto('/');
        await expect(page.locator('.box-recipe:nth-child(1) .add-menu-btn.bg-opacity-80')).toBeVisible();

        await page.locator('.box-recipe:nth-child(1) .add-menu-btn').click();
        await expect(page.locator('.box-recipe:nth-child(1) .add-menu-btn.bg-opacity-80')).not.toBeVisible();
        await expect(page.locator('.box-recipe:nth-child(1) .add-menu-btn.bg-green-100')).toBeVisible();
    })

    test('can not add to menu when not logged', async function ({ page }) {
        await page.goto('/');
        await expect(page.locator('.box-recipe:nth-child(1) .add-menu-btn')).not.toBeVisible();
    })

    test('can not see add-menu button on menu page', async function ({ page }) {
        await loginViaApi(page)
        await page.goto('/');
        await page.locator('.box-recipe:nth-child(1) .add-menu-btn').click();

        await page.goto('/menu');
        await expect(page.locator('.box-recipe:nth-child(1) .add-menu-btn')).not.toBeVisible();
    })

    test('can delete from menu', async function ({ page }) {
        await loginViaApi(page)
        await page.goto('/');
        await page.locator('.box-recipe:nth-child(1) .add-menu-btn').click();
        
        await page.goto('/menu');
        await page.locator('.menu-recipes-container .delete-btn:nth-child(2)').click();
        await expect(page.locator('menu-recipes-container .box-recipe')).not.toBeVisible();
    })
});


