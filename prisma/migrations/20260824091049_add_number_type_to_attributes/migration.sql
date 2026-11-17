-- CreateEnum
CREATE TYPE "NumberType" AS ENUM ('integer', 'decimal');

-- AlterTable
ALTER TABLE "attributes" ADD COLUMN     "numberType" "NumberType";
