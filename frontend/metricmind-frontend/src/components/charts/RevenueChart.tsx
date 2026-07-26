"use client";

import { useEffect, useState } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000/api/v1";

interface AnalyticsSummary {
  numeric_columns: string[];
  categorical_columns: string[];
  available_charts: string[];
}

interface ChartResponse {
  chart_type: string;
  filename: string;
  chart_path: string;
  message: string;
}

export default function RevenueChart() {
  const [analytics, setAnalytics] =
    useState<AnalyticsSummary | null>(null);

  const [xColumn, setXColumn] =
    useState("");

  const [yColumn, setYColumn] =
    useState("");

  const [chartType, setChartType] =
    useState("line");

  const [chart, setChart] =
    useState<ChartResponse | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // Get available columns
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/analytics/summary`
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load dataset information"
          );
        }

        const data =
          await response.json();

        setAnalytics(data);

        // Automatically select columns
        if (data.categorical_columns?.length > 0) {
          setXColumn(
            data.categorical_columns[0]
          );
        }

        if (data.numeric_columns?.length > 0) {
          setYColumn(
            data.numeric_columns[0]
          );
        }

      } catch (error) {
        console.error(
          "Analytics Error:",
          error
        );

        setError(
          "Please upload a dataset first."
        );
      }
    };

    fetchAnalytics();
  }, []);

  // Generate chart
  const generateChart = async () => {
    if (!xColumn || !yColumn) {
      setError(
        "Please select X and Y columns."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");
      setChart(null);

      const response = await fetch(
        `${API_BASE_URL}/chart`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            chart_type: chartType,
            x_column: xColumn,
            y_column: yColumn,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Chart generation failed"
        );
      }

      const data: ChartResponse =
        await response.json();

      setChart(data);

    } catch (error) {
      console.error(
        "Chart Generation Error:",
        error
      );

      setError(
        "Unable to generate chart."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-md">

      {/* Header */}
      <div className="mb-6">

        <h2 className="text-xl font-semibold text-slate-800">
          Revenue Overview
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Generate a chart using your uploaded dataset.
        </p>

      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

        {/* X Column */}
        <div>

          <label className="mb-2 block text-sm font-medium text-slate-600">
            X-Axis Column
          </label>

          <select
            value={xColumn}
            onChange={(e) =>
              setXColumn(e.target.value)
            }
            className="w-full rounded-xl border border-slate-200 bg-white p-3 outline-none focus:border-blue-500"
          >

            <option value="">
              Select X Column
            </option>

            {analytics?.categorical_columns?.map(
              (column) => (
                <option
                  key={column}
                  value={column}
                >
                  {column}
                </option>
              )
            )}

          </select>

        </div>

        {/* Y Column */}
        <div>

          <label className="mb-2 block text-sm font-medium text-slate-600">
            Y-Axis Column
          </label>

          <select
            value={yColumn}
            onChange={(e) =>
              setYColumn(e.target.value)
            }
            className="w-full rounded-xl border border-slate-200 bg-white p-3 outline-none focus:border-blue-500"
          >

            <option value="">
              Select Y Column
            </option>

            {analytics?.numeric_columns?.map(
              (column) => (
                <option
                  key={column}
                  value={column}
                >
                  {column}
                </option>
              )
            )}

          </select>

        </div>

        {/* Chart Type */}
        <div>

          <label className="mb-2 block text-sm font-medium text-slate-600">
            Chart Type
          </label>

          <select
            value={chartType}
            onChange={(e) =>
              setChartType(e.target.value)
            }
            className="w-full rounded-xl border border-slate-200 bg-white p-3 outline-none focus:border-blue-500"
          >

            <option value="line">
              Line
            </option>

            <option value="bar">
              Bar
            </option>

            <option value="scatter">
              Scatter
            </option>

            <option value="histogram">
              Histogram
            </option>

            <option value="box">
              Box
            </option>

          </select>

        </div>

      </div>

      {/* Generate Button */}
      <button
        onClick={generateChart}
        disabled={
          loading ||
          !xColumn ||
          !yColumn
        }
        className="mt-5 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {loading
          ? "Generating..."
          : "Generate Chart"}
      </button>

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Generated Chart */}
      {chart && (
        <div className="mt-8">

          <div className="mb-4 rounded-xl bg-green-50 p-4">

            <p className="font-semibold text-green-700">
              {chart.message}
            </p>

            <p className="mt-1 text-sm text-green-600">
              Chart type:{" "}
              {chart.chart_type}
            </p>

          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200">

            <img
              src={`${API_BASE_URL.replace(
                "/api/v1",
                ""
              )}${chart.chart_path}`}
              alt="Generated Revenue Chart"
              className="w-full object-contain"
            />

          </div>

        </div>
      )}

    </div>
  );
}