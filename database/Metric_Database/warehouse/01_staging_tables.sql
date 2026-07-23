-- Customer Staging Table
CREATE TABLE staging.stg_customer (
    customer_id INT,
    customer_name VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    city VARCHAR(50),
    country VARCHAR(50),
    customer_type VARCHAR(50),
    created_at TIMESTAMP
);

-- Product Staging Table
CREATE TABLE staging.stg_product (
    product_id INT,
    product_name VARCHAR(100),
    category VARCHAR(50),
    sub_category VARCHAR(50),
    brand VARCHAR(50),
    unit_price DECIMAL(10,2),
    cost_price DECIMAL(10,2),
    status VARCHAR(20)
);

-- Region Staging Table
CREATE TABLE staging.stg_region (
    region_id INT,
    region_name VARCHAR(50),
    country VARCHAR(50),
    state VARCHAR(50),
    city VARCHAR(50)
);

-- Date Staging Table
CREATE TABLE staging.stg_date (
    date_id INT,
    full_date DATE,
    day INT,
    month INT,
    month_name VARCHAR(20),
    quarter INT,
    year INT,
    week INT
);

-- Salesperson Staging Table
CREATE TABLE staging.stg_salesperson (
    salesperson_id INT,
    salesperson_name VARCHAR(100),
    department VARCHAR(50),
    designation VARCHAR(50),
    region VARCHAR(50),
    email VARCHAR(100)
);

-- Sales Fact Staging Table
CREATE TABLE staging.stg_sales (
    sale_id INT,
    customer_id INT,
    product_id INT,
    region_id INT,
    date_id INT,
    salesperson_id INT,
    quantity INT,
    revenue DECIMAL(12,2),
    cost DECIMAL(12,2),
    discount DECIMAL(10,2),
    sales_channel VARCHAR(20)
);