import { Prisma, Shipment, ShipmentStatus, Status } from "@prisma/client";
import { db } from "../config/db.server";
import AppError from "../config/app.error";

/**
 * Save new status
 * 
 * @param shipment Related shipment
 * @param status New status type
 * @param desc Desription if needed
 * @returns Saved status
 */
export const saveStatus = async (shipment: Shipment, status: Status, desc: string | undefined) => {
  try {
    const statusRequest: Prisma.ShipmentStatusCreateInput = {
      status: status,
      description: desc,
      active: true,
      shipment: {
        connect: shipment,
      },
    };
    return (await db.shipmentStatus.create({
      data: statusRequest,
    })) as ShipmentStatus;
  } catch (error) {
    throw new AppError(500, "Status create failed");
  }
};

/**
 * Update status active state by shipment id
 * 
 * @param shipmentId Shipment Id
 */
export const updateStatus =async (shipmentId: number) => {
  try{
    await db.shipmentStatus.updateMany({
      where: {shipmentId: shipmentId},
      data: {active: false}
    });
  }catch(error){
    throw new AppError(500, "Status update failed");
  }
}
