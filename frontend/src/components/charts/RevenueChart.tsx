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
<div className="
rounded-2xl
bg-white
p-6
shadow-md
transition-all
duration-300
hover:shadow-xl
hover:scale-[1.01]
">      <h2 className="mb-4 text-xl font-semibold">
        Revenue Overview
      </h2>

      <ReactECharts option={option} style={{ height: "400px" }} />
    </div>
  );
}