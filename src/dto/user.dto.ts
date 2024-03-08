import { Role } from "@prisma/client";

export interface UserDTO {
    id: number;
    name: string;
    address: string;
    email: string;
    role: Role
}