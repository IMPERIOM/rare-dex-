const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

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
  console.error("DATABASE_URL is not defined in env or .env.local");
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function init() {
  console.log("Initializing database tables on the active Neon database...");

  try {
    // 1. Create orders table with correct schema
    console.log("Creating orders table...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        ref VARCHAR(50) UNIQUE NOT NULL,
        status VARCHAR(20) DEFAULT 'PENDING' NOT NULL,
        email VARCHAR(255) NOT NULL,
        customer_name VARCHAR(255) NOT NULL,
        phone VARCHAR(100),
        company VARCHAR(255),
        shipping_address JSONB NOT NULL,
        delivery_instructions TEXT,
        order_notes TEXT,
        payment_method VARCHAR(100) NOT NULL,
        payment_network VARCHAR(100),
        subtotal_eur NUMERIC(10,2) NOT NULL,
        shipping_eur NUMERIC(10,2) NOT NULL,
        total_eur NUMERIC(10,2) NOT NULL,
        currency VARCHAR(10) DEFAULT 'USD',
        locale VARCHAR(10) DEFAULT 'en',
        newsletter_opt_in BOOLEAN DEFAULT FALSE,
        lines JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        payment_email_sent_at TIMESTAMP WITH TIME ZONE,
        proof_uploaded BOOLEAN DEFAULT FALSE,
        proof_url TEXT,
        payment_details TEXT
      )
    `);
    console.log("orders table created successfully.");

    // 2. Create products_inventory table
    console.log("Creating products_inventory table...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products_inventory (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        sku VARCHAR(100),
        stock INTEGER NOT NULL DEFAULT 100,
        price NUMERIC(10,2) NOT NULL,
        availability VARCHAR(50) NOT NULL DEFAULT 'in-stock',
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("products_inventory table created successfully.");

    // 3. Create indexes
    console.log("Creating database indexes...");
    await pool.query("CREATE INDEX IF NOT EXISTS idx_orders_ref ON orders(ref)");
    await pool.query("CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)");
    await pool.query("CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email)");
    console.log("Indexes created successfully.");

    // 4. Seed products_inventory with products from the catalog if empty
    const countRes = await pool.query("SELECT COUNT(*) FROM products_inventory");
    const count = parseInt(countRes.rows[0].count, 10);
    if (count === 0) {
      console.log("Seeding products_inventory with default catalog items...");
      const defaultProducts = [
        { id: "pitch-black-booster-box", name: "Pitch Black Booster Box", sku: "PKM-PBBB-01", stock: 24, price: 219.99, availability: "in-stock" },
        { id: "japanese-m6-storm-emeralda", name: "Japanese Pokémon - M6 - Storm Emeralda (Delta Species) Sealed Booster Box", sku: "PKM-JP-M6", stock: 5, price: 1799.99, availability: "in-stock" },
        { id: "pokemon-tcg-30th-celebration", name: "Pokémon TCG: 30th Celebration (Anniversary) Premium Box", sku: "PKM-30TH-PB", stock: 12, price: 499.99, availability: "in-stock" }
      ];

      for (const p of defaultProducts) {
        await pool.query(
          `INSERT INTO products_inventory (id, name, sku, stock, price, availability)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [p.id, p.name, p.sku, p.stock, p.price, p.availability]
        );
      }
      console.log("Products inventory seeded.");
    }

    console.log("\nDatabase initialization completed successfully!");
  } catch (err) {
    console.error("Database initialization failed:", err);
  } finally {
    await pool.end();
  }
}

init();
