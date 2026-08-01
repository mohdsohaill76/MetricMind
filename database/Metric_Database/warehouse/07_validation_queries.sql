-- ==========================================
-- DATA VALIDATION QUERIES
-- ==========================================

-- ==========================================
-- 1. Foreign Key Integrity Check
-- ==========================================

-- Customer

select
case
    when count(*) = 0 then 'PASS'
    else 'FAIL'
end as customer_fk_validation
from analytics.fact_sales fs
left join analytics.dim_customer dc
on fs.customer_id = dc.customer_id
where dc.customer_id is null;

-- Product

select
case
    when count(*) = 0 then 'PASS'
    else 'FAIL'
end as product_fk_validation
from analytics.fact_sales fs
left join analytics.dim_product dp
on fs.product_id = dp.product_id
where dp.product_id is null;

-- Region

select
case
    when count(*) = 0 then 'PASS'
    else 'FAIL'
end as region_fk_validation
from analytics.fact_sales fs
left join analytics.dim_region dr
on fs.region_id = dr.region_id
where dr.region_id is null;

-- Date

select
case
    when count(*) = 0 then 'PASS'
    else 'FAIL'
end as date_fk_validation
from analytics.fact_sales fs
left join analytics.dim_date dd
on fs.date_id = dd.date_id
where dd.date_id is null;

-- Salesperson

select
case
    when count(*) = 0 then 'PASS'
    else 'FAIL'
end as salesperson_fk_validation
from analytics.fact_sales fs
left join analytics.dim_salesperson ds
on fs.salesperson_id = ds.salesperson_id
where ds.salesperson_id is null;

-- ==========================================
-- 2. Duplicate Business Keys
-- ==========================================

-- Customer Email

select
case
    when count(*) = 0 then 'PASS'
    else 'FAIL'
end as customer_email_validation
from
(
    select email
    from analytics.dim_customer
    group by email
    having count(*) > 1
) t;

-- Salesperson Email

select
case
    when count(*) = 0 then 'PASS'
    else 'FAIL'
end as salesperson_email_validation
from
(
    select email
    from analytics.dim_salesperson
    group by email
    having count(*) > 1
) t;

-- ==========================================
-- 3. NULL Value Validation
-- ==========================================

select
case
    when count(*) = 0 then 'PASS'
    else 'FAIL'
end as null_value_validation
from analytics.fact_sales
where
customer_id is null
or product_id is null
or region_id is null
or date_id is null
or salesperson_id is null
or quantity is null
or revenue is null
or cost is null
or discount is null
or sales_channel is null;

-- ==========================================
-- 4. Invalid Business Values
-- ==========================================

select
case
    when count(*) = 0 then 'PASS'
    else 'FAIL'
end as business_value_validation
from analytics.fact_sales
where
quantity <= 0
or revenue < 0
or cost < 0
or discount < 0;

-- ==========================================
-- 5. Business Rule Validation
-- ==========================================

select
case
    when count(*) = 0 then 'PASS'
    else 'FAIL'
end as business_rule_validation
from analytics.fact_sales
where
discount > revenue
or cost > revenue;

-- ==========================================
-- 6. Record Count Validation
-- ==========================================

select
case
    when
    (
        select count(*) from staging.stg_sales
    )
    =
    (
        select count(*) from analytics.fact_sales
    )
    then 'PASS'
    else 'FAIL'
end as record_count_validation;