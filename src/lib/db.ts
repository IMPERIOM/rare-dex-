import { Pool } from "pg";

/**
 * Use a global singleton so the Pool persists across Next.js hot-reloads in dev.
 * Without this, each hot-reload creates a new Pool, exhausting Neon's connection limit.
 */
declare global {
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined;
}

function createPool(): Pool {
  let connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set. Please add it to .env.local");
  }

  // Remove channel_binding=require — not supported by all pg versions and causes ETIMEDOUT
  connectionString = connectionString
    .replace(/[&?]channel_binding=require/g, "")
    .replace(/[&?]channel_binding=prefer/g, "");

  return new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 3,                   // Neon free tier: keep connections low
    idleTimeoutMillis: 20000,
    connectionTimeoutMillis: 10000,
  });
}

export function getPool(): Pool {
  if (!global.__pgPool) {
    global.__pgPool = createPool();
  }
  return global.__pgPool;
}

export async function dbQuery(text: string, params?: any[]) {
  const pool = getPool();
  try {
    return await pool.query(text, params);
  } catch (err: any) {
    // If connection is broken, destroy and recreate the pool on next call
    if (err.code === "ETIMEDOUT" || err.code === "ECONNRESET" || err.code === "ENETUNREACH") {
      console.warn("[db] Connection error, resetting pool:", err.code);
      try { await global.__pgPool?.end(); } catch {}
      global.__pgPool = undefined;
    }
    throw err;
  }
}
