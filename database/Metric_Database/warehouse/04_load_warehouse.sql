-- Clear Existing Analytics Data

truncate table analytics.fact_sales;
truncate table analytics.dim_customer;
truncate table analytics.dim_product;
truncate table analytics.dim_region;
truncate table analytics.dim_date;
truncate table analytics.dim_salesperson;

-- Load Customer Data

insert into analytics.dim_customer
(
    customer_id,
    customer_name,
    email,
    phone,
    city,
    country,
    customer_type,
    created_at
)
select
    customer_id,
    customer_name,
    email,
    phone,
    city,
    country,
    customer_type,
    created_at
from staging.stg_customer;

-- Load Product Data

insert into analytics.dim_product
(
    product_id,
    product_name,
    category,
    sub_category,
    brand,
    unit_price,
    cost_price,
    status
)
select
    product_id,
    product_name,
    category,
    sub_category,
    brand,
    unit_price,
    cost_price,
    status
from staging.stg_product;

-- Load Region Data

insert into analytics.dim_region
(
    region_id,
    region_name,
    country,
    state,
    city
)
select
    region_id,
    region_name,
    country,
    state,
    city
from staging.stg_region;

-- Load Date Data

insert into analytics.dim_date
(
    date_id,
    full_date,
    day,
    month,
    month_name,
    quarter,
    year,
    week
)
select
    date_id,
    full_date,
    day,
    month,
    month_name,
    quarter,
    year,
    week
from staging.stg_date;

-- Load Salesperson Data

insert into analytics.dim_salesperson
(
    salesperson_id,
    salesperson_name,
    department,
    designation,
    region,
    email
)
select
    salesperson_id,
    salesperson_name,
    department,
    designation,
    region,
    email
from staging.stg_salesperson;

-- Load Sales Data

insert into analytics.fact_sales
(
    sale_id,
    customer_id,
    product_id,
    region_id,
    date_id,
    salesperson_id,
    quantity,
    revenue,
    cost,
    discount,
    sales_channel
)
select
    sale_id,
    customer_id,
    product_id,
    region_id,
    date_id,
    salesperson_id,
    quantity,
    revenue,
    cost,
    discount,
    sales_channel
from staging.stg_sales;