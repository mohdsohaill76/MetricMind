-- ==========================================
-- CHECK CONSTRAINTS
-- ==========================================

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

-- ==========================================
-- FOREIGN KEY INDEXES
-- ==========================================

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

-- ==========================================
-- NOT NULL Constraints
-- ==========================================

-- Customer Table

alter table business.dim_customer
alter column customer_name set not null;

alter table business.dim_customer
alter column email set not null;

alter table business.dim_customer
alter column city set not null;

alter table business.dim_customer
alter column country set not null;

alter table business.dim_customer
alter column customer_type set not null;

-- Product Table

alter table business.dim_product
alter column category set not null;

alter table business.dim_product
alter column sub_category set not null;

alter table business.dim_product
alter column brand set not null;

alter table business.dim_product
alter column unit_price set not null;

alter table business.dim_product
alter column cost_price set not null;

alter table business.dim_product
alter column status set not null;

-- Region Table

alter table business.dim_region
alter column region_name set not null;

alter table business.dim_region
alter column country set not null;

alter table business.dim_region
alter column state set not null;

alter table business.dim_region
alter column city set not null;

-- Date Table

alter table business.dim_date
alter column day set not null;

alter table business.dim_date
alter column month set not null;

alter table business.dim_date
alter column month_name set not null;

alter table business.dim_date
alter column quarter set not null;

alter table business.dim_date
alter column year set not null;

alter table business.dim_date
alter column week set not null;

-- Salesperson Table

alter table business.dim_salesperson
alter column salesperson_name set not null;

alter table business.dim_salesperson
alter column department set not null;

alter table business.dim_salesperson
alter column designation set not null;

alter table business.dim_salesperson
alter column region set not null;

alter table business.dim_salesperson
alter column email set not null;

-- Sales Fact Table

alter table business.fact_sales
alter column customer_id set not null;

alter table business.fact_sales
alter column product_id set not null;

alter table business.fact_sales
alter column region_id set not null;

alter table business.fact_sales
alter column date_id set not null;

alter table business.fact_sales
alter column salesperson_id set not null;

alter table business.fact_sales
alter column quantity set not null;

alter table business.fact_sales
alter column revenue set not null;

alter table business.fact_sales
alter column cost set not null;

alter table business.fact_sales
alter column discount set not null;

alter table business.fact_sales
alter column sales_channel set not null;

-- ==========================================
-- UNIQUE CONSTRAINTS
-- ==========================================

-- Customer Table

alter table business.dim_customer
add constraint uq_customer_email
unique (email);

-- Salesperson Table

alter table business.dim_salesperson
add constraint uq_salesperson_email
unique (email);

-- ==========================================
-- BUSINESS RULE CONSTRAINTS
-- ==========================================

alter table business.fact_sales
add constraint chk_discount_less_than_revenue
check (discount <= revenue);

alter table business.fact_sales
add constraint chk_cost_less_than_revenue
check (cost <= revenue);

-- ==========================================
-- ANALYTICS FACT SALES INDEXES
-- ==========================================

create index if not exists idx_analytics_fact_sales_customer
on analytics.fact_sales(customer_id);

create index if not exists idx_analytics_fact_sales_product
on analytics.fact_sales(product_id);

create index if not exists idx_analytics_fact_sales_region
on analytics.fact_sales(region_id);

create index if not exists idx_analytics_fact_sales_date
on analytics.fact_sales(date_id);

create index if not exists idx_analytics_fact_sales_salesperson
on analytics.fact_sales(salesperson_id);