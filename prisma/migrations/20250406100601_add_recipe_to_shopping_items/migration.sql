/*
  Warnings:

  - A unique constraint covering the columns `[shoppingListId,ingredientId,recipeId]` on the table `ShoppingItem` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `ShoppingItem` DROP FOREIGN KEY `ShoppingItem_shoppingListId_fkey`;

-- DropIndex
DROP INDEX `ShoppingItem_shoppingListId_ingredientId_key` ON `ShoppingItem`;

-- AlterTable
ALTER TABLE `ShoppingItem` ADD COLUMN `recipeId` INTEGER NULL;

-- CreateIndex
CREATE INDEX `ShoppingItem_recipeId_fkey` ON `ShoppingItem`(`recipeId`);

-- CreateIndex
CREATE UNIQUE INDEX `ShoppingItem_shoppingListId_ingredientId_recipeId_key` ON `ShoppingItem`(`shoppingListId`, `ingredientId`, `recipeId`);

-- AddForeignKey
ALTER TABLE `ShoppingItem` ADD CONSTRAINT `ShoppingItem_shoppingListId_fkey` FOREIGN KEY (`shoppingListId`) REFERENCES `ShoppingList`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ShoppingItem` ADD CONSTRAINT `ShoppingItem_recipeId_fkey` FOREIGN KEY (`recipeId`) REFERENCES `Recipe`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
