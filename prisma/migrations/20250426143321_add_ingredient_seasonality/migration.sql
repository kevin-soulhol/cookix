-- CreateTable
CREATE TABLE `IngredientSeason` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ingredientId` INTEGER NOT NULL,
    `january` BOOLEAN NOT NULL DEFAULT false,
    `february` BOOLEAN NOT NULL DEFAULT false,
    `march` BOOLEAN NOT NULL DEFAULT false,
    `april` BOOLEAN NOT NULL DEFAULT false,
    `may` BOOLEAN NOT NULL DEFAULT false,
    `june` BOOLEAN NOT NULL DEFAULT false,
    `july` BOOLEAN NOT NULL DEFAULT false,
    `august` BOOLEAN NOT NULL DEFAULT false,
    `september` BOOLEAN NOT NULL DEFAULT false,
    `october` BOOLEAN NOT NULL DEFAULT false,
    `november` BOOLEAN NOT NULL DEFAULT false,
    `december` BOOLEAN NOT NULL DEFAULT false,
    `isPerennial` BOOLEAN NOT NULL DEFAULT false,
    `isFruit` BOOLEAN NOT NULL DEFAULT false,
    `isVegetable` BOOLEAN NOT NULL DEFAULT false,
    `apiIdentifier` VARCHAR(191) NULL,
    `lastChecked` DATETIME(3) NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `IngredientSeason_ingredientId_key`(`ingredientId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `IngredientSeason` ADD CONSTRAINT `IngredientSeason_ingredientId_fkey` FOREIGN KEY (`ingredientId`) REFERENCES `Ingredient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
