"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import { useParams } from "next/navigation";

import Navbar from "../../../src/components/layout/Navbar";
import Sidebar from "../../../src/components/layout/Sidebar";

import {
  FaArrowLeft,
  FaFileLines,
  FaLightbulb,
  FaChartLine,
  FaDatabase,
  FaCircleCheck,
  FaChartBar,
} from "react-icons/fa6";

import {
  getReport,
  getCurrentDataset,
  generateChart,
} from "../../../src/lib/api";


// ========================================
// Types
// ========================================

type ReportDatasetSummary = {
  shape: {
    rows: number;
    columns: number;
  };

  missing_values: Record<
    string,
    number
  >;

  missing_percentage: Record<
    string,
    number
  >;

  dtypes: Record<
    string,
    string
  >;

  numeric_columns: string[];

  categorical_columns: string[];

  unique_values: Record<
    string,
    number
  >;

  duplicate_rows: number;

  memory_usage_bytes: number;

  numeric_summary: Record<
    string,
    {
      count: number;
      mean: number;
      std: number;
      min: number;
      "25%": number;
      "50%": number;
      "75%": number;
      max: number;
    }
  >;

  quality_assessment: string;
};


type Report = {
  report_id: string;

  generated_at: string;

  dataset_summary: ReportDatasetSummary;

  key_insights: string[];

  recommendations: string[];

  charts_available: string[];

  status: string;
};


type Dataset = {
  filename: string;

  rows: number;

  columns: number;

  column_names: string[];

  data: Record<
    string,
    unknown
  >[];
};


type ChartResponse = {
  chart_type: string;

  filename: string;

  chart_path: string;

  message: string;
};


// ========================================
// Component
// ========================================

export default function ReportDetailsPage() {

  const params = useParams();

  const reportId =
    params.id as string;


  // ========================================
  // Report States
  // ========================================

  const [
    report,
    setReport,
  ] = useState<Report | null>(
    null
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");


  // ========================================
  // Dataset States
  // ========================================

  const [
    dataset,
    setDataset,
  ] = useState<Dataset | null>(
    null
  );


  // ========================================
  // Chart States
  // ========================================

  const [
    selectedChart,
    setSelectedChart,
  ] = useState("bar");

  const [
    xColumn,
    setXColumn,
  ] = useState("");

  const [
    yColumn,
    setYColumn,
  ] = useState("");


  const [
    chartLoading,
    setChartLoading,
  ] = useState(false);

  const [
    chartError,
    setChartError,
  ] = useState("");

  const [
    generatedChart,
    setGeneratedChart,
  ] = useState<ChartResponse | null>(
    null
  );


  // ========================================
  // Load Report + Dataset
  // ========================================

  useEffect(() => {

    if (!reportId) {
      return;
    }


    const loadData =
      async () => {

        try {

          setLoading(true);

          setError("");


          const [
            reportData,
            datasetData,
          ] =
            await Promise.all([
              getReport(reportId),
              getCurrentDataset(),
            ]);


          console.log(
            "Report details:",
            reportData
          );

          console.log(
            "Current dataset:",
            datasetData
          );


          setReport(
            reportData
          );

          setDataset(
            datasetData
          );


          // Set default X column
          if (
            datasetData
              .column_names
              .length > 0
          ) {

            setXColumn(
              datasetData
                .column_names[0]
            );

          }


          // Set default Y column
          if (
            datasetData
              .column_names
              .length > 1
          ) {

            setYColumn(
              datasetData
                .column_names[1]
            );

          }

        } catch (
          error
        ) {

          console.error(
            "Failed to load report:",
            error
          );


          setError(
            error instanceof Error
              ? error.message
              : "Failed to load report."
          );

        } finally {

          setLoading(false);

        }

      };


    loadData();

  }, [
    reportId,
  ]);


  // ========================================
  // Generate Chart
  // ========================================

  const handleGenerateChart =
    async () => {

      // Validate X column

      if (!xColumn) {

        setChartError(
          "Please select an X column."
        );

        return;

      }


      // Histogram only needs X column

      if (
        selectedChart !==
          "histogram" &&
        !yColumn
      ) {

        setChartError(
          "Please select a Y column."
        );

        return;

      }


      try {

        setChartLoading(true);

        setChartError("");

        setGeneratedChart(
          null
        );


        const chartRequest: {
          chart_type: string;

          x_column: string;

          y_column?: string;
        } = {

          chart_type:
            selectedChart,

          x_column:
            xColumn,

        };


        // Add Y column
        // for all charts
        // except histogram

        if (
          selectedChart !==
            "histogram"
        ) {

          chartRequest.y_column =
            yColumn;

        }


        const result =
          await generateChart(
            chartRequest
          );


        console.log(
          "Generated chart:",
          result
        );


        setGeneratedChart(
          result
        );

      } catch (
        error
      ) {

        console.error(
          "Failed to generate chart:",
          error
        );


        setChartError(
          error instanceof Error
            ? error.message
            : "Failed to generate chart."
        );

      } finally {

        setChartLoading(false);

      }

    };


  // ========================================
  // Loading UI
  // ========================================

  if (loading) {

    return (

      <div className="flex min-h-screen">

        <Sidebar />

        <div className="flex-1">

          <Navbar />

          <main className="min-h-screen bg-slate-100 p-8">

            <div className="card rounded-2xl p-10 text-center shadow-md">

              <p className="text-lg font-medium">

                Loading report...

              </p>

            </div>

          </main>

        </div>

      </div>

    );

  }


  // ========================================
  // Error UI
  // ========================================

  if (
    error ||
    !report
  ) {

    return (

      <div className="flex min-h-screen">

        <Sidebar />

        <div className="flex-1">

          <Navbar />

          <main className="min-h-screen bg-slate-100 p-8">

            <Link
              href="/reports"
              className="mb-6 inline-flex items-center gap-2 font-medium text-blue-600 hover:text-blue-700"
            >

              <FaArrowLeft />

              Back to Reports

            </Link>


            <div className="card rounded-2xl p-10 text-center shadow-md">

              <h2 className="text-2xl font-bold text-red-600">

                Failed to Load Report

              </h2>


              <p className="mt-3 opacity-70">

                {error ||
                  "Report not found."}

              </p>

            </div>

          </main>

        </div>

      </div>

    );

  }


  // ========================================
  // Dataset Summary
  // ========================================

  const summary =
    report.dataset_summary;


  // ========================================
  // Main UI
  // ========================================

  return (

    <div className="flex min-h-screen">

      {/* Sidebar */}

      <Sidebar />


      <div className="flex-1">

        {/* Navbar */}

        <Navbar />


        <main className="min-h-screen bg-slate-100 p-8">


          {/* ========================================
              Back Button
          ======================================== */}

          <Link
            href="/reports"
            className="mb-6 inline-flex items-center gap-2 font-medium text-blue-600 hover:text-blue-700"
          >

            <FaArrowLeft />

            Back to Reports

          </Link>


          {/* ========================================
              Report Header
          ======================================== */}

          <div className="card rounded-2xl p-8 shadow-md">

            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">


              <div className="flex items-center gap-4">


                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100">

                  <FaFileLines className="text-2xl text-blue-600" />

                </div>


                <div>

                  <h1 className="text-3xl font-bold">

                    AI Business Report

                  </h1>


                  <p className="mt-2 opacity-60">

                    Report ID:{" "}

                    {report.report_id}

                  </p>


                  <p className="mt-1 opacity-60">

                    Generated on{" "}

                    {new Date(
                      report.generated_at
                    ).toLocaleString()}

                  </p>

                </div>

              </div>


              {/* Status */}

              <div>

                <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">

                  <FaCircleCheck />

                  {report.status}

                </span>

              </div>


            </div>

          </div>


          {/* ========================================
              Dataset Overview
          ======================================== */}

          <div className="mt-6">


            <div className="mb-4 flex items-center gap-3">

              <FaDatabase className="text-2xl text-blue-600" />


              <h2 className="text-2xl font-semibold">

                Dataset Overview

              </h2>

            </div>


            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">


              {/* Total Records */}

              <div className="card rounded-2xl p-6 shadow-md">

                <p className="text-sm opacity-60">

                  Total Records

                </p>


                <h3 className="mt-2 text-3xl font-bold">

                  {summary.shape.rows}

                </h3>

              </div>


              {/* Total Columns */}

              <div className="card rounded-2xl p-6 shadow-md">

                <p className="text-sm opacity-60">

                  Total Columns

                </p>


                <h3 className="mt-2 text-3xl font-bold">

                  {summary.shape.columns}

                </h3>

              </div>


              {/* Numeric Columns */}

              <div className="card rounded-2xl p-6 shadow-md">

                <p className="text-sm opacity-60">

                  Numeric Columns

                </p>


                <h3 className="mt-2 text-3xl font-bold">

                  {
                    summary
                      .numeric_columns
                      .length
                  }

                </h3>

              </div>


              {/* Categorical Columns */}

              <div className="card rounded-2xl p-6 shadow-md">

                <p className="text-sm opacity-60">

                  Categorical Columns

                </p>


                <h3 className="mt-2 text-3xl font-bold">

                  {
                    summary
                      .categorical_columns
                      .length
                  }

                </h3>

              </div>


            </div>

          </div>


          {/* ========================================
              Dataset Quality
          ======================================== */}

          <div className="card mt-6 rounded-2xl p-8 shadow-md">


            <h2 className="text-2xl font-semibold">

              Dataset Quality

            </h2>


            <div className="mt-5 rounded-xl bg-blue-50 p-5">

              <p className="font-medium text-blue-700">

                {
                  summary
                    .quality_assessment
                }

              </p>

            </div>


            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">


              <div>

                <p className="text-sm opacity-60">

                  Duplicate Rows

                </p>


                <p className="mt-1 text-xl font-semibold">

                  {
                    summary
                      .duplicate_rows
                  }

                </p>

              </div>


              <div>

                <p className="text-sm opacity-60">

                  Memory Usage

                </p>


                <p className="mt-1 text-xl font-semibold">

                  {
                    (
                      summary
                        .memory_usage_bytes /
                      1024
                    ).toFixed(2)
                  }{" "}

                  KB

                </p>

              </div>


            </div>

          </div>


          {/* ========================================
              Key Insights
          ======================================== */}

          <div className="card mt-6 rounded-2xl p-8 shadow-md">


            <div className="flex items-center gap-3">

              <FaLightbulb className="text-2xl text-yellow-500" />


              <h2 className="text-2xl font-semibold">

                Key Insights

              </h2>

            </div>


            <div className="mt-5 space-y-4">

              {report.key_insights.map(
                (
                  insight,
                  index
                ) => (

                  <div
                    key={index}
                    className="rounded-xl bg-slate-50 p-4"
                  >

                    <p>

                      {insight}

                    </p>

                  </div>

                )
              )}

            </div>

          </div>


          {/* ========================================
              Numeric Analysis
          ======================================== */}

          {
            Object.keys(
              summary.numeric_summary
            ).length > 0 && (

              <div className="card mt-6 rounded-2xl p-8 shadow-md">


                <div className="flex items-center gap-3">

                  <FaChartLine className="text-2xl text-blue-600" />


                  <h2 className="text-2xl font-semibold">

                    Numeric Analysis

                  </h2>

                </div>


                <div className="mt-6 space-y-6">


                  {Object.entries(
                    summary.numeric_summary
                  ).map(
                    (
                      [
                        column,
                        stats,
                      ]
                    ) => (

                      <div
                        key={column}
                        className="rounded-xl border p-5"
                      >


                        <h3 className="text-lg font-semibold">

                          {column}

                        </h3>


                        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">


                          <div>

                            <p className="text-sm opacity-60">

                              Mean

                            </p>


                            <p className="font-semibold">

                              {stats.mean.toFixed(
                                2
                              )}

                            </p>

                          </div>


                          <div>

                            <p className="text-sm opacity-60">

                              Median

                            </p>


                            <p className="font-semibold">

                              {stats[
                                "50%"
                              ].toFixed(
                                2
                              )}

                            </p>

                          </div>


                          <div>

                            <p className="text-sm opacity-60">

                              Minimum

                            </p>


                            <p className="font-semibold">

                              {stats.min.toFixed(
                                2
                              )}

                            </p>

                          </div>


                          <div>

                            <p className="text-sm opacity-60">

                              Maximum

                            </p>


                            <p className="font-semibold">

                              {stats.max.toFixed(
                                2
                              )}

                            </p>

                          </div>


                        </div>

                      </div>

                    )
                  )}

                </div>

              </div>

            )
          }


          {/* ========================================
              Available Charts
          ======================================== */}

          <div className="card mt-6 rounded-2xl p-8 shadow-md">


            <div className="flex items-center gap-3">

              <FaChartBar className="text-2xl text-blue-600" />


              <h2 className="text-2xl font-semibold">

                Available Charts

              </h2>

            </div>


            <div className="mt-5 flex flex-wrap gap-3">

              {report.charts_available.map(
                (
                  chart
                ) => (

                  <span
                    key={chart}
                    className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold capitalize text-blue-700"
                  >

                    {chart}

                  </span>

                )
              )}

            </div>

          </div>


          {/* ========================================
              Chart Generator
          ======================================== */}

          <div className="card mt-6 rounded-2xl p-8 shadow-md">


            <div className="flex items-center gap-3">

              <FaChartLine className="text-2xl text-blue-600" />


              <div>

                <h2 className="text-2xl font-semibold">

                  Generate Chart

                </h2>


                <p className="mt-1 text-sm opacity-60">

                  Select a chart type and dataset columns to generate a visual analysis.

                </p>

              </div>

            </div>


            {/* Controls */}

            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">


              {/* Chart Type */}

              <div>

                <label className="mb-2 block text-sm font-medium">

                  Chart Type

                </label>


                <select
                  value={
                    selectedChart
                  }
                  onChange={(
                    e
                  ) =>
                    setSelectedChart(
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border bg-transparent px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                >

                  {report.charts_available.map(
                    (
                      chart
                    ) => (

                      <option
                        key={chart}
                        value={chart}
                      >

                        {chart
                          .charAt(
                            0
                          )
                          .toUpperCase() +
                          chart.slice(
                            1
                          )}

                      </option>

                    )
                  )}

                </select>

              </div>


              {/* X Column */}

              <div>

                <label className="mb-2 block text-sm font-medium">

                  X Column

                </label>


                <select
                  value={
                    xColumn
                  }
                  onChange={(
                    e
                  ) =>
                    setXColumn(
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border bg-transparent px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                >

                  <option value="">

                    Select X column

                  </option>


                  {dataset?.column_names.map(
                    (
                      column
                    ) => (

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

                <label className="mb-2 block text-sm font-medium">

                  Y Column

                </label>


                <select
                  value={
                    yColumn
                  }
                  onChange={(
                    e
                  ) =>
                    setYColumn(
                      e.target.value
                    )
                  }
                  disabled={
                    selectedChart ===
                    "histogram"
                  }
                  className="w-full rounded-xl border bg-transparent px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  <option value="">

                    {
                      selectedChart ===
                      "histogram"
                        ? "Not required"
                        : "Select Y column"
                    }

                  </option>


                  {dataset?.column_names.map(
                    (
                      column
                    ) => (

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


            </div>


            {/* Generate Button */}

            <button
              onClick={
                handleGenerateChart
              }
              disabled={
                chartLoading ||
                !dataset
              }
              className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >

              {chartLoading
                ? "Generating Chart..."
                : "Generate Chart"}

            </button>


            {/* Chart Error */}

            {chartError && (

              <div className="mt-5 rounded-xl bg-red-50 p-4 text-red-600">

                {chartError}

              </div>

            )}


            {/* Generated Chart */}

            {generatedChart && (

              <div className="mt-8 rounded-2xl border p-6">


                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">


                  <div>

                    <h3 className="text-xl font-semibold">

                      Generated{" "}

                      {
                        generatedChart
                          .chart_type
                      }{" "}

                      Chart

                    </h3>


                    <p className="mt-1 text-sm opacity-60">

                      Chart generated successfully.

                    </p>

                  </div>


                  {/* View Chart */}

                  <a
                    href={`http://127.0.0.1:8000/generated_charts/${generatedChart.filename}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700"
                  >

                    View Chart

                  </a>


                </div>


                {/* Chart Image */}

                <div className="mt-6 overflow-hidden rounded-xl border bg-white p-4">

                  <img
                    src={`http://127.0.0.1:8000/generated_charts/${generatedChart.filename}`}
                    alt={`${generatedChart.chart_type} chart`}
                    className="mx-auto max-h-[500px] w-full object-contain"
                  />

                </div>

              </div>

            )}

          </div>


          {/* ========================================
              AI Recommendations
          ======================================== */}

          <div className="card mt-6 rounded-2xl p-8 shadow-md">


            <div className="flex items-center gap-3">

              <FaLightbulb className="text-2xl text-orange-500" />


              <h2 className="text-2xl font-semibold">

                AI Recommendations

              </h2>

            </div>


            <div className="mt-5 space-y-4">

              {report.recommendations.map(
                (
                  recommendation,
                  index
                ) => (

                  <div
                    key={index}
                    className="rounded-xl bg-blue-50 p-5"
                  >

                    <p className="text-blue-700">

                      {recommendation}

                    </p>

                  </div>

                )
              )}

            </div>

          </div>


        </main>

      </div>

    </div>

  );

}