import express, { NextFunction, Request, Response } from "express";
import { validator } from "../middleware/validator";
import { ShipmentSchemaType, ShipmentUpdateSchemaType, shipmentSchema, shipmentUpdateSchema } from "../schemas/shipment.schema";
import { createShipment, fetchShipmentsbyUser, fetchShipmentsbyUserAndStataus, trackShipment, updateShipmentStatus } from "../services/shipment.service";
import { UserRequest, auth } from "../middleware/auth";
import { Role, Status } from "@prisma/client";

const router = express.Router();
router.use(auth);
router.post(
  "/",
  validator(shipmentSchema),
  async (req: Request<{}, {}, ShipmentSchemaType>, res: Response) => {
    try{
      const shipment = await createShipment(req.body);
      res.status(201).json({
        message: "Shipment save successful",
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

router.put(
  "/",
  validator(shipmentUpdateSchema),
  async (req: Request<{}, {}, ShipmentUpdateSchemaType>, res: Response) => {
    try{
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

router.get("/:trackingNumber", async (req: Request, res: Response) => {
  try {
    const trackingNumber: number = parseInt(req.params.trackingNumber);
    const shipmentDetails = await trackShipment(trackingNumber);
    res.status(200).json({
      message: "Shipment details fetch successful",
      data: shipmentDetails,
    });
  } catch (error: any) {
    res.status(error.statusCode).json({
      code: error.statusCode,
      message: error.message
  });
  }
});

router.get("/",async(req:UserRequest, res:Response)=>{
  try{
    const userId:any = req.user;
    const shipmentList = await fetchShipmentsbyUser(userId);
    res.status(200).json({
        message: "Shipment list fetch successful",
        data: shipmentList
    })
  }catch(error: any){
    res.status(error.statusCode).json({
      code: error.statusCode,
      message: error.message
  });
  }
});

router.get("/status/:status",async(req:UserRequest, res:Response)=>{
  try{
    const userId:any = req.user;
    const status: Status = req.params.status as Status;
    const shipmentList = await fetchShipmentsbyUserAndStataus(userId, status);
    res.status(200).json({
        message: "Shipment list fetch successful",
        data: shipmentList
    });
  }catch(error: any){
    res.status(error.statusCode).json({

      code: error.statusCode, 
      message: error.message
  });
  }
});

export default router;
