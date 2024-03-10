import { Prisma, Role, Shipment, Status, User } from "@prisma/client";
import { db } from "../config/db.server";
import {
  ShipmentSchemaType,
  ShipmentUpdateSchemaType,
} from "../schemas/shipment.schema";
import { findUnique } from "./user.service";
import { ShipmentDTO } from "../dto/shipment.dto";
import { saveStatus, updateStatus } from "./status.service";
import AppError from "../config/app.error";
import { StatusDTO } from "../dto/status.dto";

export const createShipment = async (request: ShipmentSchemaType) => {
  try {
    const trackingNumber: number = 123;
    const price = 300.0;

    const user: User = await findUnique({ id: request.userId });
    console.log("CREATE : ", user);
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

    return await db.$transaction(async (tx) => {
      const shipment = (await db.shipment.create({
        data: shipmentRequest,
      })) as Shipment;
      if (!shipment.id) {
        throw new AppError(417, "Shipment status not created");
      }
      const shipmentStatus = await saveStatus(shipment, Status.PENDING, "Shipment created");

      return {
        trackingNumber: shipment.trackingNumber,
        createdAt: shipment.createdAt,
        recipientName: shipment.recipientName,
        recipientAddress: shipment.recipientAddress,
        recipientMobile: shipment.recipientMobile,
        packageDescription: shipment.packageDescription,
        weight: shipment.weight,
        price: shipment.price,
        sender: user.name,
        currentStatus: shipmentStatus.status,
      } as ShipmentDTO;
    });
  } catch (error: any) {
    console.log(error.message);
    throw new AppError(500, error.message);
  }
};

export const updateShipmentStatus = async (
  request: ShipmentUpdateSchemaType
) => {
  try {
    const shipment = await db.shipment.findUnique({
      where: {
        id: request.shipmentId
      }
    });
    if(!shipment){
      throw new AppError(404, "Shipment not found");
    }
    await updateStatus(request.shipmentId);
    await saveStatus(shipment, request.status as Status, request.description);
  } catch (error) {
    throw error;
  }
};

export const trackShipment = async (trackingNumber: number) => {
  try {
    const shipment = await db.shipment.findUnique({
      where: { trackingNumber: trackingNumber },
      include: {
        user: true,
        shipmentStatus: true,
      },
    });

    if (!shipment) {
      throw new AppError(404, "Shipment not found");
    }

    const statusList = shipment.shipmentStatus.map(
      (shipmentStatus) =>
        ({
          status: shipmentStatus.status,
          description: shipmentStatus.description,
          date: shipmentStatus.createdAt,
          active: shipmentStatus.active,
        } as StatusDTO)
    );
    const shipmentResponse: ShipmentDTO = {
      trackingNumber: shipment.trackingNumber,
      createdAt: shipment.createdAt,
      recipientName: shipment.recipientName,
      recipientAddress: shipment.recipientAddress,
      recipientMobile: shipment.recipientMobile,
      packageDescription: shipment.packageDescription,
      weight: shipment.weight,
      price: shipment.price,
      sender: shipment.user.name,
      statusList: statusList,
    };
    return shipmentResponse;
  } catch (error) {
    throw new AppError(500, "Something went wrong");
  }
};

export const fetchShipmentsbyUser = async (userId: number) => {
  try {
    const shipmentList = await db.shipment.findMany({
      where: { userId: userId },
      select: {
        trackingNumber: true,
        createdAt: true,
        recipientName: true,
        recipientAddress: true,
        recipientMobile: true,
        packageDescription: true,
        weight: true,
        price: true,
        shipmentStatus: {
          where: { active: true },
          select: { status: true },
          take: 1,
        },
      },
    });
    if (shipmentList.length === 0) {
      throw new AppError(404, "Shipments not found");
    }

    return shipmentList.map((shipment) => {
      if (shipment.shipmentStatus.length === 0) {
        return shipment;
      } else {
        return {
          ...shipment,
          currentStatus: shipment.shipmentStatus[0].status,
        };
      }
    });
  } catch (error) {
    throw error;
  }
};

export const fetchShipmentsbyUserAndStataus = async (
  userId: number,
  status: Status
) => {
  try {
    const shipmentList = await db.shipment.findMany({
      where: {
        userId: userId,
        AND: [
          {
            shipmentStatus: {
              some: {
                status: status,
              },
            },
          },
        ],
      },
      select: {
        trackingNumber: true,
        createdAt: true,
        recipientName: true,
        recipientAddress: true,
        recipientMobile: true,
        packageDescription: true,
        weight: true,
        price: true,
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

    if (shipmentList.length === 0) {
      return [];
    }
    return shipmentList;
  } catch (error) {
    throw error;
  }
};
