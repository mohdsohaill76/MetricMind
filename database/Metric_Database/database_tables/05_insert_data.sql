-- insert 50 customer records
insert into business.dim_customer
(customer_id, customer_name, email, phone, city, country, customer_type)

select
    id,

    case id
        when 1 then 'Aarav Sharma' when 2 then 'Priya Verma' when 3 then 'Rahul Singh'
        when 4 then 'Sneha Gupta' when 5 then 'Aditya Kumar' when 6 then 'Ananya Sharma'
        when 7 then 'Rohan Mehta' when 8 then 'Neha Singh' when 9 then 'Vikas Yadav'
        when 10 then 'Kavya Patel' when 11 then 'Arjun Malhotra' when 12 then 'Simran Kaur'
        when 13 then 'Manish Tiwari' when 14 then 'Pooja Mishra' when 15 then 'Karan Joshi'
        when 16 then 'Ishita Roy' when 17 then 'Siddharth Jain' when 18 then 'Meera Nair'
        when 19 then 'Harsh Singh' when 20 then 'Divya Agarwal' when 21 then 'Mohit Sharma'
        when 22 then 'Riya Kapoor' when 23 then 'Nitin Verma' when 24 then 'Aditi Gupta'
        when 25 then 'Yash Raj' when 26 then 'Tanvi Sharma' when 27 then 'Abhishek Singh'
        when 28 then 'Komal Gupta' when 29 then 'Varun Jain' when 30 then 'Nisha Sharma'
        when 31 then 'Aman Khan' when 32 then 'Sakshi Verma' when 33 then 'Deepak Kumar'
        when 34 then 'Muskan Gupta' when 35 then 'Rajesh Yadav' when 36 then 'Priyanshu Singh'
        when 37 then 'Shreya Kapoor' when 38 then 'Ankit Sharma' when 39 then 'Ritu Singh'
        when 40 then 'Gaurav Mehta' when 41 then 'Rahul Gupta' when 42 then 'Neha Kapoor'
        when 43 then 'Vivek Sharma' when 44 then 'Preeti Singh' when 45 then 'Rakesh Kumar'
        when 46 then 'Alok Verma' when 47 then 'Pallavi Sharma' when 48 then 'Saurabh Jain'
        when 49 then 'Kriti Agarwal' when 50 then 'Varsha Singh'
    end,

    case
    when id < 10 then '637654320' || id
    else '63765432' || id
    end,

    case
        when id % 8 = 0 then 'Delhi' when id % 8 = 1 then 'Noida' when id % 8 = 2 then 'Mumbai'
        when id % 8 = 3 then 'Gurgaon' when id % 8 = 4 then 'Bengaluru' when id % 8 = 5 then 'Hyderabad'
        when id % 8 = 6 then 'Goa' when id % 8 = 7 then 'Pune'
        else 'Jaipur'
    end,

    'India',

    case
        when id % 2 = 0 then 'Corporate'
        else 'Retail'
    end

from generate_series(1,50) as id;

-- insert 50 product records
insert into business.dim_product
(product_id, product_name, category, sub_category, brand, unit_price, cost_price, status)

select
    id,

    case id
        when 1 then 'Laptop' when 2 then 'Mobile' when 3 then 'Tablet'
        when 4 then 'Keyboard' when 5 then 'Mouse' when 6 then 'Monitor'
        when 7 then 'Printer' when 8 then 'Headphone' when 9 then 'Camera'
        else 'Smart Watch'
    end,

    case
        when id % 3 = 0 then 'Electronics'
        when id % 3 = 1 then 'Computer'
        else 'Accessories'
    end,

    case
        when id % 2 = 0 then 'Hardware'
        else 'Software'
    end,

    case
        when id % 2 = 0 then 'HP'
        else 'Dell'
    end,

    (random()*50000+1000)::numeric(10,2),
    (random()*30000+500)::numeric(10,2),

    'Active'

from generate_series(1,50) as id;

-- insert region master records
insert into business.dim_region
(region_id, region_name, country, state, city)

select
    id,

    case id
        when 1 then 'North' when 2 then 'South'
        when 3 then 'East'
        else 'West'
    end,

    'India',

    case id
        when 1 then 'Uttar Pradesh' when 2 then 'Maharashtra'
        when 3 then 'Karnataka'
        else 'Rajasthan'
    end,

    case id
        when 1 then 'Delhi' when 2 then 'Mumbai'
        when 3 then 'Bengaluru'
        else 'Jaipur'
    end

from generate_series(1,4) as id;

insert 10 salesperson records

insert into business.dim_salesperson
(salesperson_id, salesperson_name, department, designation, region, email)

select
    id,

    case id
        when 1 then 'Rahul Sharma' when 2 then 'Amit Singh' when 3 then 'Neha Gupta'
        when 4 then 'Pooja Verma' when 5 then 'Rohit Kumar' when 6 then 'Vikas Yadav'
        when 7 then 'Simran Kaur' when 8 then 'Ankit Jain' when 9 then 'Priya Mehta'
        else 'Arjun Kapoor'
    end,

    case
        when id % 2 = 0 then 'Sales'
        else 'Marketing'
    end,

    case
        when id % 3 = 0 then 'Manager'
        when id % 3 = 1 then 'Executive'
        else 'Associate'
    end,

    case
        when id % 5 = 0 then 'North' when id % 5 = 1 then 'South'
        when id % 5 = 2 then 'East' when id % 5 = 3 then 'West'
        else 'Central'
    end,

 'sales' || id || '@gmail.com'

from generate_series(1,10) as id;

-- insert date dimension records
insert into business.dim_date
(date_id, full_date, day, month, month_name, quarter, year, week)

select
    id,
    current_date - id,
    extract(day from current_date - id)::int,
    extract(month from current_date - id)::int,
    'month',
    extract(quarter from current_date - id)::int,
    extract(year from current_date - id)::int,
    extract(week from current_date - id)::int

from generate_series(1,100) as id;

-- update customer email records

update business.dim_customer
set email = lower(replace(customer_name,' ','') || '@gmail.com');

update salesperson email records

update business.dim_salesperson
set email = lower(replace(salesperson_name,' ','') || '@gmail.com');

update month name records

update business.dim_date
set month_name = to_char(full_date, 'FMMonth');

update brand according to product

update product complete details

update business.dim_product
set
product_name = case product_id
    when 1 then 'Laptop' when 2 then 'Mobile' when 3 then 'Tablet'
    when 4 then 'Keyboard' when 5 then 'Mouse' when 6 then 'Monitor'
    when 7 then 'Printer' when 8 then 'Headphone' when 9 then 'Camera'
    when 10 then 'Smart Watch' when 11 then 'Desktop' when 12 then 'SSD'
    when 13 then 'Hard Disk' when 14 then 'Speaker' when 15 then 'Charger'
    when 16 then 'Power Bank' when 17 then 'Router' when 18 then 'Webcam'
    when 19 then 'USB Cable' when 20 then 'Pen Drive' when 21 then 'RAM'
    when 22 then 'Graphics Card' when 23 then 'Processor' when 24 then 'Motherboard'
    when 25 then 'Scanner' when 26 then 'Projector' when 27 then 'Earbuds'
    when 28 then 'Smart TV' when 29 then 'Gaming Mouse' when 30 then 'Gaming Keyboard'
    when 31 then 'Laptop Stand' when 32 then 'Microphone' when 33 then 'Phone Case'
    when 34 then 'Bluetooth Speaker' when 35 then 'Fitness Band' when 36 then 'VR Headset'
    when 37 then 'Action Camera' when 38 then 'Drone Camera' when 39 then 'Smart Glasses'
    when 40 then 'Keyboard Cover' when 41 then 'Monitor Stand' when 42 then 'Cooling Fan'
    when 43 then 'Network Switch' when 44 then 'Cable Adapter' when 45 then 'Wireless Mouse'
    when 46 then 'Mechanical Keyboard' when 47 then 'External SSD' when 48 then 'Tablet Cover'
    when 49 then 'Phone Charger' when 50 then 'Smart Home Device'
end,

category = case
    when product_id in (1,6,7,11,23,24) then 'Computer'
    when product_id in (2,3,9,10,28,35,36,37,38,39,50) then 'Electronics'
    else 'Accessories'
end,
sub_category = case product_id
    when 1 then 'Laptop' when 2 then 'Mobile' when 3 then 'Tablet'
    when 4 then 'Keyboard' when 5 then 'Mouse' when 6 then 'Monitor'
    when 7 then 'Printer' when 8 then 'Headphone' when 9 then 'Camera'
    when 10 then 'Smart Watch' when 11 then 'Desktop' when 12 then 'Storage'
    when 13 then 'Storage' when 14 then 'Audio' when 15 then 'Power'
    when 16 then 'Power' when 17 then 'Networking' when 18 then 'Camera'
    when 19 then 'Cable' when 20 then 'Storage' when 21 then 'Memory'
    when 22 then 'Graphics' when 23 then 'Processor' when 24 then 'Motherboard'
    when 25 then 'Scanner' when 26 then 'Projector' when 27 then 'Audio'
    when 28 then 'Television' when 29 then 'Gaming' when 30 then 'Gaming'
    when 31 then 'Laptop Accessories' when 32 then 'Audio' when 33 then 'Mobile Accessories'
    when 34 then 'Audio' when 35 then 'Wearable' when 36 then 'Virtual Reality'
    when 37 then 'Camera' when 38 then 'Camera' when 39 then 'Wearable'
    when 40 then 'Keyboard Accessories' when 41 then 'Monitor Accessories' when 42 then 'Cooling'
    when 43 then 'Networking' when 44 then 'Cable' when 45 then 'Mouse'
    when 46 then 'Keyboard' when 47 then 'Storage' when 48 then 'Tablet Accessories'
    when 49 then 'Mobile Accessories' when 50 then 'Smart Device'

end,

brand = case product_id
    when 1 then 'Dell' when 2 then 'Samsung' when 3 then 'Apple'
    when 4 then 'Logitech' when 5 then 'Logitech' when 6 then 'LG'
    when 7 then 'HP' when 8 then 'Sony' when 9 then 'Canon'
    when 10 then 'Apple' when 11 then 'HP' when 12 then 'Samsung'
    when 13 then 'Seagate' when 14 then 'JBL' when 15 then 'Anker'
    when 16 then 'Ambrane' when 17 then 'TP-Link' when 18 then 'Logitech'
    when 20 then 'SanDisk' when 21 then 'Corsair' when 22 then 'NVIDIA'
    when 23 then 'Intel' when 24 then 'ASUS' when 26 then 'Epson'
    when 27 then 'Boat' when 28 then 'Sony' when 29 then 'Razer'
    when 30 then 'Corsair' when 35 then 'Fitbit' when 37 then 'GoPro'
    when 38 then 'DJI' when 43 then 'Cisco'
    else 'Other'
end;

--insert 100 sales records

insert into business.fact_sales
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

    id,

    (id % 50) + 1,
    (id % 50) + 1,
    (id % 4) + 1,
    (id % 100) + 1,
    (id % 10) + 1,
    (id % 5) + 1,
    ((id % 20) + 1) * 5000,
    ((id % 15) + 1) * 3000,
    ((id % 5) + 1) * 100,

    case
        when id % 2 = 0 then 'Online'
        else 'Offline'
    end

from generate_series(1,100) as id;

update business.fact_sales
set cost = revenue * 0.60;