import { Prisma, Shipment, ShipmentStatus, Status } from "@prisma/client";
import { db } from "../config/db.server";
import AppError from "../config/app.error";

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
