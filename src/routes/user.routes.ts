import express, { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { validator } from "../middleware/validator";
import {
  registerUserSchema,
  RegisterUserSchemaType,
} from "../schemas/user.schema";

import { createUser } from "../services/user.service";
import { UserDTO } from "../dto/user.dto";
import AppError from "../config/app.error";

const router = express.Router();

router.post(
  "/",
  validator(registerUserSchema),
  async (req: Request<{}, {}, RegisterUserSchemaType>, res: Response, next: NextFunction) => {
    try{
        const password = await bcrypt.hash(req.body.password, 12);

    const user: UserDTO = await createUser({
      name: req.body.name,
      address: req.body.address,
      email: req.body.email,
      password: password,
      role: req.body.role,
    });
    res.status(201).json({
      message: "Success",
      data: {
        user,
      },
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
