import dns from "dns";
import { Pool } from "pg";

// Force Node.js to use IPv4 DNS resolution first.
// Prevents network hangs on hosts without configured IPv6 routes.
try {
  dns.setDefaultResultOrder("ipv4first");
} catch {
  // Ignore if unsupported in environment
}

declare global {
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined;
}

function createPool(): Pool {
  let connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is missing in environment variables.");
  }

  // Strip query parameters that cause handshake issues with PgBouncer / Neon poolers
  connectionString = connectionString
    .replace(/[&?]channel_binding=[^&]*/g, "")
    .replace(/[&?]sslmode=[^&]*/g, "");

  return new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 20,
    idleTimeoutMillis: 30000,          // 30s idle timeout
    connectionTimeoutMillis: 60000,    // 60s (1 minute) connection timeout for Neon compute wake-up
    statement_timeout: 60000,          // 60s query execution timeout
    keepAlive: true,
    keepAliveInitialDelayMillis: 5000,
  });
}

export function getPool(): Pool {
  if (!global.__pgPool) {
    global.__pgPool = createPool();
  }
  return global.__pgPool;
}

async function resetPool() {
  if (global.__pgPool) {
    try {
      await global.__pgPool.end();
    } catch {}
    global.__pgPool = undefined;
  }
}

/**
 * Executes a parameterized SQL query with automatic 1-time retry on connection timeouts.
 */
export async function dbQuery(text: string, params?: any[]): Promise<{ rows: any[] }> {
  try {
    const pool = getPool();
    const result = await pool.query(text, params);
    return { rows: result.rows };
  } catch (firstErr: any) {
    const isConnErr =
      firstErr.code === "ETIMEDOUT" ||
      firstErr.code === "ECONNRESET" ||
      firstErr.code === "ENETUNREACH" ||
      firstErr.code === "57P01" ||
      firstErr.message?.includes("timeout");

    if (isConnErr) {
      console.warn("[dbQuery] Connection drop detected, resetting pool and retrying...", firstErr.code || firstErr.message);
      await resetPool();
      try {
        const freshPool = getPool();
        const retryResult = await freshPool.query(text, params);
        return { rows: retryResult.rows };
      } catch (retryErr) {
        throw retryErr;
      }
    }

    throw firstErr;
  }
}
