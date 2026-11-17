/*
  Warnings:

  - Changed the type of `file` on the `product_images` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "product_images" DROP COLUMN "file",
ADD COLUMN     "file" UUID NOT NULL;
