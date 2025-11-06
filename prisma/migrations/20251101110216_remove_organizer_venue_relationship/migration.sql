/*
  Warnings:

  - You are about to drop the column `organizer_id` on the `venues` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."venues" DROP CONSTRAINT "venues_organizer_id_fkey";

-- DropIndex
DROP INDEX "public"."venues_organizer_id_idx";

-- AlterTable
ALTER TABLE "venues" DROP COLUMN "organizer_id";
