import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { validator } from "../middleware/validator";
import {
  registerUserSchema,
  RegisterUserSchemaType,
} from "../schemas/user.schema";

import { createUser } from "../services/user.service";
import { UserDTO } from "../dto/user.dto";

const router = express.Router();

router.post(
  "/",
  validator(registerUserSchema),
  async (req: Request<{}, {}, RegisterUserSchemaType>, res: Response) => {
    const password = await bcrypt.hash(req.body.password, 12);

    const user = await createUser({
      name: req.body.name,
      address: req.body.address,
      email: req.body.email,
      password: password,
      role: req.body.role,
    });
    const userResponse: UserDTO = {
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role
    };
    res.status(200).json({
      message: "Success",
      data: {
        userResponse,
      },
    });
  }
);

export default router;
