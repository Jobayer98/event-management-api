/*
  Warnings:

  - You are about to drop the column `minimum_hours` on the `venues` table. All the data in the column will be lost.
  - You are about to drop the column `price_per_hour` on the `venues` table. All the data in the column will be lost.
  - Added the required column `price_per_day` to the `venues` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."venues_capacity_price_per_hour_idx";

-- DropIndex
DROP INDEX "public"."venues_price_per_hour_idx";

-- AlterTable: Add new columns first
ALTER TABLE "venues" ADD COLUMN "minimum_days" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "venues" ADD COLUMN "price_per_day" DECIMAL(10,2);

-- Update price_per_day based on price_per_hour (assuming 8 hours per day)
UPDATE "venues" SET "price_per_day" = "price_per_hour" * 8;

-- Make price_per_day NOT NULL after setting values
ALTER TABLE "venues" ALTER COLUMN "price_per_day" SET NOT NULL;

-- Drop old columns
ALTER TABLE "venues" DROP COLUMN "minimum_hours";
ALTER TABLE "venues" DROP COLUMN "price_per_hour";

-- CreateIndex
CREATE INDEX "venues_price_per_day_idx" ON "venues"("price_per_day");

-- CreateIndex
CREATE INDEX "venues_capacity_price_per_day_idx" ON "venues"("capacity", "price_per_day");
