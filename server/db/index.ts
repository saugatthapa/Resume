import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("DATABASE_URL must be set in production.");
  }
  console.warn("DATABASE_URL not set. Database queries will fail until configured.");
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL ?? "" });
export const db = drizzle(pool, { schema });

export * from "./schema";