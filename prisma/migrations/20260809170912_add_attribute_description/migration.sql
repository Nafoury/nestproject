/*
  Warnings:

  - The values [select] on the enum `FilterType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "FilterType_new" AS ENUM ('checkbox', 'radio', 'range', 'text', 'toggle', 'intersection');
ALTER TABLE "attributes" ALTER COLUMN "filterType" TYPE "FilterType_new" USING ("filterType"::text::"FilterType_new");
ALTER TYPE "FilterType" RENAME TO "FilterType_old";
ALTER TYPE "FilterType_new" RENAME TO "FilterType";
DROP TYPE "public"."FilterType_old";
COMMIT;

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "UnitType" ADD VALUE 'grams';
ALTER TYPE "UnitType" ADD VALUE 'C';
ALTER TYPE "UnitType" ADD VALUE 'minutes';
ALTER TYPE "UnitType" ADD VALUE 'months';
ALTER TYPE "UnitType" ADD VALUE 'hours';
ALTER TYPE "UnitType" ADD VALUE 'years';
ALTER TYPE "UnitType" ADD VALUE 'days';

-- AlterTable
ALTER TABLE "attributes" ALTER COLUMN "allowMultiple" SET DEFAULT true;

-- CreateTable
CREATE TABLE "product_attribute_options" (
    "id" BIGSERIAL NOT NULL,
    "productAttributeId" BIGINT NOT NULL,
    "attributeOptionId" BIGINT NOT NULL,

    CONSTRAINT "product_attribute_options_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "product_attribute_options_attributeOptionId_idx" ON "product_attribute_options"("attributeOptionId");

-- CreateIndex
CREATE UNIQUE INDEX "product_attribute_options_productAttributeId_attributeOptio_key" ON "product_attribute_options"("productAttributeId", "attributeOptionId");

-- AddForeignKey
ALTER TABLE "product_attribute_options" ADD CONSTRAINT "product_attribute_options_productAttributeId_fkey" FOREIGN KEY ("productAttributeId") REFERENCES "product_attributes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_attribute_options" ADD CONSTRAINT "product_attribute_options_attributeOptionId_fkey" FOREIGN KEY ("attributeOptionId") REFERENCES "attribute_options"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
