-- AlterTable
ALTER TABLE `User` ADD COLUMN `pseudo` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `Recipe_title_idx` ON `Recipe`(`title`);

-- CreateIndex
CREATE INDEX `Recipe_preparationTime_idx` ON `Recipe`(`preparationTime`);

-- CreateIndex
CREATE INDEX `Recipe_difficulty_idx` ON `Recipe`(`difficulty`);

-- CreateIndex
CREATE INDEX `Recipe_categoryId_preparationTime_idx` ON `Recipe`(`categoryId`, `preparationTime`);

-- CreateIndex
CREATE INDEX `Recipe_description_idx` ON `Recipe`(`description`(255));

-- RedefineIndex
CREATE INDEX `MealOnRecipe_mealId_idx` ON `MealOnRecipe`(`mealId`);
DROP INDEX `MealOnRecipe_mealId_fkey` ON `MealOnRecipe`;

-- RedefineIndex
CREATE INDEX `MealOnRecipe_recipeId_idx` ON `MealOnRecipe`(`recipeId`);
DROP INDEX `MealOnRecipe_recipeId_fkey` ON `MealOnRecipe`;
