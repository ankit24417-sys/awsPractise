import "dotenv/config";
import path from "node:path";
import dotenv from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

// Ensure .env is loaded regardless of process.cwd()
dotenv.config({ path: path.resolve(import.meta.dirname, "../../.env") });
dotenv.config({ path: path.resolve(import.meta.dirname, "../../../.env") });

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://ankit:ankit@localhost:5432/prismaPractise?schema=public";

export const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString,
  }),
});
