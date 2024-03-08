import express, { NextFunction, Request, Response } from "express";
import { validator } from "../middleware/validator";
import { ShipmentSchemaType, shipmentSchema } from "../schemas/shipment.schema";
import { createShipment, fetchShipmentsbyUser, trackShipment } from "../services/shipment.service";
import { UserRequest, auth } from "../middleware/auth";

const router = express.Router();
router.use(auth);
router.post(
  "/",
  validator(shipmentSchema),
  async (req: Request<{}, {}, ShipmentSchemaType>, res: Response) => {
    const shipment = await createShipment(req.body);
    res.status(201).json({
      message: "Shipment save successful",
      data: shipment,
    });
  }
);

router.get("/:trackingNumber", async (req: Request, res: Response) => {
  try {
    const trackingNumber: number = parseInt(req.params.trackingNumber);
    const shipmentDetails = await trackShipment(trackingNumber);
    res.status(200).json({
      message: "Shipment details fetch successful",
      data: shipmentDetails,
    });
  } catch (error) {
    throw error;
  }
});

router.get("/",async(req:UserRequest, res:Response)=>{
    const userId:any = req.user;
    const shipmentList = await fetchShipmentsbyUser(userId);
    res.status(200).json({
        message: "Shipment list fetch successful",
        data: shipmentList
    })
});

export default router;
