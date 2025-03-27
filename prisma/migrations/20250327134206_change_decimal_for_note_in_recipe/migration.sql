/*
  Warnings:

  - You are about to alter the column `note` on the `Recipe` table. The data in that column could be lost. The data in that column will be cast from `Decimal(3,1)` to `Decimal(3,2)`.

*/
-- AlterTable
ALTER TABLE `Recipe` MODIFY `note` DECIMAL(3, 2) NULL;
