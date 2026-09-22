import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required. Set it in backend/.env.");
}

const adapter = new PrismaPg({
  connectionString,
  connectionTimeoutMillis: 5000,
});

// ES modules are cached: all importers share this client and its connection pool.
export const prisma = new PrismaClient({ adapter });
