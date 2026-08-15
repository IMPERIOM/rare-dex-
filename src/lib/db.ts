import dns from "dns";
import { neon } from "@neondatabase/serverless";
import { Pool } from "pg";

// Force Node.js IPv4 DNS resolution
try {
  dns.setDefaultResultOrder("ipv4first");
} catch {}

declare global {
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined;
}

function getPgPool(): Pool {
  if (!global.__pgPool) {
    let connectionString = process.env.DATABASE_URL || "";
    connectionString = connectionString
      .replace(/[&?]channel_binding=[^&]*/g, "")
      .replace(/[&?]sslmode=[^&]*/g, "");

    global.__pgPool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 15000,
      keepAlive: true,
    });
  }
  return global.__pgPool;
}

/**
 * Executes parameterized SQL query using Neon Serverless HTTP driver first.
 * Bypasses TCP port 5432 socket timeouts (ETIMEDOUT / ENETUNREACH) completely.
 */
export async function dbQuery(text: string, params?: any[]): Promise<{ rows: any[] }> {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is missing in environment variables.");
  }

  // 1. Primary: Neon HTTP driver (Communicates via HTTPS Port 443 — immune to TCP 5432 timeouts)
  try {
    const sql = neon(connectionString);
    const result = await sql(text, params ?? []);
    return { rows: Array.isArray(result) ? result : [] };
  } catch (httpErr: any) {
    console.warn("[dbQuery] Neon HTTP query failed, trying PG TCP pool:", httpErr.message || httpErr);
  }

  // 2. Secondary Fallback: standard PG TCP pooler
  try {
    const pool = getPgPool();
    const res = await pool.query(text, params ?? []);
    return { rows: res.rows };
  } catch (pgErr: any) {
    console.error("[dbQuery] Both HTTP and TCP database queries failed:", pgErr.message || pgErr);
    throw pgErr;
  }
}
