-- DropForeignKey
ALTER TABLE "product_attribute_options" DROP CONSTRAINT "product_attribute_options_productAttributeId_fkey";

-- DropForeignKey
ALTER TABLE "product_attributes" DROP CONSTRAINT "product_attributes_product_id_fkey";

-- DropForeignKey
ALTER TABLE "product_images" DROP CONSTRAINT "product_images_product_id_fkey";

-- AlterTable
ALTER TABLE "product_images" ALTER COLUMN "file" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_attributes" ADD CONSTRAINT "product_attributes_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_attribute_options" ADD CONSTRAINT "product_attribute_options_productAttributeId_fkey" FOREIGN KEY ("productAttributeId") REFERENCES "product_attributes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
