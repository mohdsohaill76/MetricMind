-- Customer Staging Table

create table staging.stg_customer
(
    customer_id int,
    customer_name varchar(100),
    email varchar(100),
    phone varchar(20),
    city varchar(50),
    country varchar(50),
    customer_type varchar(50),
    created_at timestamp
);

-- Product Staging Table

create table staging.stg_product
(
    product_id int,
    product_name varchar(100),
    category varchar(50),
    sub_category varchar(50),
    brand varchar(50),
    unit_price decimal(10,2),
    cost_price decimal(10,2),
    status varchar(20)
);

-- Region Staging Table

create table staging.stg_region
(
    region_id int,
    region_name varchar(50),
    country varchar(50),
    state varchar(50),
    city varchar(50)
);

-- Date Staging Table

create table staging.stg_date
(
    date_id int,
    full_date DATE,
    day int,
    month int,
    month_name varchar(20),
    quarter int,
    year int,
    week int
);

-- Salesperson Staging Table

create table staging.stg_salesperson
(
    salesperson_id int,
    salesperson_name varchar(100),
    department varchar(50),
    designation varchar(50),
    region varchar(50),
    email varchar(100)
);

-- Sales Fact Staging Table

create table staging.stg_sales
(
    sale_id int,

    customer_id int,
    product_id int,
    region_id int,
    date_id int,
    salesperson_id int,
    
    quantity int,
    revenue decimal(12,2),
    cost decimal(12,2),
    discount decimal(10,2),
    sales_channel varchar(20)
);