-- Load Customer Data

insert into analytics.dim_customer
select *
from staging.stg_customer;

-- Load Product Data

insert into analytics.dim_product
select *
from staging.stg_product;

-- Load Region Data

insert into analytics.dim_region
select *
from staging.stg_region;

-- Load Date Data

insert into analytics.dim_date
select *
from staging.stg_date;

-- Load Salesperson Data

insert into analytics.dim_salesperson
select *
from staging.stg_salesperson;

-- Load Sales Data

insert into analytics.fact_sales
select *
from staging.stg_sales;