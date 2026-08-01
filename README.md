# MetricMind

MetricMind is an AI-powered business analytics frontend application designed to help users upload datasets, visualize business data, generate AI-powered insights and reports, and interact with analytics through an intuitive dashboard.

This repository contains the **frontend application** of MetricMind.

The backend API is maintained separately and can be connected through the frontend API configuration.

---

## Features

- User registration and login
- Authentication using access tokens
- Dashboard with business and dataset overview
- KPI cards
- Revenue visualization
- Sales visualization
- Performance visualization
- AI-powered insights
- Analytics dashboard
- Dataset upload interface
- Chart generation
- AI report generation
- Reports management
- AI chat interface
- Profile management
- Settings
- Responsive UI
- Sidebar-based navigation

---

## Technology Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- React Icons
- ECharts / React chart components

### Backend Integration

The frontend communicates with the backend through REST API endpoints.

The backend is maintained separately from this repository.

The API base URL is configured using an environment variable.

---

## Project Structure

```text
MetricMind/
│
├── app/
│   ├── login/
│   │   └── page.tsx
│   │
│   ├── dashboard/
│   │   └── page.tsx
│   │
│   ├── analytics/
│   ├── ai-chat/
│   ├── ai-generator/
│   ├── reports/
│   ├── profile/
│   └── settings/
│
├── src/
│   ├── components/
│   │   ├── charts/
│   │   ├── dashboard/
│   │   └── layout/
│   │
│   └── lib/
│       └── api.ts
│
├── public/
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── next.config.ts
├── tsconfig.json
└── README.md