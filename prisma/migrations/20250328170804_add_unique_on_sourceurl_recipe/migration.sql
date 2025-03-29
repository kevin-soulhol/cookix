/*
  Warnings:

  - A unique constraint covering the columns `[sourceUrl]` on the table `Recipe` will be added. If there are existing duplicate values, this will fail.
  - Made the column `sourceUrl` on table `Recipe` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Recipe` MODIFY `sourceUrl` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Recipe_sourceUrl_key` ON `Recipe`(`sourceUrl`);
