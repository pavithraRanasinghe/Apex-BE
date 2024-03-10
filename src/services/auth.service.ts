import { NextFunction } from "express";
import bcrypt from "bcryptjs";
import config from "config";

import { findUnique } from "./user.service";
import AppError from "../config/app.error";
import { generateToken } from "../config/jwt";
import { UserDTO } from "../dto/user.dto";

/**
 * User Login for all Roles
 * 
 * @param email as a username
 * @param password raw password
 * @param next callback fn
 * @returns Logged User
 */
export const userLogIn = async (
  email: string,
  password: string,
  next: NextFunction
) => {
  try {
    const user = await findUnique({ email: email });
    if (!user) {
      throw new AppError(400, "Invalid email or password");
    }
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new AppError(400, "Invalid email or password");
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

  } catch (error) {
    throw error;
  }
};
