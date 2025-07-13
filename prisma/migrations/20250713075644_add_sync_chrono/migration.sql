-- CreateTable
CREATE TABLE `SyncedProduct` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `shoppingItemId` INTEGER NOT NULL,
    `isFound` BOOLEAN NOT NULL DEFAULT false,
    `chronodriveProductId` VARCHAR(191) NULL,
    `productName` VARCHAR(191) NULL,
    `imageUrl` VARCHAR(191) NULL,
    `price` DOUBLE NULL,
    `syncedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `SyncedProduct_shoppingItemId_key`(`shoppingItemId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SyncedProduct` ADD CONSTRAINT `SyncedProduct_shoppingItemId_fkey` FOREIGN KEY (`shoppingItemId`) REFERENCES `ShoppingItem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
