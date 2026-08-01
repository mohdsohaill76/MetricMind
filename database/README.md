# MetricMind

## Project
**MetricMind – Agentic Semantic BI Engine**

## Role
**Database & Data Warehouse Engineer**

## Technologies
- PostgreSQL 17
- pgAdmin
- SQL
- VS Code
- Git

---

## Database Setup

### Database Initialization

1. Execute `01_database.sql`.
2. Execute the remaining database scripts in the specified order.

> **Note:** Run `01_database.sql` only once.

---

## Database Script Execution Order

1. 01_database.sql
2. 02_schema.sql
3. 03_tables.sql
4. 04_constraints.sql
5. 05_insert_data.sql
6. 06_views.sql
7. 07_test_queries.sql

---

## Data Warehouse Script Execution Order

After completing the database setup, execute the warehouse scripts in the following order:

1. 01_staging_tables.sql
2. 02_warehouse_tables.sql
3. 03_load_staging.sql
4. 04_load_warehouse.sql
5. 05_reporting_views.sql
6. 06_test_queries.sql
7. 07_validation_queries.sql

---

## Warehouse / ETL Flow

```text
Business Tables
      ↓
Staging Tables
      ↓
Warehouse Tables
      ↓
Reporting Views
      ↓
Analytics & Reporting
```

### ETL Process

- Business tables store the source data.
- Data is loaded into the staging tables.
- Staging data is transformed and loaded into the warehouse tables.
- Reporting views are created for analytics and reporting.
- Test and validation queries verify the ETL process.

---

## Running Test Queries

Execute the following scripts after completing the database and warehouse setup:

- Database Test Queries (`07_test_queries.sql`)
- Warehouse Test Queries (`06_test_queries.sql`)
- Data Validation Queries (`07_validation_queries.sql`)
