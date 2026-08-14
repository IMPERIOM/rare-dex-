import { Pool } from "pg";

let pool: Pool | null = null;

export function getPool(): Pool | null {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      console.warn("DATABASE_URL is not set. Database features will be unavailable.");
      return null;
    }
    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
    });
  }
  return pool;
}

export async function dbQuery(text: string, params?: any[]) {
  const p = getPool();
  if (!p) throw new Error("Database not connected. Please set DATABASE_URL in .env.local.");
  return p.query(text, params);
}
