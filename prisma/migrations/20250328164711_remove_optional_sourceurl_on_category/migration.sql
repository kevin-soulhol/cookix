/*
  Warnings:

  - Made the column `sourceUrl` on table `Category` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Category` MODIFY `sourceUrl` VARCHAR(191) NOT NULL;
