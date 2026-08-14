-- 0001_orders.sql
-- Run this in your Neon Postgres SQL Editor to initialize the database tables.

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  ref VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  customer_first_name VARCHAR(100) NOT NULL,
  customer_last_name VARCHAR(100) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(100) NOT NULL,
  company_name VARCHAR(255),
  shipping_address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  zip_code VARCHAR(50) NOT NULL,
  country VARCHAR(100) NOT NULL,
  delivery_instructions TEXT,
  shipping_method VARCHAR(100) NOT NULL,
  shipping_cost NUMERIC(10, 2) NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL,
  tax NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  total NUMERIC(10, 2) NOT NULL,
  payment_method VARCHAR(100) NOT NULL,
  payment_instructions TEXT,
  status VARCHAR(20) DEFAULT 'PENDING' NOT NULL,
  payment_email_sent_at TIMESTAMP WITH TIME ZONE,
  proof_uploaded BOOLEAN DEFAULT FALSE,
  proof_url TEXT,
  order_notes TEXT,
  items JSONB NOT NULL
);

-- Index on order ref and email for fast search
CREATE INDEX IF NOT EXISTS idx_orders_ref ON orders(ref);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Create products inventory table (other key feature to track)
CREATE TABLE IF NOT EXISTS products_inventory (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(100),
  stock INTEGER NOT NULL DEFAULT 100,
  price NUMERIC(10, 2),
  availability VARCHAR(50) NOT NULL DEFAULT 'in-stock',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
