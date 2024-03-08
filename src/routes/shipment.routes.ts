import express, { Request, Response } from "express";
import { validator } from "../middleware/validator";
import { ShipmentSchemaType, shipmentSchema } from "../schemas/shipment.schema";
import { createShipment } from "../services/shipment.service";

const router = express.Router();

router.post(
  "/",
  validator(shipmentSchema),
  async (req: Request<{}, {}, ShipmentSchemaType>, res: Response) => {
    const shipment = await createShipment(req.body);
    res.status(201).json({shipment});
  }
);

export default router;
