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

export default function PerformanceChart() {
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
        <h2 className="mb-5 text-xl font-semibold">
          Monthly Performance
        </h2>

        <div className="flex h-[350px] items-center justify-center">
          <p className="text-slate-500">
            Loading performance data...
          </p>
        </div>
      </div>
    );
  }

  if (error || !dataset) {
    return (
      <div className="card rounded-2xl p-6 shadow-md">
        <h2 className="mb-5 text-xl font-semibold">
          Monthly Performance
        </h2>

        <div className="flex h-[350px] items-center justify-center">
          <p className="text-slate-500">
            {error || "No dataset available."}
          </p>
        </div>
      </div>
    );
  }

  // Calculate total profit for each date
  const profitByDate: Record<string, number> = {};

  dataset.data.forEach((row) => {
    const date = String(row.Date);
    const profit = Number(row.Profit) || 0;

    if (!profitByDate[date]) {
      profitByDate[date] = 0;
    }

    profitByDate[date] += profit;
  });

  const dates = Object.keys(profitByDate);
  const profitValues = Object.values(profitByDate);

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