"use client";

import Navbar from "../../src/components/layout/Navbar";
import Sidebar from "../../src/components/layout/Sidebar";
import {
  FaChartLine,
  FaChartPie,
  FaArrowTrendUp,
} from "react-icons/fa6";

export default function AnalyticsPage() {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <main className="min-h-screen bg-slate-100 p-8">

          <h1 className="text-4xl font-bold text-slate-800">
            Analytics
          </h1>

          <p className="mt-2 text-gray-600">
            Monitor business performance and AI insights.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">

            <div className="rounded-2xl bg-white p-6 shadow-md hover:shadow-lg transition">
              <FaChartLine className="text-4xl text-blue-600 mb-4" />

              <h2 className="text-xl font-semibold">
                Revenue Analytics
              </h2>

              <p className="mt-2 text-gray-500">
                View revenue trends and monthly growth.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-md hover:shadow-lg transition">
              <FaChartPie className="text-4xl text-green-600 mb-4" />

              <h2 className="text-xl font-semibold">
                Sales Analytics
              </h2>

              <p className="mt-2 text-gray-500">
                Analyze sales distribution across regions.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-md hover:shadow-lg transition">
              <FaArrowTrendUp className="text-4xl text-orange-500 mb-4" />

              <h2 className="text-xl font-semibold">
                Growth Analytics
              </h2>

              <p className="mt-2 text-gray-500">
                Monitor business growth and forecasting.
              </p>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}