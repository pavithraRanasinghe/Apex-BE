import { db } from "../config/db.server"
import { Prisma, User } from "@prisma/client"

export const createUser =async (input: Prisma.UserCreateInput) => {
    console.log(input);
    return (await db.user.create({
        data: input
    })) as User;
}