import { Role } from "@prisma/client";
import { object, string, TypeOf, z } from "zod";

export const registerUserSchema = object({
  body: object({
    name: string({
      required_error: "Name cannot be empty",
    }),
    address: string({
      required_error: "Address cannot be empty",
    }),
    email: string({
      required_error: "Email cannot be empty",
    }).email("Invalid email address"),
    password: string({
      required_error: "Password cannot be empty",
    }).min(8, "Password must be more than 8 characters"),
    passwordConfirm: string({
      required_error: "Please confirm your password",
    }),
    role: z.optional(z.nativeEnum(Role)),
  }).refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "Passwords do not match",
  }),
});

export type RegisterUserSchemaType = TypeOf<typeof registerUserSchema>["body"];
