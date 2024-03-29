import { number, object, string, TypeOf, z } from "zod";

/**
 * Validation for shipment creation request
 */
export const shipmentSchema = object({
  body: object({
    recipientName: string({
      required_error: "Recipient name cannot be empty",
    }),
    recipientAddress: string({
      required_error: "Recipient address cannot be empty",
    }),
    recipientMobile: number({
      required_error: "Recipient mobile number cannot be empty",
      invalid_type_error: "Mobile number should be a number",
    })
      .positive(),
    packageDescription: string({
      required_error: "Package description cannot be empty",
    }),
    weight: number({
      required_error: "Weight cannot be empty",
      invalid_type_error: "Weight should be a number",
    }).positive(),
    userId: number({
      required_error: "User id cannot be empty",
      invalid_type_error: "User id should be a number",
    }).positive(),
  })
});

/**
 * Validation for shipment status update request
 */
export const shipmentUpdateSchema = object({
  body: object({
    shipmentId: number({
      required_error: "Shipment id cannot be empty",
    }),
    status: string({
      required_error: "Status cannot be empty",
    }),
    description: z.optional(z.string())
  })
});


export type ShipmentSchemaType = TypeOf<typeof shipmentSchema>["body"];
export type ShipmentUpdateSchemaType = TypeOf<typeof shipmentUpdateSchema>["body"];
