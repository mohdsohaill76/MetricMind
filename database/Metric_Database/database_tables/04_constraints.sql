-- customer table

alter table business.dim_customer
add check (customer_type in ('Retail','Corporate'));

-- product table

alter table business.dim_product
add check (unit_price >= 0);

alter table business.dim_product
add check (cost_price >= 0);

-- sales table

alter table business.fact_sales
add check (quantity > 0);

alter table business.fact_sales
add check (revenue >= 0);

alter table business.fact_sales
add check (cost >= 0);

alter table business.fact_sales
add check (discount >= 0);

alter table business.fact_sales
add check (sales_channel in ('Online','Offline'));

-- Indexes on Foreign Keys

create index idx_fact_sales_customer
on business.fact_sales(customer_id);

create index idx_fact_sales_product
on business.fact_sales(product_id);

create index idx_fact_sales_region
on business.fact_sales(region_id);

create index idx_fact_sales_date
on business.fact_sales(date_id);

create index idx_fact_sales_salesperson
on business.fact_sales(salesperson_id);