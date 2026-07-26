"use client";

import { useEffect, useState } from "react";

import Navbar from "../src/components/layout/Navbar";
import Sidebar from "../src/components/layout/Sidebar";
import KPICard from "../src/components/dashboard/KPICard";
import RevenueChart from "../src/components/charts/RevenueChart";
import AIInsights from "../src/components/dashboard/AIInsights";
import SalesChart from "../src/components/charts/SalesChart";
import PerformanceChart from "../src/components/charts/PerformanceChart";
import RecentActivity from "../src/components/dashboard/RecentActivity";
import FilterBar from "../src/components/dashboard/FilterBar";

import {
  FaDatabase,
  FaTableColumns,
  FaHashtag,
  FaTags,
} from "react-icons/fa6";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000/api/v1";

interface DashboardSummary {
  total_rows: number;
  total_columns: number;
  numeric_columns_count: number;
  categorical_columns_count: number;
  duplicate_rows: number;
  missing_values_total: number;
  memory_usage_bytes: number;
  dataset_quality: string;
  upload_status: string;
  available_charts: string[];
  generated_at: string;
}

export default function Home() {
  const [dashboardData, setDashboardData] =
    useState<DashboardSummary | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardSummary = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/dashboard/summary`
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch dashboard summary: ${response.status}`
          );
        }

        const data: DashboardSummary = await response.json();

        setDashboardData(data);
      } catch (error) {
        console.error(
          "Dashboard API Error:",
          error
        );

        setError(
          "Unable to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardSummary();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Application Area */}
      <div className="min-w-0 flex-1">

        {/* Navbar */}
        <Navbar />

        {/* Dashboard Content */}
        <main className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 lg:px-8">

          {/* Dashboard Header */}
          <section className="mb-8">

            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
                  Dashboard
                </h1>

                <p className="mt-2 text-sm text-slate-500 sm:text-base">
                  Welcome back! Here's your business overview.
                </p>
              </div>

              {/* Filter */}
              <div>
                <FilterBar />
              </div>

            </div>

          </section>

          {/* API Error */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* KPI Cards */}
          <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

            <KPICard
              title="Total Records"
              value={
                loading
                  ? "Loading..."
                  : dashboardData
                  ? dashboardData.total_rows.toLocaleString()
                  : "0"
              }
              change={
                dashboardData
                  ? dashboardData.upload_status
                  : "No dataset"
              }
              icon={
                <FaDatabase className="text-blue-600" />
              }
            />

            <KPICard
              title="Total Columns"
              value={
                loading
                  ? "Loading..."
                  : dashboardData
                  ? dashboardData.total_columns.toString()
                  : "0"
              }
              change={
                dashboardData
                  ? `${dashboardData.duplicate_rows} duplicate rows`
                  : "No data"
              }
              icon={
                <FaTableColumns className="text-green-600" />
              }
            />

            <KPICard
              title="Numeric Columns"
              value={
                loading
                  ? "Loading..."
                  : dashboardData
                  ? dashboardData.numeric_columns_count.toString()
                  : "0"
              }
              change={
                dashboardData
                  ? `${dashboardData.missing_values_total} missing values`
                  : "No data"
              }
              icon={
                <FaHashtag className="text-purple-600" />
              }
            />

            <KPICard
              title="Categorical Columns"
              value={
                loading
                  ? "Loading..."
                  : dashboardData
                  ? dashboardData.categorical_columns_count.toString()
                  : "0"
              }
              change={
                dashboardData
                  ? dashboardData.dataset_quality
                  : "No data"
              }
              icon={
                <FaTags className="text-orange-500" />
              }
            />

          </section>

          {/* Revenue + AI Insights */}
          <section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">

            {/* Revenue Chart */}
            <div className="min-w-0 xl:col-span-2">
              <RevenueChart />
            </div>

            {/* AI Insights */}
            <div className="min-w-0">
              <AIInsights />
            </div>

          </section>

          {/* Sales + Performance */}
          <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">

            <div className="min-w-0">
              <SalesChart />
            </div>

            <div className="min-w-0">
              <PerformanceChart />
            </div>

          </section>

          {/* Recent Activity */}
          <section className="mt-6">

            <RecentActivity />

          </section>

        </main>

      </div>

    </div>
  );
}