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

export default function SalesChart() {
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
          Sales by Region
        </h2>

        <div className="flex h-[350px] items-center justify-center">
          <p className="text-slate-500">
            Loading sales data...
          </p>
        </div>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="card rounded-2xl p-6 shadow-md">
        <h2 className="mb-5 text-xl font-semibold">
          Sales by Region
        </h2>

        <div className="flex h-[350px] items-center justify-center">
          <p className="text-slate-500">
            {error || "No dataset available."}
          </p>
        </div>
      </div>
    );
  }

  const chartData = summary.sales_by_region.map(
    ({ region, sales }) => ({
      value: sales,
      name: region,
    })
  );

  const option = {
    tooltip: {
      trigger: "item",
      formatter: "{b}: ${c}",
    },

    legend: {
      bottom: 0,
    },

    series: [
      {
        name: "Sales",
        type: "pie",
        radius: ["40%", "70%"],
        data: chartData,
      },
    ],
  };

  return (
    <div className="card rounded-2xl p-6 shadow-md">

      <h2 className="mb-5 text-xl font-semibold">
        Sales by Region
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
