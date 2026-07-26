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
  FaTableColumns,
  FaTriangleExclamation,
  FaCopy,
} from "react-icons/fa6";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000/api/v1";

interface NumericColumnAnalytics {
  count: number;
  mean: number;
  median: number;
  standard_deviation: number;
  minimum: number;
  maximum: number;
  first_quartile: number;
  third_quartile: number;
}

interface CategoricalColumnAnalytics {
  unique_values: number;
  most_frequent_value: string | number | null;
  frequency: number;
}

interface AnalyticsSummary {
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
  numeric_analysis: Record<
    string,
    NumericColumnAnalytics
  >;
  categorical_analysis: Record<
    string,
    CategoricalColumnAnalytics
  >;
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] =
    useState<AnalyticsSummary | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalyticsSummary = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/analytics/summary`
        );

        if (!response.ok) {
          throw new Error(
            `Analytics API failed: ${response.status}`
          );
        }

        const data: AnalyticsSummary =
          await response.json();

        setAnalyticsData(data);

      } catch (error) {
        console.error(
          "Analytics API Error:",
          error
        );

        setError(
          "Unable to load analytics data. Please upload a dataset first."
        );

      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsSummary();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* Sidebar */}
      <Sidebar />

      <div className="min-w-0 flex-1">

        {/* Navbar */}
        <Navbar />

        <main className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 lg:px-8">

          {/* Page Header */}
          <div className="mb-8">

            <h1 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
              Analytics
            </h1>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Analyze your uploaded dataset and discover valuable insights.
            </p>

          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Analytics Summary Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

            <KPICard
              title="Total Records"
              value={
                loading
                  ? "Loading..."
                  : analyticsData
                  ? analyticsData.total_rows.toLocaleString()
                  : "0"
              }
              change="Dataset records"
              icon={
                <FaDatabase className="text-blue-600" />
              }
            />

            <KPICard
              title="Total Columns"
              value={
                loading
                  ? "Loading..."
                  : analyticsData
                  ? analyticsData.total_columns.toString()
                  : "0"
              }
              change={
                analyticsData
                  ? `${analyticsData.numeric_columns.length} numeric`
                  : "No data"
              }
              icon={
                <FaTableColumns className="text-green-600" />
              }
            />

            <KPICard
              title="Missing Values"
              value={
                loading
                  ? "Loading..."
                  : analyticsData
                  ? analyticsData.total_missing_values.toString()
                  : "0"
              }
              change="Data quality check"
              icon={
                <FaTriangleExclamation className="text-orange-500" />
              }
            />

            <KPICard
              title="Duplicate Rows"
              value={
                loading
                  ? "Loading..."
                  : analyticsData
                  ? analyticsData.duplicate_rows.toString()
                  : "0"
              }
              change="Duplicate records"
              icon={
                <FaCopy className="text-purple-600" />
              }
            />

          </div>

          {/* Dataset Quality */}
          {analyticsData && (
            <div className="mt-8 rounded-2xl bg-white p-6 shadow-md">

              <h2 className="text-2xl font-semibold text-slate-800">
                Dataset Quality
              </h2>

              <p className="mt-3 text-slate-600">
                {analyticsData.dataset_quality}
              </p>

              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">
                    Numeric Columns
                  </p>

                  <p className="mt-1 text-lg font-semibold text-slate-800">
                    {analyticsData.numeric_columns.length}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">
                    Categorical Columns
                  </p>

                  <p className="mt-1 text-lg font-semibold text-slate-800">
                    {analyticsData.categorical_columns.length}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">
                    Memory Usage
                  </p>

                  <p className="mt-1 text-lg font-semibold text-slate-800">
                    {(
                      analyticsData.memory_usage_bytes /
                      1024
                    ).toFixed(2)} KB
                  </p>
                </div>

              </div>

            </div>
          )}

          {/* Revenue Analytics */}
          <div className="mt-8">

            <RevenueChart />

          </div>

          {/* Sales & Performance Analytics */}
          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">

            <SalesChart />

            <PerformanceChart />

          </div>

          {/* Numeric Analysis */}
          {analyticsData &&
            Object.keys(
              analyticsData.numeric_analysis
            ).length > 0 && (

              <div className="mt-6 rounded-2xl bg-white p-6 shadow-md">

                <h2 className="text-2xl font-semibold text-slate-800">
                  Numeric Column Analysis
                </h2>

                <div className="mt-6 overflow-x-auto">

                  <table className="w-full min-w-[800px] text-left">

                    <thead>
                      <tr className="border-b border-slate-200 text-sm text-slate-500">

                        <th className="px-4 py-3">
                          Column
                        </th>

                        <th className="px-4 py-3">
                          Mean
                        </th>

                        <th className="px-4 py-3">
                          Median
                        </th>

                        <th className="px-4 py-3">
                          Minimum
                        </th>

                        <th className="px-4 py-3">
                          Maximum
                        </th>

                        <th className="px-4 py-3">
                          Standard Deviation
                        </th>

                      </tr>
                    </thead>

                    <tbody>

                      {Object.entries(
                        analyticsData.numeric_analysis
                      ).map(
                        ([column, analysis]) => (

                          <tr
                            key={column}
                            className="border-b border-slate-100"
                          >

                            <td className="px-4 py-4 font-semibold text-slate-800">
                              {column}
                            </td>

                            <td className="px-4 py-4 text-slate-600">
                              {analysis.mean.toFixed(2)}
                            </td>

                            <td className="px-4 py-4 text-slate-600">
                              {analysis.median.toFixed(2)}
                            </td>

                            <td className="px-4 py-4 text-slate-600">
                              {analysis.minimum.toFixed(2)}
                            </td>

                            <td className="px-4 py-4 text-slate-600">
                              {analysis.maximum.toFixed(2)}
                            </td>

                            <td className="px-4 py-4 text-slate-600">
                              {analysis.standard_deviation.toFixed(2)}
                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                </div>

              </div>

            )}

          {/* Categorical Analysis */}
          {analyticsData &&
            Object.keys(
              analyticsData.categorical_analysis
            ).length > 0 && (

              <div className="mt-6 rounded-2xl bg-white p-6 shadow-md">

                <h2 className="text-2xl font-semibold text-slate-800">
                  Categorical Column Analysis
                </h2>

                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">

                  {Object.entries(
                    analyticsData.categorical_analysis
                  ).map(
                    ([column, analysis]) => (

                      <div
                        key={column}
                        className="rounded-xl border border-slate-200 p-5"
                      >

                        <h3 className="font-semibold text-slate-800">
                          {column}
                        </h3>

                        <div className="mt-4 space-y-2 text-sm">

                          <p className="text-slate-500">
                            Unique Values:{" "}
                            <span className="font-semibold text-slate-800">
                              {analysis.unique_values}
                            </span>
                          </p>

                          <p className="text-slate-500">
                            Most Frequent:{" "}
                            <span className="font-semibold text-slate-800">
                              {analysis.most_frequent_value ??
                                "N/A"}
                            </span>
                          </p>

                          <p className="text-slate-500">
                            Frequency:{" "}
                            <span className="font-semibold text-slate-800">
                              {analysis.frequency}
                            </span>
                          </p>

                        </div>

                      </div>

                    )
                  )}

                </div>

              </div>

            )}

          {/* Dataset Insights */}
          {analyticsData &&
            analyticsData.dataset_insights.length > 0 && (

              <div className="mt-6 rounded-2xl bg-white p-6 shadow-md">

                <h2 className="text-2xl font-semibold text-slate-800">
                  Dataset Insights
                </h2>

                <div className="mt-5 space-y-3">

                  {analyticsData.dataset_insights.map(
                    (insight, index) => (

                      <div
                        key={index}
                        className="rounded-xl bg-blue-50 p-4 text-sm text-blue-700"
                      >
                        {insight}
                      </div>

                    )
                  )}

                </div>

              </div>

            )}

        </main>

      </div>

    </div>
  );
}