insert into staging.stg_customer
select *
from business.dim_customer;

insert into staging.stg_product
select *
from business.dim_product;

insert into staging.stg_region
select *
from business.dim_region;

insert into staging.stg_date
select *
from business.dim_date;

insert into staging.stg_salesperson
select *
from business.dim_salesperson;

insert into staging.stg_sales
select *
from business.fact_sales;