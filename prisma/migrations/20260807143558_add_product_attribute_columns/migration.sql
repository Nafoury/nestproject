/*
  Warnings:

  - You are about to drop the column `number_value` on the `product_attributes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "product_attributes" DROP COLUMN "number_value",
ADD COLUMN     "numberMax" DECIMAL(10,2),
ADD COLUMN     "numberMin" DECIMAL(10,2),
ADD COLUMN     "numberValue" DECIMAL(10,2);
