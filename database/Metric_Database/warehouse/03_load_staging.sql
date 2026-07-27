-- Load Customer Data

insert into staging.stg_customer
select *
from business.dim_customer;

-- Load Product Data

insert into staging.stg_product
select *
from business.dim_product;

-- Load Region Data

insert into staging.stg_region
select *
from business.dim_region;

-- Load Date Data

insert into staging.stg_date
select *
from business.dim_date;

-- Load Salesperson Data

insert into staging.stg_salesperson
select *
from business.dim_salesperson;

-- Load Sales Data

insert into staging.stg_sales
select *
from business.fact_sales;