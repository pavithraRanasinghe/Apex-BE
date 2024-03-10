import express, { NextFunction, Request, Response } from "express";
import { validator } from "../middleware/validator";
import { LongInUserSchemaType, logInUserSchema } from "../schemas/user.schema";
import { userLogIn } from "../services/auth.service";
import AppError from "../config/app.error";
import { Role } from "@prisma/client";

const router = express.Router();

/**
 * This Route for sender's login
 */
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
      console.log("ERR: ", error);
      res.status(error.statusCode).json({
        code: error.statusCode,
        message: error.message,
      });
    }
  }
);

/**
 * This Route for admin's login
 */
router.post(
  "/admin/login",
  validator(logInUserSchema),
  async (
    req: Request<{}, {}, LongInUserSchemaType>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = await userLogIn(req.body.email, req.body.password, next);
      if (user.role !== Role.ADMIN) {
        res.status(401).json({
          code: 401,
          message: "Unauthorize Login",
        });
      } else {
        res.status(200).json({
          message: "Login successful",
          data: {
            user,
          },
        });
      }
    } catch (error: any) {
      res.status(error.statusCode).json({
        code: error.statusCode,
        message: error.message,
      });
    }
  }
);

export default router;
