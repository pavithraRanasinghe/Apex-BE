import { db } from "../config/db.server";
import { Prisma, User } from "@prisma/client";
import { UserDTO } from "../dto/user.dto";
import AppError from "../config/app.error";

export const createUser = async (userReq: Prisma.UserCreateInput) => {
  try {
    const user = (await db.user.create({
      data: userReq,
    })) as User;

    const userResponse: UserDTO = {
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role,
    };
    return userResponse;
  } catch (error) {
    throw new AppError(500, "Something went wrong");
  }
};

export const findUnique = async (where: Prisma.UserWhereUniqueInput) => {
  try {
    return (await db.user.findUnique({
      where,
    })) as User;
  } catch (error) {
    throw new AppError(500, "Something went wrong");
  }
};
