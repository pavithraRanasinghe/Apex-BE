import { NextFunction } from "express";
import bcrypt from "bcryptjs";
import config from "config";

import { findUnique } from "./user.service";
import AppError from "../config/app.error";
import { generateToken } from "../config/jwt";
import { UserDTO } from "../dto/user.dto";

export const userLogIn = async (
  email: string,
  password: string,
  next: NextFunction
) => {
  const user = await findUnique({ email: email });
  if (!user) {
    throw next(new AppError(400, "Invalid email or password"));
  }

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw next(new AppError(400, "Invalid email or password"));
  }

  const token = generateToken({ userId: user.id }, "accessTokenPrivateKey", {
    expiresIn: `${config.get<number>("accessTokenExpiresIn")}`,
  });
  const userResponse: UserDTO = {
    id: user.id,
    name: user.name,
    email: user.email,
    address: user.address,
    role: user.role,
    token: token,
  };

  return userResponse;
};
