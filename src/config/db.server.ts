import { PrismaClient } from "@prisma/client";

/**
 * Responsible for create only single Prisma client instance
 */
let db: PrismaClient;

declare global {
  var __db: PrismaClient | undefined;
}

if (!global.__db) {
  global.__db = new PrismaClient();
}

db = global.__db;

export { db };
