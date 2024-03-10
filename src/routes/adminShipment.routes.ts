import express, { Request, Response } from "express";
import { auth } from "../middleware/auth";
import { Status } from "@prisma/client";
import { fetchShipmentsStatus } from "../services/adminShipment.service";
import { validator } from "../middleware/validator";
import { ShipmentUpdateSchemaType, shipmentUpdateSchema } from "../schemas/shipment.schema";
import { updateShipmentStatus } from "../services/shipment.service";

const router = express.Router();
router.use(auth)

/**
 * Route for fetch shipments by status
 */
router.get("/status/:status", async (req: Request, res: Response) => {
  try {
    const status: Status = req.params.status as Status;
    const shipmentList = await fetchShipmentsStatus(status);
    res.status(200).json({
      message: "Shipment list fetch successful",
      data: shipmentList,
    });
  } catch (error: any) {
    res.status(error.statusCode).json({
      code: error.statusCode,
      message: error.message,
    });
  }
});

/**
 * Route for update shipment status
 */
router.put(
    "/",
    validator(shipmentUpdateSchema),
    async (req: Request<{}, {}, ShipmentUpdateSchemaType>, res: Response) => {
      try{
        console.log('UPDATE');
        const shipment = await updateShipmentStatus(req.body);
        res.status(200).json({
          message: "Shipment update successful",
          data: shipment,
        });
      }catch(error: any){
        res.status(error.statusCode).json({
          code: error.statusCode,
          message: error.message
      });
      }
    }
  );

export default router;
