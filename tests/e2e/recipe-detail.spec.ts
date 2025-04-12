// tests/e2e/recipe-detail.spec.ts
import { test, expect, Page } from '@playwright/test';
import prisma from './utils/db';
import { loginViaApi, performSearch } from './utils/tools';
import { Recipe } from '@prisma/client';


let recipe: Recipe;
let recipeId: number;
let recipeTitle: string;
let recipeSourceUrl: string;

async function openModalRecipe(page: Page) {
    // Accéder à la page d'accueil
    await page.goto('/');

    await performSearch(page, recipeTitle);

    // Sélectionner la première recette (ou celle avec l'ID trouvé si possible)
    const recipeLocator = page.locator(`.box-recipe h3:text-is("${recipeTitle}")`).first();

    // Ouvrir le modal de la recette
    await recipeLocator.click();

    // Attendre que le modal soit visible
    const recipeModal = page.locator('div.fixed.inset-0.bg-gray-500.z-50');
    await expect(recipeModal).toBeVisible();
}

async function beforeAll() {
    // Récupérer une recette existante qui a tous les champs nécessaires pour nos tests
    const recipeTmp = await prisma.recipe.findFirst({
        where: {
            description: { not: null },
        },
        include: {
            ingredients: true
        }
    });

    if (!recipeTmp) {
        throw new Error("Aucune recette complète n'a été trouvée dans la base de données");
    }

    recipe = recipeTmp
    recipeId = recipe.id;
    recipeTitle = recipe.title;
    recipeSourceUrl = recipe.sourceUrl;
    console.log(`Utilisation de la recette "${recipeTitle}" (ID: ${recipeId}) pour les tests`);
}

test.describe('Recipe Detail', () => {

    test.beforeAll(async () => {
        await beforeAll()
    });

    test.beforeEach(async ({ page }) => {
        await openModalRecipe(page)
    });

    test('Informations', async ({ page }) => {
        await expect(page.locator('.metadata-container')).toBeVisible();

        await expect(page.locator('h1')).toHaveText(recipe.title)
        await expect(page.locator('.preparationTime .metadata-label')).toHaveText(recipe.preparationTime + ' min');
        await expect(page.locator('.cookingTime .metadata-label')).toHaveText(recipe.cookingTime.toString());
        await expect(page.locator('.difficulty .metadata-label')).toHaveText(recipe.difficulty);
        await expect(page.locator('.servings .metadata-label')).toHaveText(recipe.servings + `portion${recipe.servings > 1 ? 's' : ''}`);
    });

    test('Ingredients tab', async ({ page }) => {
        await page.locator('.ingredients-tab').click()

        const ingredients = page.locator('.ingredients-tab li')
        await expect(ingredients).toHaveCount(recipe.ingredients.length);

        // Récupérer les étapes de la recette depuis la base de données
        const recipeIngredients = await prisma.recipeIngredient.findMany({
            where: { recipeId },
            include: { ingredient: true }
        });

        for (let i = 0; i < recipeIngredients.length; i++) {
            const ingredient = recipeIngredients[i];
            const text = (ingredient.quantity || '') + ' ' + (ingredient.unit || '') + (ingredient.unit && ' de ' || '') + ingredient.ingredient.name
            await expect(ingredients.locator(`text=${text}`)).toBeVisible();
        }

    })

    test('Steps tab', async ({ page }) => {
        await page.locator('.instructions-tab').click()

        // Récupérer les étapes de la recette depuis la base de données
        const recipeSteps = await prisma.recipeStep.findMany({
            where: { recipeId },
            orderBy: { stepNumber: 'asc' }
        });

        for (let i = 0; i < recipeSteps.length; i++) {
            const step = recipeSteps[i];
            // Chercher le contenu des instructions en ignorant les balises HTML
            const instructionTextPattern = step.instruction.replace(/<[^>]*>/g, '').substring(0, 20);
            await expect(page.locator(`text=/${instructionTextPattern}/i`)).toBeVisible();
        }

    })

    test('Accès au site source de la recette', async ({ page }) => {
        // Rechercher le lien vers la source
        const sourceLink = page.locator(`a[href="${recipeSourceUrl}"]`);

        // Vérifier que le lien est présent et contient l'URL correcte
        await expect(sourceLink).toBeVisible();

        // Vérifier l'attribution (le texte du lien contient le domaine)
        const sourceText = await sourceLink.textContent();
        const domain = new URL(recipeSourceUrl).hostname;
        expect(sourceText).toContain(domain);
    });

    test('can close modale', async ({ page }) => {
        await expect(page.locator('.recipe-modal')).toBeVisible();
        await page.locator('.close-modale').click();
        await expect(page.locator('.recipe-modal')).not.toBeVisible();
    })

    test('favorite and menu is not visibles when user is not connected', async ({ page }) => {
        await expect(page.locator('.menu-button')).not.toBeVisible();
        await expect(page.locator('.favorite-button')).not.toBeVisible();
    })
});


test.describe('Recipe Detail - logged', () => {
    test.beforeAll(async () => {
        await beforeAll()
    });

    test.beforeEach(async ({ page }) => {
        await loginViaApi(page)
        await openModalRecipe(page)
    });

    test('favorite and menu is not visibles when user is not connected', async ({ page }) => {
        await expect(page.locator('.menu-button')).toBeVisible();
        await expect(page.locator('.favorite-button')).toBeVisible();
    })

    test('Ajout/Suppression d\'une recette aux favoris - connecté', async ({ page }) => {
        // Vérifier le bouton favori
        const favoriteButton = page.locator('.favorite-button');
        await expect(favoriteButton).toBeVisible();

        // L'état initial dépend de si la recette est déjà en favori ou non
        const initialState = await page.evaluate(() => {
            const button = document.querySelector('.favorite-button');
            return button?.classList.contains('text-rose-500') ||
                button?.querySelector('svg')?.classList.contains('text-rose-500');
        });

        // Cliquer pour changer l'état
        await favoriteButton.click();
        await page.waitForTimeout(500); // Attendre la mise à jour

        // Vérifier que l'état a changé
        const newState = await page.evaluate(() => {
            const button = document.querySelector('.favorite-button');
            return button?.classList.contains('text-rose-500') ||
                button?.querySelector('svg')?.classList.contains('text-rose-500');
        });

        expect(newState).not.toBe(initialState);
    });

    test('Ajout d\'une recette au menu hebdomadaire', async ({ page }) => {
        
        const menuButton = page.locator('.menu-button');
        await expect(menuButton).toBeVisible();

        // L'état initial dépend de si la recette est déjà en favori ou non
        const initialState = await page.evaluate(() => {
            const button = document.querySelector('.menu-button');
            return button?.classList.contains('text-gray-700') ||
                button?.querySelector('svg')?.classList.contains('text-gray-700');
        });

        // Cliquer pour changer l'état
        await menuButton.click();
        await page.waitForTimeout(500); // Attendre la mise à jour

        // Vérifier que l'état a changé
        const newState = await page.evaluate(() => {
            const button = document.querySelector('.menu-button');
            return button?.classList.contains('text-gray-700') ||
                button?.querySelector('svg')?.classList.contains('text-gray-700');
        });

        expect(newState).not.toBe(initialState);
    });
})