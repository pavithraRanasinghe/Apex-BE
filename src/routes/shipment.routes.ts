import express, { NextFunction, Request, Response } from "express";
import { validator } from "../middleware/validator";
import {
  ShipmentSchemaType,
  shipmentSchema,
} from "../schemas/shipment.schema";
import { createShipment, trackShipment } from "../services/shipment.service";

const router = express.Router();

router.post(
  "/",
  validator(shipmentSchema),
  async (req: Request<{}, {}, ShipmentSchemaType>, res: Response) => {
    const shipment = await createShipment(req.body);
    res.status(201).json({ 
        message: "Shipment save successful",
        data: shipment
     });
  }
);

router.get(
  "/:trackingNumber",
  async (req:  Request, res: Response) => {
    const trackingNumber: number = parseInt(req.params.trackingNumber);
    const shipmentDetails = await trackShipment(trackingNumber);
    res.status(200).json({
        message: "Shipment details fetch successful",
        data: shipmentDetails
    });
  });

export default router;
