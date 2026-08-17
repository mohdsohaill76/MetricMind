-- ============================================================
-- MetricMind Database Feature: 08_init_cube_tables.sql
-- Purpose: Initialize PostgreSQL tables matching Cube.dev models
-- Target Database: PostgreSQL (metricmind)
-- ============================================================

-- 1. Create superstore table matching superstore.yml
CREATE TABLE IF NOT EXISTS public.superstore (
    id SERIAL PRIMARY KEY,
    ship_mode VARCHAR(50),
    segment VARCHAR(50),
    country VARCHAR(100),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    region VARCHAR(50),
    category VARCHAR(50),
    sub_category VARCHAR(50),
    sales NUMERIC(12, 4),
    quantity INT,
    discount NUMERIC(5, 4),
    profit NUMERIC(12, 4)
);

-- 2. Create users table matching users.yml
CREATE TABLE IF NOT EXISTS public.users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    age INT,
    gender VARCHAR(20),
    state VARCHAR(100),
    city VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create orders table matching base_order.yml
CREATE TABLE IF NOT EXISTS public.orders (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES public.users(id) ON DELETE CASCADE,
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- 4. Create products table matching products.yml
CREATE TABLE IF NOT EXISTS public.products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    product_category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create line_items table matching line_items.yml
CREATE TABLE IF NOT EXISTS public.line_items (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id INT REFERENCES public.products(id) ON DELETE CASCADE,
    price NUMERIC(12, 2)
);

-- 6. Create retail_sales table matching retail_sales.yml
CREATE TABLE IF NOT EXISTS public.retail_sales (
    id SERIAL PRIMARY KEY,
    "Customer ID" VARCHAR(100),
    "Gender" VARCHAR(20),
    "Price per Unit" NUMERIC(12, 2),
    "Product Category" VARCHAR(100),
    "Total Amount" NUMERIC(12, 2),
    "Date" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "Quantity" INT
);
