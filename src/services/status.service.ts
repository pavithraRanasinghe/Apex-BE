import { Prisma, Shipment, ShipmentStatus, Status } from "@prisma/client";
import { db } from "../config/db.server"

export const saveStatus = async(shipment: Shipment)=>{

    try{
        const statusRequest: Prisma.ShipmentStatusCreateInput = {
            status: Status.PENDING,
            description: "Shipment created",
            active: true,
            shipment: {
                connect: shipment
            }
        }
        return (await db.shipmentStatus.create({
            data: statusRequest
        })) as ShipmentStatus;
    }catch(error){
        throw error;
    }
}