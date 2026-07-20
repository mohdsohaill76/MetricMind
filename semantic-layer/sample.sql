CREATE TABLE orders (

order_id SERIAL PRIMARY KEY,

product VARCHAR(100),

region VARCHAR(50),

quantity INT,

price DECIMAL,

cost DECIMAL,

order_date DATE

);