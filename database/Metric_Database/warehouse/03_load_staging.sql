-- Load Customer Data

insert into staging.stg_customer
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
from business.dim_customer;

-- Load Product Data

insert into staging.stg_product
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
from business.dim_product;

-- Load Region Data

insert into staging.stg_region
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
from business.dim_region;

-- Load Date Data

insert into staging.stg_date
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
from business.dim_date;

-- Load Salesperson Data

insert into staging.stg_salesperson
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
from business.dim_salesperson;

-- Load Sales Data

insert into staging.stg_sales
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
from business.fact_sales;