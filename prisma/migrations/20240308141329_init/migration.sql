/*
  Warnings:

  - Made the column `packageDescription` on table `shipment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `shipment_status` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "shipment" ALTER COLUMN "packageDescription" SET NOT NULL;

-- AlterTable
ALTER TABLE "shipment_status" ALTER COLUMN "description" SET NOT NULL;
