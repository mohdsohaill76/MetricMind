"use client";

import { useEffect, useState } from "react";

import Navbar from "../../src/components/layout/Navbar";
import Sidebar from "../../src/components/layout/Sidebar";
import KPICard from "../../src/components/dashboard/KPICard";
import AnalyticsChart from "../../src/components/charts/AnalyticsChart";
import {
  FaDatabase,
  FaTable,
  FaChartLine,
  FaExclamation,
} from "react-icons/fa6";

import { getAnalyticsSummary } from "../../src/lib/api";

interface AnalyticsData {
  total_rows: number;
  total_columns: number;
  numeric_columns: string[];
  categorical_columns: string[];
  total_missing_values: number;
  duplicate_rows: number;
  memory_usage_bytes: number;
  dataset_quality: string;
  available_charts: string[];
  generated_at: string;
  dataset_insights: string[];
  numeric_analysis: Record<string, any>;
  categorical_analysis: Record<string, any>;
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] =
    useState<AnalyticsData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        setError("");

        const data = await getAnalyticsSummary();

        console.log("Analytics data:", data);

        setAnalyticsData(data);
      } catch (err) {
        console.error("Analytics error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load analytics."
        );
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="min-w-0 flex-1">

        {/* Navbar */}
        <Navbar />

        <main className="min-h-screen bg-slate-100 p-8">

          {/* Header */}
          <div className="mb-8">

            <h1 className="text-4xl font-bold text-slate-800">
              Analytics
            </h1>

            <p className="mt-2 text-slate-500">
              Analyze your uploaded dataset and discover valuable insights.
            </p>

          </div>

          {/* Loading */}
          {loading && (
            <div className="rounded-xl bg-white p-6 shadow-md">
              <p className="text-slate-600">
                Loading analytics...
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6">

              <div className="flex items-center gap-3">

                <FaExclamation className="text-xl text-red-600" />

                <div>
                  <h2 className="font-semibold text-red-700">
                    Unable to load analytics
                  </h2>

                  <p className="mt-1 text-red-600">
                    {error}
                  </p>
                </div>

              </div>

            </div>
          )}

          {/* Analytics Data */}
          {!loading && !error && analyticsData && (
            <>

              {/* KPI Cards */}
              <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

                <KPICard
                  title="Total Rows"
                  value={analyticsData.total_rows.toLocaleString()}
                  change="Records in dataset"
                  icon={
                    <FaDatabase className="text-blue-600" />
                  }
                />

                <KPICard
                  title="Total Columns"
                  value={analyticsData.total_columns.toString()}
                  change="Dataset fields"
                  icon={
                    <FaTable className="text-green-600" />
                  }
                />

                <KPICard
                  title="Numeric Columns"
                  value={analyticsData.numeric_columns.length.toString()}
                  change="Available for analysis"
                  icon={
                    <FaChartLine className="text-purple-600" />
                  }
                />

                <KPICard
                  title="Missing Values"
                  value={analyticsData.total_missing_values.toLocaleString()}
                  change={
                    analyticsData.total_missing_values === 0
                      ? "No missing values"
                      : "Requires review"
                  }
                  icon={
                    <FaExclamation className="text-orange-500" />
                  }
                />

              </section>


              {/* Dataset Quality */}
              <section className="mt-8 rounded-2xl bg-white p-6 shadow-md">

                <h2 className="text-2xl font-semibold text-slate-800">
                  Dataset Quality
                </h2>

                <p className="mt-3 text-slate-600">
                  {analyticsData.dataset_quality}
                </p>

                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">

                  <div className="rounded-xl bg-slate-50 p-5">

                    <p className="text-sm text-slate-500">
                      Duplicate Rows
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                      {analyticsData.duplicate_rows}
                    </p>

                  </div>

                  <div className="rounded-xl bg-slate-50 p-5">

                    <p className="text-sm text-slate-500">
                      Numeric Columns
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                      {analyticsData.numeric_columns.length}
                    </p>

                  </div>

                  <div className="rounded-xl bg-slate-50 p-5">

                    <p className="text-sm text-slate-500">
                      Categorical Columns
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                      {analyticsData.categorical_columns.length}
                    </p>

                  </div>

                </div>

              </section>


              {/* Available Columns */}
              <section className="mt-8 rounded-2xl bg-white p-6 shadow-md">

                <h2 className="text-2xl font-semibold">
                  Available Columns
                </h2>

                <div className="mt-5">

                  <h3 className="font-semibold text-purple-700">
                    Numeric Columns
                  </h3>

                  <div className="mt-3 flex flex-wrap gap-3">

                    {analyticsData.numeric_columns.map(
                      (column) => (
                        <span
                          key={column}
                          className="rounded-full bg-purple-100 px-4 py-2 text-sm text-purple-700"
                        >
                          {column}
                        </span>
                      )
                    )}

                  </div>

                </div>


                <div className="mt-6">

                  <h3 className="font-semibold text-blue-700">
                    Categorical Columns
                  </h3>

                  <div className="mt-3 flex flex-wrap gap-3">

                    {analyticsData.categorical_columns.map(
                      (column) => (
                        <span
                          key={column}
                          className="rounded-full bg-blue-100 px-4 py-2 text-sm text-blue-700"
                        >
                          {column}
                        </span>
                      )
                    )}

                  </div>

                </div>

              </section>

              {/* Analytics Charts */}
<section className="mt-8">

  <AnalyticsChart
    numericAnalysis={analyticsData.numeric_analysis}
    categoricalAnalysis={analyticsData.categorical_analysis}
  />

</section>


              {/* Dataset Insights */}
              <section className="mt-8 rounded-2xl bg-white p-6 shadow-md">

                <h2 className="text-2xl font-semibold">
                  Dataset Insights
                </h2>

                <div className="mt-5 space-y-4">

                  {analyticsData.dataset_insights.map(
                    (insight, index) => (

                      <div
                        key={index}
                        className="rounded-xl bg-slate-50 p-4"
                      >
                        <p className="text-slate-700">
                          {insight}
                        </p>
                      </div>

                    )
                  )}

                </div>

              </section>


              {/* Available Charts */}
              <section className="mt-8 rounded-2xl bg-white p-6 shadow-md">

                <h2 className="text-2xl font-semibold">
                  Available Visualizations
                </h2>

                <div className="mt-5 flex flex-wrap gap-3">

                  {analyticsData.available_charts.map(
                    (chart) => (

                      <span
                        key={chart}
                        className="rounded-full bg-green-100 px-4 py-2 text-sm font-medium capitalize text-green-700"
                      >
                        {chart}
                      </span>

                    )
                  )}

                </div>

              </section>

            </>
          )}

        </main>

      </div>

    </div>
  );
}