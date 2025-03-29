/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sourceUrl]` on the table `Category` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Category_title_sourceUrl_key` ON `Category`;

-- CreateIndex
CREATE UNIQUE INDEX `Category_title_key` ON `Category`(`title`);

-- CreateIndex
CREATE UNIQUE INDEX `Category_sourceUrl_key` ON `Category`(`sourceUrl`);
