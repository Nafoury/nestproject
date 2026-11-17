/*
  Warnings:

  - The `unit` column on the `attributes` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "attributes" DROP COLUMN "unit",
ADD COLUMN     "unit" TEXT;
