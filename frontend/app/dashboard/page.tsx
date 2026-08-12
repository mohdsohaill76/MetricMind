"use client";

import { useEffect, useState } from "react";

import Navbar from "../../src/components/layout/Navbar";
import Sidebar from "../../src/components/layout/Sidebar";
import KPICard from "../../src/components/dashboard/KPICard";

import RevenueChart from "../../src/components/charts/RevenueChart";
import SalesChart from "../../src/components/charts/SalesChart";
import PerformanceChart from "../../src/components/charts/PerformanceChart";

import {
  FaDatabase,
  FaTable,
  FaUsers,
  FaChartLine,
} from "react-icons/fa6";

import AIInsights from "../../src/components/dashboard/AIInsights";
import RecentActivity from "../../src/components/dashboard/RecentActivity";
import FilterBar from "../../src/components/dashboard/FilterBar";

import { getDashboardSummary } from "../../src/lib/api";

interface DashboardData {
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
    useState<DashboardData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const data = await getDashboardSummary();

        setDashboardData(data);
      } catch (err) {
        console.error("Dashboard error:", err);

        // Backend returns 400 when no dataset has been uploaded.
        // We don't want the whole dashboard to fail.
        setDashboardData(null);
        setError("No dataset has been uploaded yet.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  return (
    <div className="flex min-h-screen bg-[var(--background)]">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Application Area */}
      <div className="min-w-0 flex-1">

        {/* Navbar */}
        <Navbar />

        {/* Dashboard Content */}
        <main className="min-h-screen bg-[var(--background)] px-4 py-6 sm:px-6 lg:px-8">

          {/* Dashboard Header */}
          <section className="mb-8">

            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

              <div>
                <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
                  Dashboard
                </h1>

                <p className="mt-2 text-sm text-[var(--foreground)] opacity-70 sm:text-base">
                  Welcome back! Here's your business overview.
                </p>
              </div>

              {/* Filter */}
              <div>
                <FilterBar />
              </div>

            </div>

          </section>

          {/* Loading State */}
          {loading && (
            <div className="mb-8 rounded-xl bg-[var(--card-background)] p-6 shadow-md">
              <p className="text-[var(--foreground)] opacity-80">
                Loading dashboard data...
              </p>
            </div>
          )}

          {/* No Dataset State */}
          {!loading && !dashboardData && (
            <div className="mb-8 rounded-xl border border-blue-200 bg-blue-50 p-6 shadow-sm">

              <div className="flex items-center gap-4">

                <div className="rounded-full bg-blue-100 p-3">
                  <FaDatabase className="text-2xl text-blue-600" />
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-[var(--foreground)]">
                    No Dataset Uploaded
                  </h2>

                  <p className="mt-1 text-[var(--foreground)] opacity-80">
                    Upload a dataset from the AI Generator page to populate
                    your dashboard with real data.
                  </p>
                </div>

              </div>

            </div>
          )}

          {/* Backend Dataset Summary */}
          {dashboardData && (
            <>
              {/* Dataset Overview */}
              <section className="mb-8">

                <div className="mb-5">
                  <h2 className="text-2xl font-bold text-[var(--foreground)]">
                    Dataset Overview
                  </h2>

                  <p className="mt-1 text-sm text-[var(--foreground)] opacity-70">
                    Live information retrieved from the MetricMind backend.
                  </p>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

                  <KPICard
                    title="Total Rows"
                    value={dashboardData.total_rows.toLocaleString()}
                    change="Records in dataset"
                    icon={
                      <FaDatabase className="text-blue-600" />
                    }
                  />

                  <KPICard
                    title="Total Columns"
                    value={dashboardData.total_columns.toString()}
                    change="Dataset fields"
                    icon={
                      <FaTable className="text-green-600" />
                    }
                  />

                  <KPICard
                    title="Numeric Columns"
                    value={dashboardData.numeric_columns_count.toString()}
                    change="Available for analysis"
                    icon={
                      <FaChartLine className="text-purple-600" />
                    }
                  />

                  <KPICard
                    title="Categorical Columns"
                    value={dashboardData.categorical_columns_count.toString()}
                    change="Available for analysis"
                    icon={
                      <FaUsers className="text-orange-500" />
                    }
                  />

                </div>

              </section>

              {/* Dataset Quality */}
              <section className="mb-8 rounded-2xl bg-[var(--card-background)] p-6 shadow-md">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  <div>
                    <h2 className="text-xl font-semibold text-[var(--foreground)]">
                      Dataset Quality
                    </h2>

                    <p className="mt-2 text-[var(--foreground)] opacity-80">
                      {dashboardData.dataset_quality}
                    </p>
                  </div>

                  <div className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                    {dashboardData.upload_status}
                  </div>

                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

                  <div className="rounded-xl bg-[var(--background)] p-4">
                    <p className="text-sm text-[var(--foreground)] opacity-70">
                      Missing Values
                    </p>

                    <p className="mt-1 text-2xl font-bold text-[var(--foreground)]">
                      {dashboardData.missing_values_total}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[var(--background)] p-4">
                    <p className="text-sm text-[var(--foreground)] opacity-70">
                      Duplicate Rows
                    </p>

                    <p className="mt-1 text-2xl font-bold text-[var(--foreground)]">
                      {dashboardData.duplicate_rows}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[var(--background)] p-4">
                    <p className="text-sm text-[var(--foreground)] opacity-70">
                      Available Charts
                    </p>

                    <p className="mt-1 text-2xl font-bold text-[var(--foreground)]">
                      {dashboardData.available_charts.length}
                    </p>
                  </div>

                </div>

              </section>

              {/* Available Charts */}
              <section className="mb-8 rounded-2xl bg-[var(--card-background)] p-6 shadow-md">

                <h2 className="text-xl font-semibold text-[var(--foreground)]">
                  Available Visualizations
                </h2>

                <div className="mt-4 flex flex-wrap gap-3">

                  {dashboardData.available_charts.map((chart) => (
                    <span
                      key={chart}
                      className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium capitalize text-blue-700"
                    >
                      {chart}
                    </span>
                  ))}

                </div>

              </section>
            </>
          )}

          {/* Existing Dashboard Charts */}
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