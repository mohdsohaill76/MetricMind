"use client";

import ReactECharts from "echarts-for-react";

interface NumericAnalysis {
  count: number;
  mean: number;
  median: number;
  standard_deviation: number;
  minimum: number;
  maximum: number;
  first_quartile: number;
  third_quartile: number;
}

interface CategoricalAnalysis {
  unique_values: number;
  most_frequent_value: string | number | null;
  frequency: number;
}

interface AnalyticsChartProps {
  numericAnalysis: Record<string, NumericAnalysis>;
  categoricalAnalysis: Record<string, CategoricalAnalysis>;
}

export default function AnalyticsChart({
  numericAnalysis,
  categoricalAnalysis,
}: AnalyticsChartProps) {
  const numericColumns = Object.keys(numericAnalysis);
  const categoricalColumns = Object.keys(categoricalAnalysis);

  return (
    <div className="space-y-8">

      {/* ============================= */}
      {/* Numeric Analysis */}
      {/* ============================= */}

      {numericColumns.length > 0 && (
        <section className="rounded-2xl bg-[var(--card-background)] p-6 shadow-md">

          <h2 className="text-2xl font-semibold text-[var(--foreground)]">
            Numeric Analysis
          </h2>

          <p className="mt-2 text-[var(--foreground)] opacity-70">
            Statistical summary of numeric columns in your dataset.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">

            {numericColumns.map((column) => {
              const data = numericAnalysis[column];

              const chartOptions = {
                title: {
                  text: column,
                  left: "center",
                },

                tooltip: {
                  trigger: "axis",
                },

                xAxis: {
                  type: "category",
                  data: [
                    "Minimum",
                    "Q1",
                    "Median",
                    "Mean",
                    "Q3",
                    "Maximum",
                  ],
                },

                yAxis: {
                  type: "value",
                },

                series: [
                  {
                    name: column,
                    type: "bar",
                    data: [
                      data.minimum,
                      data.first_quartile,
                      data.median,
                      data.mean,
                      data.third_quartile,
                      data.maximum,
                    ],
                    barMaxWidth: 50,
                  },
                ],
              };

              return (
                <div
                  key={column}
                  className="rounded-xl border border-[var(--border-color)] p-4"
                >
                  <ReactECharts
                    option={chartOptions}
                    style={{
                      height: "350px",
                      width: "100%",
                    }}
                  />

                  <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">

                    <div className="rounded-lg bg-[var(--background)] p-3">
                      <p className="text-xs text-[var(--foreground)] opacity-70">
                        Mean
                      </p>
                      <p className="font-semibold">
                        {data.mean.toFixed(2)}
                      </p>
                    </div>

                    <div className="rounded-lg bg-[var(--background)] p-3">
                      <p className="text-xs text-[var(--foreground)] opacity-70">
                        Median
                      </p>
                      <p className="font-semibold">
                        {data.median.toFixed(2)}
                      </p>
                    </div>

                    <div className="rounded-lg bg-[var(--background)] p-3">
                      <p className="text-xs text-[var(--foreground)] opacity-70">
                        Minimum
                      </p>
                      <p className="font-semibold">
                        {data.minimum.toFixed(2)}
                      </p>
                    </div>

                    <div className="rounded-lg bg-[var(--background)] p-3">
                      <p className="text-xs text-[var(--foreground)] opacity-70">
                        Maximum
                      </p>
                      <p className="font-semibold">
                        {data.maximum.toFixed(2)}
                      </p>
                    </div>

                  </div>

                </div>
              );
            })}

          </div>

        </section>
      )}


      {/* ============================= */}
      {/* Categorical Analysis */}
      {/* ============================= */}

      {categoricalColumns.length > 0 && (
        <section className="rounded-2xl bg-[var(--card-background)] p-6 shadow-md">

          <h2 className="text-2xl font-semibold text-[var(--foreground)]">
            Categorical Analysis
          </h2>

          <p className="mt-2 text-[var(--foreground)] opacity-70">
            Summary of categorical columns in your dataset.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">

            {categoricalColumns.map((column) => {
              const data = categoricalAnalysis[column];

              const chartOptions = {
                title: {
                  text: column,
                  left: "center",
                },

                tooltip: {
                  trigger: "item",
                },

                series: [
                  {
                    name: column,
                    type: "pie",
                    radius: ["40%", "70%"],

                    data: [
                      {
                        value: data.frequency,
                        name: `Most Frequent: ${
                          data.most_frequent_value ?? "Unknown"
                        }`,
                      },
                      {
                        value: Math.max(
                          data.unique_values - 1,
                          0
                        ),
                        name: "Other Values",
                      },
                    ],

                    emphasis: {
                      itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor:
                          "rgba(0, 0, 0, 0.5)",
                      },
                    },
                  },
                ],
              };

              return (
                <div
                  key={column}
                  className="rounded-xl border border-[var(--border-color)] p-4"
                >

                  <ReactECharts
                    option={chartOptions}
                    style={{
                      height: "350px",
                      width: "100%",
                    }}
                  />

                  <div className="mt-4 grid grid-cols-2 gap-4">

                    <div className="rounded-lg bg-[var(--background)] p-4">
                      <p className="text-sm text-[var(--foreground)] opacity-70">
                        Unique Values
                      </p>

                      <p className="mt-1 text-2xl font-bold">
                        {data.unique_values}
                      </p>
                    </div>

                    <div className="rounded-lg bg-[var(--background)] p-4">
                      <p className="text-sm text-[var(--foreground)] opacity-70">
                        Most Frequent
                      </p>

                      <p className="mt-1 font-bold">
                        {data.most_frequent_value ?? "Unknown"}
                      </p>
                    </div>

                  </div>

                </div>
              );
            })}

          </div>

        </section>
      )}

    </div>
  );
}