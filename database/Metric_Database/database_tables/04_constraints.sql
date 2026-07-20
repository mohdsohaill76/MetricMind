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