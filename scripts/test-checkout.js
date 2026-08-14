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
        // Remove surrounding quotes if present
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

async function test() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL is not defined in env or .env.local");
    process.exit(1);
  }

  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  console.log("Connected to database. Testing schema and order engine logic...");

  try {
    // 1. Check if products_inventory has items
    const productsRes = await pool.query("SELECT * FROM products_inventory LIMIT 3");
    console.log(`Found ${productsRes.rows.length} products in inventory.`);
    if (productsRes.rows.length === 0) {
      console.log("Inserting a mock product...");
      await pool.query(`
        INSERT INTO products_inventory (id, name, slug, stock, price, availability)
        VALUES ('pitch-black-booster-box', 'Pitch Black Booster Box', 'pitch-black-booster-box', 15, 219.99, 'in-stock')
        ON CONFLICT (id) DO NOTHING
      `);
    }

    const testProd = (await pool.query("SELECT * FROM products_inventory LIMIT 1")).rows[0];
    console.log("Using product for test:", testProd);

    // 2. Perform test order insertion
    const ref = "RDX-TEST-" + Math.random().toString(36).slice(2, 6).toUpperCase();
    console.log(`Creating order with ref ${ref}...`);

    const orderRes = await pool.query(
      `INSERT INTO orders (
        ref, status, email, customer_name, phone, company,
        shipping_address, delivery_instructions, order_notes,
        payment_method, payment_network,
        subtotal_eur, shipping_eur, total_eur, currency, locale,
        newsletter_opt_in, lines
      ) VALUES (
        $1, 'PENDING', $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
      ) RETURNING *`,
      [
        ref,
        "customer@example.com",
        "John Doe",
        "+1 555 1234",
        "Test Corp",
        JSON.stringify({ line1: "123 Test St", city: "New York", state: "NY", zip: "10001", country: "United States" }),
        "Leave at front door",
        "Fragile item",
        "Zelle",
        null,
        testProd.price,
        0.00,
        testProd.price,
        "USD",
        "en",
        false,
        JSON.stringify([{ productId: testProd.id, product_name: testProd.name, qty: 1, unit_price: testProd.price }])
      ]
    );

    const newOrder = orderRes.rows[0];
    console.log("Order created successfully:", {
      id: newOrder.id,
      ref: newOrder.ref,
      customer: newOrder.customer_name,
      total: newOrder.total_eur
    });

    // 3. Perform stock decrement test
    console.log(`Decrementing stock for product ID: ${testProd.id} by 1 unit...`);
    const stockUpdateRes = await pool.query(
      `UPDATE products_inventory 
       SET stock = GREATEST(0, stock - 1),
           availability = CASE WHEN stock - 1 <= 0 THEN 'out-of-stock' ELSE availability END
       WHERE id = $1 RETURNING *`,
      [testProd.id]
    );

    console.log("Updated product inventory:", stockUpdateRes.rows[0]);

    // 4. Verify orders list queries
    const listRes = await pool.query("SELECT * FROM orders WHERE ref = $1", [ref]);
    console.log(`Querying order by ref: found ${listRes.rows.length} order.`);

    // Clean up test order
    console.log("Cleaning up test order...");
    await pool.query("DELETE FROM orders WHERE ref = $1", [ref]);
    console.log("Cleanup complete!");

  } catch (err) {
    console.error("Test failed:", err);
  } finally {
    await pool.end();
  }
}

test();
