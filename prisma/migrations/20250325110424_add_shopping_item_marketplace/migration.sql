/*
  Warnings:

  - You are about to drop the `_MealToRecipe` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[sourceUrl]` on the table `Meal` will be added. If there are existing duplicate values, this will fail.
  - Made the column `sourceUrl` on table `Meal` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `_MealToRecipe` DROP FOREIGN KEY `_MealToRecipe_A_fkey`;

-- DropForeignKey
ALTER TABLE `_MealToRecipe` DROP FOREIGN KEY `_MealToRecipe_B_fkey`;

-- AlterTable
ALTER TABLE `Meal` MODIFY `sourceUrl` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `ShoppingItem` ADD COLUMN `marketplace` BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE `_MealToRecipe`;

-- CreateTable
CREATE TABLE `MealOnRecipe` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `recipeId` INTEGER NOT NULL,
    `mealId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Meal_sourceUrl_key` ON `Meal`(`sourceUrl`);

-- AddForeignKey
ALTER TABLE `MealOnRecipe` ADD CONSTRAINT `MealOnRecipe_recipeId_fkey` FOREIGN KEY (`recipeId`) REFERENCES `Recipe`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MealOnRecipe` ADD CONSTRAINT `MealOnRecipe_mealId_fkey` FOREIGN KEY (`mealId`) REFERENCES `Meal`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
