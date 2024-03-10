import express, { Request, Response } from "express";
import { validator } from "../middleware/validator";
import { ShipmentSchemaType, shipmentSchema } from "../schemas/shipment.schema";
import { createShipment, fetchShipmentsbyUser, fetchShipmentsbyUserAndStataus } from "../services/shipment.service";
import { UserRequest, auth } from "../middleware/auth";
import { Status } from "@prisma/client";

const router = express.Router();
router.use(auth);

/**
 * This Route for create new shipment
 */
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

/**
 * This Route for fetch all shipments by user id
 */
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

/**
 * This Route for fetch shipment by status and logged user
 */
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
