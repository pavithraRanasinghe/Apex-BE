import { Status } from "@prisma/client";
import { db } from "../config/db.server";

export const fetchShipmentsStatus = async (status: Status) => {
  try {
    const shipmentList = await db.shipment.findMany({
      where: {
        shipmentStatus: {
          some: {
            status: status,
            active: true
          },
        },
      },
      select: {
        id:true,
        trackingNumber: true,
        createdAt: true,
        recipientName: true,
        recipientAddress: true,
        recipientMobile: true,
        packageDescription: true,
        weight: true,
        price: true,
        user: {
            select:{
                id:true,
                name: true,
                email: true
            }
        },
        shipmentStatus: {
          where: { status: status },
          select: {
            description: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });
    console.log(shipmentList);
    if (shipmentList.length === 0) {
      return [];
    }
    return shipmentList;
  } catch (error) {
    throw error;
  }
};
