# MetricMind — Intelligent AI Business Analytics & Semantic Intelligence Platform

[![FastAPI](https://img.shields.io/badge/FastAPI-0.139-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-16.2-000000?style=flat-square&logo=next.js)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![LangChain](https://img.shields.io/badge/LangChain-Core-1C3C3C?style=flat-square)](https://www.langchain.com/)
[![Groq AI](https://img.shields.io/badge/Groq-LLM_Inference-f34f29?style=flat-square)](https://groq.com/)
[![Tests](https://img.shields.io/badge/Pytest-114_Passed-success?style=flat-square&logo=pytest)](https://pytest.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.style=flat-square)](LICENSE)

**MetricMind** is a production-quality, end-to-end AI-powered business analytics platform designed to transform raw tabular data into executive insights, dynamic visual charts, and grounded natural language metrics via a structured **Semantic Layer**.

---

## 🚀 Live Production Links

- 🌐 **Web Application**: [https://metricmind-2.onrender.com](https://metricmind-2.onrender.com)
- ⚡ **Interactive Swagger API Docs**: [https://metricmind-e7fn.onrender.com/docs](https://metricmind-e7fn.onrender.com/docs)
- 🟢 **API Health Endpoint**: [https://metricmind-e7fn.onrender.com/api/v1/health](https://metricmind-e7fn.onrender.com/api/v1/health)

---

## ✨ Key Features

1. **Grounded AI Data Chat**: Interact with business datasets in plain English. The backend grounds questions using defined semantic metrics (dimensions, measures, joins) and dynamic data profiling before invoking the Groq LLM API.
2. **Dynamic Dataset Profiling & Upload**: Instant CSV ingestion with automatic column type inference, missing value detection, memory footprint calculation, and summary statistics.
3. **Executive AI Report Generation**: Generate structured business reports with key insights and data-backed recommendations using LangChain structured outputs.
4. **Interactive Data Visualizations**: Dynamic ECharts rendering for sales, revenue, category performance, and custom column comparisons.
5. **Secure Authentication & User Management**: JWT bearer token authentication, bcrypt password hashing, and user profile management.
6. **Robust Persistence & Migration**: Production PostgreSQL integration via SQLAlchemy ORM with transactional DDL migrations using Alembic.

---

## 🏗️ Architecture Overview

```
                          ┌────────────────────────┐
                          │   Next.js 16 Client    │
                          │ (Render / Vercel Web)  │
                          └───────────┬────────────┘
                                      │  REST API / JWT
                                      ▼
                          ┌────────────────────────┐
                          │   FastAPI Backend      │
                          │   (Render ASGI)        │
                          └─────┬────────────┬─────┘
                                │            │
            ┌───────────────────┘            └───────────────────┐
            ▼                                                    ▼
┌────────────────────────┐                              ┌──────────────────┐
│ PostgreSQL Database    │                              │ Groq LLM & AI    │
│ (Reports Persistence & │                              │ (LangChain Core) │
│ Transactional Tables)  │                              └──────────────────┘
└────────────────────────┘
```

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, Next Themes (Dark/Light mode)
- **Data Visualization**: Apache ECharts (`echarts`, `echarts-for-react`)

### **Backend**
- **Framework**: FastAPI (ASGI)
- **Language**: Python 3.11
- **ORM & Database**: SQLAlchemy 2.0, PostgreSQL, Alembic
- **AI & Analytics**: LangChain, Groq LLM (`langchain-groq`), Pandas, Matplotlib

---

## 🧪 Testing & Code Quality

The backend includes a comprehensive pytest suite covering API validation, authentication, dataset profiling, AI report building, and database repository isolation.

```bash
cd backend
python -m pytest
```

```text
================= 114 passed, 1 warning in 186.59s (100% Success) =================
```

---

## ⚙️ Local Development Setup

### **Prerequisites**
- Python 3.11+
- Node.js 20+
- PostgreSQL (optional for local fallback tests)

### **1. Backend Setup**
```bash
# Clone the repository
git clone https://github.com/mohdsohaill76/MetricMind.git
cd MetricMind/backend

# Install dependencies
pip install -r requirements.txt

# Environment Setup
cp .env.example .env
# Fill in JWT_SECRET_KEY, GROQ_API_KEY, and DATABASE_URL in .env

# Run Alembic Database Migrations
alembic upgrade head

# Start FastAPI Uvicorn Server
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### **2. Frontend Setup**
```bash
cd ../frontend

# Install dependencies
npm install

# Environment Setup
cp .env.example .env.local
# NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api/v1

# Run Next.js Development Server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👤 Author

**Mohammad Sohail**  
*B.Tech Computer Science & Engineering (Data Science)*  
- **GitHub**: [@mohdsohaill76](https://github.com/mohdsohaill76)
- **Role**: Full-Stack Engineer + Project Lead
