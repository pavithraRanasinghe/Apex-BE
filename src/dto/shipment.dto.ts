import { StatusDTO } from "./status.dto";

export interface ShipmentDTO {
  trackingNumber: number;
  createdAt: Date;
  recipientName: string;
  recipientAddress: string;
  recipientMobile: number;
  packageDescription: string;
  weight: number;
  price: number;
  sender: string;
  currentStatus?: string;
  statusList?: StatusDTO[];
}
