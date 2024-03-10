import express, { NextFunction, Request, Response } from "express";
import { validator } from "../middleware/validator";
import { LongInUserSchemaType, logInUserSchema } from "../schemas/user.schema";
import { userLogIn } from "../services/auth.service";
import AppError from "../config/app.error";

const router = express.Router();

router.post(
  "/login",
  validator(logInUserSchema),
  async (
    req: Request<{}, {}, LongInUserSchemaType>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = await userLogIn(req.body.email, req.body.password, next);

      res.status(200).json({
        message: "Login successful",
        data: {
          user,
        },
      });
    } catch (error: any) {
      console.log('ERR: ', error);
      res.status(error.statusCode).json({
          code: error.statusCode,
          message: error.message
      });
    }
  }
);

export default router;
