"use client";

import { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { getDashboardSummary } from "../../lib/api";

interface DashboardSummary {
  revenue_overview: {
    total_sales: number;
    total_profit: number;
    average_sales: number;
    average_profit: number;
  };
  sales_by_region: {
    region: string;
    sales: number;
  }[];
  monthly_performance: {
    month: string;
    sales: number;
    profit: number;
  }[];
  category_sales: unknown[];
  top_products: unknown[];
}

export default function PerformanceChart() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
  async function loadDashboardSummary() {
    try {
      setLoading(true);
      setError("");

      const data = await getDashboardSummary();

      setSummary(data);
    } catch (err) {
      console.error("Revenue chart error:", err);
      setError("Unable to load chart data.");
    } finally {
      setLoading(false);
    }
  }

  loadDashboardSummary();

  const handleDatasetUploaded = () => {
    loadDashboardSummary();
  };

  window.addEventListener(
    "datasetUploaded",
    handleDatasetUploaded
  );

  return () => {
    window.removeEventListener(
      "datasetUploaded",
      handleDatasetUploaded
    );
  };
}, []);
  if (loading) {
    return (
      <div className="card rounded-2xl p-6 shadow-md">
        <h2 className="mb-5 text-xl font-semibold">
          Monthly Performance
        </h2>

        <div className="flex h-[350px] items-center justify-center">
          <p className="text-[var(--foreground)] opacity-70">
            Loading performance data...
          </p>
        </div>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="card rounded-2xl p-6 shadow-md">
        <h2 className="mb-5 text-xl font-semibold">
          Monthly Performance
        </h2>

        <div className="flex h-[350px] items-center justify-center">
          <p className="text-[var(--foreground)] opacity-70">
            {error || "No dataset available."}
          </p>
        </div>
      </div>
    );
  }

  const dates = summary.monthly_performance.map((item) => item.month);
  const profitValues = summary.monthly_performance.map((item) => item.profit);

  const option = {
    tooltip: {
      trigger: "axis",
    },

    xAxis: {
      type: "category",
      data: dates,
    },

    yAxis: {
      type: "value",
      name: "Profit",
    },

    series: [
      {
        name: "Profit",
        type: "bar",
        data: profitValues,
      },
    ],
  };

  return (
    <div className="card rounded-2xl p-6 shadow-md">

      <h2 className="mb-5 text-xl font-semibold">
        Performance Overview
      </h2>

      <ReactECharts
        option={option}
        style={{
          height: "350px",
          width: "100%",
        }}
      />

    </div>
  );
}
