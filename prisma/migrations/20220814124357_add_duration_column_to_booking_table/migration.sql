-- AlterTable
ALTER TABLE `Booking` ADD COLUMN `duration` INTEGER NOT NULL DEFAULT 1,
    MODIFY `from` VARCHAR(191) NULL;
