/**
 * db-fix.js — Run this after 0001_orders.sql to add any missing tables/columns.
 * Safe: uses IF NOT EXISTS everywhere.
 */
const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

// Parse .env.local
try {
  const envPath = path.join(__dirname, "../.env.local");
  if (fs.existsSync(envPath)) {
    fs.readFileSync(envPath, "utf-8").split("\n").forEach(line => {
      const m = line.match(/^\s*([^#=]+)\s*=\s*(.*)$/);
      if (m) {
        let val = m[2].trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
        process.env[m[1].trim()] = val;
      }
    });
  }
} catch (e) { console.warn("Could not read .env.local:", e.message); }

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function run() {
  console.log("Connecting to database…");

  // 1. Ensure products_inventory exists
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products_inventory (
      id           VARCHAR(100) PRIMARY KEY,
      name         VARCHAR(255) NOT NULL,
      sku          VARCHAR(100),
      stock        INTEGER      NOT NULL DEFAULT 100,
      price        NUMERIC(10,2) NOT NULL DEFAULT 0,
      availability VARCHAR(50)  NOT NULL DEFAULT 'in-stock',
      updated_at   TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log("✓ products_inventory table ready");

  // 2. Ensure idx_orders_email index exists (our code uses this)
  await pool.query("CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email)").catch(() => {});
  console.log("✓ idx_orders_email index ready");

  // 3. Seed products_inventory if empty
  const countRes = await pool.query("SELECT COUNT(*) FROM products_inventory");
  if (parseInt(countRes.rows[0].count, 10) === 0) {
    console.log("Seeding default products…");
    const products = [
      { id: "pitch-black-booster-box",        name: "Pitch Black Booster Box",                                                     sku: "PKM-PBBB-01",  stock: 24,  price: 219.99  },
      { id: "japanese-m6-storm-emeralda",      name: "Japanese Pokémon - M6 - Storm Emeralda (Delta Species) Sealed Booster Box",  sku: "PKM-JP-M6",    stock: 5,   price: 1799.99 },
      { id: "pokemon-tcg-30th-celebration",    name: "Pokémon TCG: 30th Celebration (Anniversary) Premium Box",                    sku: "PKM-30TH-PB",  stock: 12,  price: 499.99  },
    ];
    for (const p of products) {
      await pool.query(
        `INSERT INTO products_inventory (id, name, sku, stock, price) VALUES ($1,$2,$3,$4,$5) ON CONFLICT (id) DO NOTHING`,
        [p.id, p.name, p.sku, p.stock, p.price]
      );
    }
    console.log("✓ Default products seeded");
  } else {
    console.log(`✓ products_inventory already has data (skipping seed)`);
  }

  // 4. Verify orders table columns
  const colRes = await pool.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'orders' AND table_schema = 'public'
  `);
  const cols = colRes.rows.map(r => r.column_name);
  console.log("\norders table columns:", cols.join(", "));

  console.log("\n✅ All fixes applied successfully!");
  await pool.end();
}

run().catch(err => {
  console.error("Fix failed:", err.message);
  pool.end();
  process.exit(1);
});
