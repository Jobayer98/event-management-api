/*
  Warnings:

  - Added the required column `serving_style` to the `meals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `meals` table without a default value. This is not possible if the table is not empty.
  - Made the column `type` on table `meals` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `city` to the `venues` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `venues` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `venues` table without a default value. This is not possible if the table is not empty.
  - Added the required column `venue_type` to the `venues` table without a default value. This is not possible if the table is not empty.
  - Made the column `address` on table `venues` required. This step will fail if there are existing NULL values in that column.
  - Made the column `capacity` on table `venues` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "meals" ADD COLUMN     "beverages" TEXT[],
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "cuisine" VARCHAR(50),
ADD COLUMN     "equipment_included" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "is_popular" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "menu_items" JSONB,
ADD COLUMN     "minimum_guests" INTEGER NOT NULL DEFAULT 50,
ADD COLUMN     "rating" DECIMAL(3,2),
ADD COLUMN     "service_hours" JSONB,
ADD COLUMN     "serving_style" VARCHAR(50) NOT NULL,
ADD COLUMN     "special_dietary" TEXT[],
ADD COLUMN     "staff_included" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "total_reviews" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "type" SET NOT NULL;

-- AlterTable
ALTER TABLE "venues" ADD COLUMN     "alcohol_allowed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "amenities" TEXT[],
ADD COLUMN     "area" DECIMAL(10,2),
ADD COLUMN     "catering_allowed" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "city" VARCHAR(100) NOT NULL,
ADD COLUMN     "contact_email" VARCHAR(150),
ADD COLUMN     "contact_person" VARCHAR(100),
ADD COLUMN     "contact_phone" VARCHAR(20),
ADD COLUMN     "country" VARCHAR(100) NOT NULL DEFAULT 'Bangladesh',
ADD COLUMN     "decoration_allowed" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "facilities" TEXT[],
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "latitude" DECIMAL(10,8),
ADD COLUMN     "longitude" DECIMAL(11,8),
ADD COLUMN     "minimum_hours" INTEGER NOT NULL DEFAULT 4,
ADD COLUMN     "operating_hours" JSONB,
ADD COLUMN     "pet_friendly" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "rating" DECIMAL(3,2),
ADD COLUMN     "security_deposit" DECIMAL(10,2),
ADD COLUMN     "smoking_allowed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "state" VARCHAR(100) NOT NULL,
ADD COLUMN     "total_reviews" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "venue_type" VARCHAR(50) NOT NULL,
ADD COLUMN     "virtual_tour_url" TEXT,
ADD COLUMN     "zip_code" VARCHAR(20),
ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "capacity" SET NOT NULL;

-- CreateTable
CREATE TABLE "venue_reviews" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "venue_id" TEXT NOT NULL,
    "event_id" TEXT,
    "rating" INTEGER NOT NULL,
    "title" VARCHAR(200),
    "comment" TEXT,
    "cleanliness_rating" INTEGER,
    "service_rating" INTEGER,
    "facilities_rating" INTEGER,
    "value_rating" INTEGER,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_visible" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "venue_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meal_reviews" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "meal_id" TEXT NOT NULL,
    "event_id" TEXT,
    "rating" INTEGER NOT NULL,
    "title" VARCHAR(200),
    "comment" TEXT,
    "taste_rating" INTEGER,
    "presentation_rating" INTEGER,
    "service_rating" INTEGER,
    "value_rating" INTEGER,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_visible" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "meal_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "venue_reviews_venue_id_idx" ON "venue_reviews"("venue_id");

-- CreateIndex
CREATE INDEX "venue_reviews_user_id_idx" ON "venue_reviews"("user_id");

-- CreateIndex
CREATE INDEX "venue_reviews_rating_idx" ON "venue_reviews"("rating");

-- CreateIndex
CREATE INDEX "venue_reviews_is_visible_idx" ON "venue_reviews"("is_visible");

-- CreateIndex
CREATE INDEX "venue_reviews_created_at_idx" ON "venue_reviews"("created_at");

-- CreateIndex
CREATE INDEX "meal_reviews_meal_id_idx" ON "meal_reviews"("meal_id");

-- CreateIndex
CREATE INDEX "meal_reviews_user_id_idx" ON "meal_reviews"("user_id");

-- CreateIndex
CREATE INDEX "meal_reviews_rating_idx" ON "meal_reviews"("rating");

-- CreateIndex
CREATE INDEX "meal_reviews_is_visible_idx" ON "meal_reviews"("is_visible");

-- CreateIndex
CREATE INDEX "meal_reviews_created_at_idx" ON "meal_reviews"("created_at");

-- CreateIndex
CREATE INDEX "meals_cuisine_idx" ON "meals"("cuisine");

-- CreateIndex
CREATE INDEX "meals_serving_style_idx" ON "meals"("serving_style");

-- CreateIndex
CREATE INDEX "meals_is_active_idx" ON "meals"("is_active");

-- CreateIndex
CREATE INDEX "meals_is_popular_idx" ON "meals"("is_popular");

-- CreateIndex
CREATE INDEX "meals_rating_idx" ON "meals"("rating");

-- CreateIndex
CREATE INDEX "meals_type_cuisine_idx" ON "meals"("type", "cuisine");

-- CreateIndex
CREATE INDEX "meals_price_per_person_minimum_guests_idx" ON "meals"("price_per_person", "minimum_guests");

-- CreateIndex
CREATE INDEX "venues_city_idx" ON "venues"("city");

-- CreateIndex
CREATE INDEX "venues_venue_type_idx" ON "venues"("venue_type");

-- CreateIndex
CREATE INDEX "venues_is_active_idx" ON "venues"("is_active");

-- CreateIndex
CREATE INDEX "venues_rating_idx" ON "venues"("rating");

-- CreateIndex
CREATE INDEX "venues_city_venue_type_idx" ON "venues"("city", "venue_type");

-- CreateIndex
CREATE INDEX "venues_capacity_price_per_hour_idx" ON "venues"("capacity", "price_per_hour");

-- AddForeignKey
ALTER TABLE "venue_reviews" ADD CONSTRAINT "venue_reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "venue_reviews" ADD CONSTRAINT "venue_reviews_venue_id_fkey" FOREIGN KEY ("venue_id") REFERENCES "venues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "venue_reviews" ADD CONSTRAINT "venue_reviews_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal_reviews" ADD CONSTRAINT "meal_reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal_reviews" ADD CONSTRAINT "meal_reviews_meal_id_fkey" FOREIGN KEY ("meal_id") REFERENCES "meals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal_reviews" ADD CONSTRAINT "meal_reviews_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE CASCADE;
