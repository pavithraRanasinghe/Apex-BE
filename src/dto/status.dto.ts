import { Status } from "@prisma/client";

export interface StatusDTO {
    status: Status;
    description: string;
    date: Date;
    active: boolean
}