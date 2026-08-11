-- View 1 : Sales View

create or replace view analytics.vw_sales as

select
    fs.sale_id,
    dc.customer_name,
    dp.product_name,
    dr.region_name,
    ds.salesperson_name,
    dd.full_date,

    fs.quantity,
    fs.revenue,
    fs.cost,
    fs.discount,
    fs.sales_channel

from analytics.fact_sales fs

inner join analytics.dim_customer dc
on fs.customer_id = dc.customer_id

inner join analytics.dim_product dp
on fs.product_id = dp.product_id

inner join analytics.dim_region dr
on fs.region_id = dr.region_id

inner join analytics.dim_salesperson ds
on fs.salesperson_id = ds.salesperson_id

inner join analytics.dim_date dd
on fs.date_id = dd.date_id;


-- View 2 : Customer Sales

create or replace view analytics.vw_customer_sales as

select
    dc.customer_id,
    dc.customer_name,

    sum(fs.quantity) as total_quantity,
    sum(fs.revenue) as total_revenue,
    sum(fs.cost) as total_cost

from analytics.fact_sales fs

inner join analytics.dim_customer dc
on fs.customer_id = dc.customer_id

group by
    dc.customer_id,
    dc.customer_name;


-- View 3 : Product Sales

create or replace view analytics.vw_product_sales as

select
    dp.product_id,
    dp.product_name,
    dp.category,

    sum(fs.quantity) as total_quantity,
    sum(fs.revenue) as total_revenue

from analytics.fact_sales fs

inner join analytics.dim_product dp
on fs.product_id = dp.product_id

group by
    dp.product_id,
    dp.product_name,
    dp.category;


-- View 4 : Region Sales

create or replace view analytics.vw_region_sales as

select
    dr.region_id,
    dr.region_name,

    sum(fs.quantity) as total_quantity,
    sum(fs.revenue) as total_revenue

from analytics.fact_sales fs

inner join analytics.dim_region dr
on fs.region_id = dr.region_id

group by
    dr.region_id,
    dr.region_name;


-- View 5 : Monthly Sales

create or replace view analytics.vw_monthly_sales as

select
    dd.year,
    dd.month,
    dd.month_name,

    sum(fs.quantity) as total_quantity,
    sum(fs.revenue) as total_revenue

from analytics.fact_sales fs

inner join analytics.dim_date dd
on fs.date_id = dd.date_id

group by
    dd.year,
    dd.month,
    dd.month_name;