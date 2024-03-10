/*
  Warnings:

  - You are about to alter the column `trackingNumber` on the `shipment` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "shipment" ALTER COLUMN "trackingNumber" SET DATA TYPE INTEGER;
