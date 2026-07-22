-- ==========================================
-- BUSINESS TEST QUERIES
-- ==========================================

-- 1. Total Revenue
select
    sum(revenue) as total_revenue
from business.fact_sales;

-- 2. Total Sales Quantity

select
    sum(quantity) as total_quantity
from business.fact_sales;

-- 3. Total Profit

select
    sum(revenue - cost) as total_profit
from business.fact_sales;

-- 4. Total Number of Orders 

select
    count(*) as total_orders
from business.fact_sales;

-- 5. Average Discount 

select
    avg(discount) as average_discount
from business.fact_sales;

-- 6. Top Revenue Products

select
    dp.product_name,
    sum(fs.revenue) as total_revenue
from business.fact_sales as fs

inner join business.dim_product as dp
on fs.product_id = dp.product_id

group by
    dp.product_name
order by total_revenue desc;

-- 7. Category Performance

select
    dp.category,
    sum(fs.revenue) as total_revenue
from business.fact_sales as fs

inner join business.dim_product as dp
on fs.product_id = dp.product_id

group by
    dp.category
order by total_revenue desc;

-- 8. Top Customers

select
    dc.customer_name,
    sum(fs.revenue) as total_revenue
from business.fact_sales as fs

inner join business.dim_customer as dc
on fs.customer_id = dc.customer_id

group by
    dc.customer_name
order by total_revenue desc;

-- 9. Customer Type Performance

select
    dc.customer_type,
    sum(fs.revenue) as total_revenue
from business.fact_sales as fs

inner join business.dim_customer as dc
on fs.customer_id = dc.customer_id

group by
    dc.customer_type;

-- 10. Revenue by Region

select
    dr.region_name,
    sum(fs.revenue) as total_revenue
from business.fact_sales as fs

inner join business.dim_region as dr
on fs.region_id = dr.region_id

group by
    dr.region_name
order by total_revenue desc;

-- 11. Revenue by Month

select
    dd.month_name,
    sum(fs.revenue) as total_revenue
from business.fact_sales as fs

inner join business.dim_date as dd
on fs.date_id = dd.date_id

group by
    dd.month,
    dd.month_name
order by
    dd.month;

-- 12. Revenue by Quarter

select
    dd.quarter,
    sum(fs.revenue) as total_revenue
from business.fact_sales as fs

inner join business.dim_date as dd
on fs.date_id = dd.date_id

group by
    dd.quarter
order by
    dd.quarter;

-- 13. Revenue by Year

select
    dd.year,
    sum(fs.revenue) as total_revenue
from business.fact_sales as fs

inner join business.dim_date as dd
on fs.date_id = dd.date_id

group by
    dd.year;

-- 14. Salesperson Performance

select
    ds.salesperson_name,
    sum(fs.revenue) as total_revenue
from business.fact_sales as fs

inner join business.dim_salesperson as ds
on fs.salesperson_id = ds.salesperson_id

group by
    ds.salesperson_name
order by total_revenue desc;

-- 15. Profit by Region

select
    dr.region_name,
    sum(fs.revenue - fs.cost) as total_profit
from business.fact_sales as fs

inner join business.dim_region as dr
on fs.region_id = dr.region_id

group by
    dr.region_name;

-- 16. Margin by Region

select
    dr.region_name,

    round(
        (sum(fs.revenue - fs.cost) * 100.0) /
        sum(fs.revenue),
        2
    ) as margin_percentage

from business.fact_sales as fs

inner join business.dim_region as dr
on fs.region_id = dr.region_id

group by
    dr.region_name;

-- 17. Product Profitability

select
    dp.product_name,
    sum(fs.revenue - fs.cost) as total_profit
from business.fact_sales as fs

inner join business.dim_product as dp
on fs.product_id = dp.product_id

group by
    dp.product_name
order by total_profit desc;

-- 18. Best Sales Channel

select
    sales_channel,
    sum(revenue) as total_revenue
from business.fact_sales

group by
    sales_channel
order by total_revenue desc;

-- 19. Lowest Performing Products

select
    dp.product_name,
    sum(fs.revenue) as total_revenue
from business.fact_sales fs

inner join business.dim_product dp
on fs.product_id = dp.product_id

group by
    dp.product_name
order by total_revenue asc;

-- 20. Underperforming Regions

select
    dr.region_name,
    sum(fs.revenue) as total_revenue
from business.fact_sales as fs

inner join business.dim_region as dr
on fs.region_id = dr.region_id

group by
    dr.region_name
order by total_revenue asc;
