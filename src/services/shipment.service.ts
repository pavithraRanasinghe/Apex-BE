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

/**
 * Create new shipment for deliver
 * 
 * @param request shipment details
 * @returns Saved shipment
 */
export const createShipment = async (request: ShipmentSchemaType) => {
  try {
    const trackingNumber = await getTrackingNumber();
    //Assume price is fixed for every destination
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

/**
 * Update existing shipment is activate or not
 * Create new shipment status
 * 
 * @param request Shipment id & status
 */
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
    throw error
  }
};

/**
 * Track shipment by tracking number
 * 
 * @param trackingNumber shipment tracking number
 * @returns single Shipment with multiple status
 */
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

/**
 * Fetch all shipments belongs to the user
 * 
 * @param userId User's id
 * @returns shipment list
 */
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

/**
 * Fetch shipment list by user id and status
 * 
 * @param userId User's id
 * @param status Status
 * @returns Shipment list with single status
 */
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

/**
 * Generate tracking number
 * 
 * @returns tracking type number
 */
const getTrackingNumber = async()=>{
  try{
    const count: string = await db.shipment.count() +"";
    const date: Date = new Date();
    return parseInt(date.getMinutes()+count+date.getMilliseconds());
  }catch(error){
    throw error
  }
}
