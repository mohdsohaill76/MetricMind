"use client";

import { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { getCurrentDataset } from "../../lib/api";

interface DatasetResponse {
  filename: string;
  rows: number;
  columns: number;
  column_names: string[];
  data: Record<string, any>[];
}

export default function RevenueChart() {
  const [dataset, setDataset] = useState<DatasetResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
  async function loadDataset() {
    try {
      setLoading(true);
      setError("");

      const data = await getCurrentDataset();

      setDataset(data);
    } catch (err) {
      console.error("Revenue chart error:", err);
      setError("Unable to load chart data.");
    } finally {
      setLoading(false);
    }
  }

  loadDataset();

  const handleDatasetUploaded = () => {
    loadDataset();
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
        <h2 className="mb-4 text-xl font-semibold">
          Revenue Overview
        </h2>

        <div className="flex h-[400px] items-center justify-center">
          <p className="text-slate-500">
            Loading chart data...
          </p>
        </div>
      </div>
    );
  }

  if (error || !dataset) {
    return (
      <div className="card rounded-2xl p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold">
          Revenue Overview
        </h2>

        <div className="flex h-[400px] items-center justify-center">
          <p className="text-slate-500">
            {error || "No dataset available."}
          </p>
        </div>
      </div>
    );
  }

  // Group Sales by Date
  const revenueByDate: Record<string, number> = {};

  dataset.data.forEach((row) => {
    const date = String(row.Date);
    const sales = Number(row.Sales) || 0;

    if (!revenueByDate[date]) {
      revenueByDate[date] = 0;
    }

    revenueByDate[date] += sales;
  });

  const dates = Object.keys(revenueByDate);
  const salesValues = Object.values(revenueByDate);

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
      name: "Sales",
    },

    series: [
      {
        name: "Sales",
        data: salesValues,
        type: "line",
        smooth: true,
        areaStyle: {},
      },
    ],
  };

  return (
    <div className="card rounded-2xl p-6 shadow-md">

      <h2 className="mb-4 text-xl font-semibold">
        Revenue Overview
      </h2>

      <ReactECharts
        option={option}
        style={{
          height: "400px",
          width: "100%",
        }}
      />

    </div>
  );
}