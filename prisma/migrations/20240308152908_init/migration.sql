/*
  Warnings:

  - Added the required column `active` to the `shipment_status` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "shipment_status" ADD COLUMN     "active" BOOLEAN NOT NULL;
