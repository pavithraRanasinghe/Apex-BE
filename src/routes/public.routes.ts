import express, { Request, Response } from 'express'
import { trackShipment } from '../services/shipment.service';

const router = express.Router();

/**
 * This Route is public route. for track the shipment
 */
router.get("/shipment/:trackingNumber", async (req: Request, res: Response) => {
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

export default router;