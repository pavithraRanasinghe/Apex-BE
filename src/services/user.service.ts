import { db } from "../config/db.server";
import { Prisma, User } from "@prisma/client";
import { UserDTO } from "../dto/user.dto";

export const createUser = async (userReq: Prisma.UserCreateInput) => {
    try{
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
    }catch(error){
        throw error
    }
};

export const findByEmail = async (
  where: Prisma.UserWhereUniqueInput
) => {
  return (await db.user.findUnique({
    where
  })) as User;
};
