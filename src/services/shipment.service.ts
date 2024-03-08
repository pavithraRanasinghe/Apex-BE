import { Prisma, Shipment, User } from "@prisma/client";
import { db } from "../config/db.server";
import { ShipmentSchemaType } from "../schemas/shipment.schema";
import { findUnique } from "./user.service";
import { ShipmentDTO } from "../dto/shipment.dto";

export const createShipment = async (request: ShipmentSchemaType) => {
  try {
    const trackingNumber: number = 134;
    const price = 300.0;

    const user: User = await findUnique({ id: request.userId });
    const shipmentRequest: Prisma.ShipmentCreateInput = {
      trackingNumber: trackingNumber,
      recipientName: request.recipientName,
      recipientAddress: request.recipientAddress,
      recipientMobile: request.recipientMobile,
      packageDescription: request.packageDescription,
      weight: request.weight,
      price: price,
      user: {
        connect: user,
      },
    };

    const shipment = (await db.shipment.create({
      data: shipmentRequest,
    })) as Shipment;

    const shipmentResponse: ShipmentDTO = {
        trackingNumber: shipment.trackingNumber,
        createdAt: shipment.createdAt,
        recipientName: shipment.recipientName,
        recipientAddress: shipment.recipientAddress,
        recipientMobile: shipment.recipientMobile,
        packageDescription: shipment.packageDescription,
        weight: shipment.weight,
        price: shipment.price,
        sender: user.name
    }
    return shipmentResponse;
  } catch (error) {
    throw error;
  }
};
