import dns from "dns";
import { Pool } from "pg";

// Ensure Node.js prioritizes IPv4 DNS resolution.
// Prevents ENETUNREACH / ETIMEDOUT when connecting to Neon on networks without IPv6 routes.
try {
  dns.setDefaultResultOrder("ipv4first");
} catch {
  // Ignore on Node versions where method is unavailable
}

declare global {
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined;
}

function createPool(): Pool {
  let connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set. Please check .env.local");
  }

  // Strip parameters that can cause issues with PgBouncer / Neon poolers
  connectionString = connectionString
    .replace(/[&?]channel_binding=[^&]*/g, "")
    .replace(/[&?]sslmode=[^&]*/g, "");

  return new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 15000, // 15s to allow Neon cold-start from idle
  });
}

export function getPool(): Pool {
  if (!global.__pgPool) {
    global.__pgPool = createPool();
  }
  return global.__pgPool;
}

export async function dbQuery(text: string, params?: any[]): Promise<{ rows: any[] }> {
  try {
    const pool = getPool();
    const result = await pool.query(text, params);
    return { rows: result.rows };
  } catch (err: any) {
    // If pool hit a connection reset or timeout, reset pool instance so next request reconnects
    if (
      err.code === "ETIMEDOUT" ||
      err.code === "ECONNRESET" ||
      err.code === "ENETUNREACH" ||
      err.code === "57P01"
    ) {
      console.warn("[dbQuery] Connection error encountered, resetting pool:", err.code || err.message);
      try {
        await global.__pgPool?.end();
      } catch {}
      global.__pgPool = undefined;
    }
    throw err;
  }
}
