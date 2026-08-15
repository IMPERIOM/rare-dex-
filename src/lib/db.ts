import { Pool } from "pg";

let pool: Pool | null | undefined;

/** Neon (and any hosted Postgres) needs TLS; local sockets/loopback don't. */
function needsSsl(url: string): boolean {
  if (/sslmode=(disable|off)/i.test(url)) return false;
  try {
    const host = new URL(url).hostname;
    return host !== "localhost" && host !== "127.0.0.1" && host !== "::1";
  } catch {
    // Non-URL connection strings (e.g. socket paths) — assume local, no TLS.
    return false;
  }
}

export function getDb(): Pool | null {
  if (pool !== undefined) return pool;
  const url = process.env.DATABASE_URL;
  pool = url
    ? new Pool({
        connectionString: url,
        max: 5,
        // Neon free-tier compute scale-to-zero: a cold start can take a
        // few seconds to wake, so give it more room than pg's default.
        connectionTimeoutMillis: 15000,
        ssl: needsSsl(url) ? { rejectUnauthorized: false } : undefined,
      })
    : null;
  return pool;
}

export async function dbQuery(text: string, params?: any[]): Promise<{ rows: any[] }> {
  const db = getDb();
  if (!db) {
    throw new Error("DATABASE_URL is missing or database pool not initialized.");
  }
  const result = await db.query(text, params);
  return { rows: result.rows };
}
