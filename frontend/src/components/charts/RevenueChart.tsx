"use client";

import ReactECharts from "echarts-for-react";

export default function RevenueChart() {
  const option = {
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [12000, 18000, 15000, 22000, 24500, 28000],
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

      <ReactECharts option={option} style={{ height: "400px" }} />
    </div>
  );
}