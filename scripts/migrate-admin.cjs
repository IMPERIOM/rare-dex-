const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local
try {
  const envPath = path.join(__dirname, "../.env.local");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf-8");
    envContent.split("\n").forEach(line => {
      const match = line.match(/^\s*([^#=]+)\s*=\s*(.*)$/);
      if (match) {
        const key = match[1].trim();
        let value = match[2].trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        process.env[key] = value;
      }
    });
  }
} catch (e) {
  console.warn("Could not read .env.local:", e.message);
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set in env or .env.local");
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  console.log('Running migration on active database...');

  // Add missing columns to existing orders table
  const alters = [
    "ALTER TABLE orders ADD COLUMN IF NOT EXISTS ref VARCHAR(50)",
    "ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_instructions TEXT",
    "ALTER TABLE orders ADD COLUMN IF NOT EXISTS proof_uploaded BOOLEAN DEFAULT FALSE",
    "ALTER TABLE orders ADD COLUMN IF NOT EXISTS proof_url TEXT",
  ];
  for (const s of alters) {
    await pool.query(s);
    console.log('OK:', s);
  }

  // Backfill ref for existing orders that don't have one
  await pool.query(
    "UPDATE orders SET ref = 'RDX-' || upper(substr(replace(id::text, '-', ''), 1, 8)) WHERE ref IS NULL"
  );
  console.log('Refs backfilled.');

  // Create products_inventory table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products_inventory (
      id VARCHAR(100) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      sku VARCHAR(100),
      stock INTEGER NOT NULL DEFAULT 100,
      price NUMERIC(10,2),
      availability VARCHAR(50) NOT NULL DEFAULT 'in-stock',
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('products_inventory table ready.');

  // Add indexes
  const indexes = [
    'CREATE INDEX IF NOT EXISTS idx_orders_ref ON orders(ref)',
    'CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)',
    'CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email)',
  ];
  for (const s of indexes) {
    try { await pool.query(s); console.log('OK:', s); } catch(e) { console.warn('Index skipped:', e.message); }
  }

  console.log('\nAll migrations applied successfully!');
  await pool.end();
}

run().catch(e => {
  console.error('Migration failed:', e.message);
  pool.end();
  process.exit(1);
});
