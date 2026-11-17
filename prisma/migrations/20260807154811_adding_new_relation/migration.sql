/*
  Warnings:

  - A unique constraint covering the columns `[product_id,attribute_id]` on the table `product_attributes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "product_attributes_product_id_attribute_id_key" ON "product_attributes"("product_id", "attribute_id");
