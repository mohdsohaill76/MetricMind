"use client";

import Navbar from "../../src/components/layout/Navbar";
import Sidebar from "../../src/components/layout/Sidebar";

import KPICard from "../../src/components/dashboard/KPICard";

import RevenueChart from "../../src/components/charts/RevenueChart";
import SalesChart from "../../src/components/charts/SalesChart";
import PerformanceChart from "../../src/components/charts/PerformanceChart";

import {
  FaDollarSign,
  FaChartLine,
  FaUsers,
  FaArrowTrendUp,
} from "react-icons/fa6";

export default function AnalyticsPage() {
  return (
    <div className="flex min-h-screen">

      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1">

        {/* Navbar */}
        <Navbar />

        <main className="min-h-screen bg-slate-100 p-8">

          {/* Page Header */}
          <div className="mb-8">

            <h1 className="text-4xl font-bold">
              Analytics
            </h1>

            <p className="mt-2 opacity-70">
              Analyze your business performance and discover valuable insights.
            </p>

          </div>


          {/* Analytics Summary Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

            <KPICard
              title="Total Revenue"
              value="$124,500"
              change="+15.8% this year"
              icon={
                <FaDollarSign className="text-blue-600" />
              }
            />

            <KPICard
              title="Total Profit"
              value="$48,700"
              change="+12.4% this year"
              icon={
                <FaChartLine className="text-green-600" />
              }
            />

            <KPICard
              title="Total Customers"
              value="8,250"
              change="+18.2% this year"
              icon={
                <FaUsers className="text-purple-600" />
              }
            />

            <KPICard
              title="Business Growth"
              value="24.8%"
              change="Strong Growth"
              icon={
                <FaArrowTrendUp className="text-orange-500" />
              }
            />

          </div>


          {/* Revenue Analytics */}
          <div className="mt-8">

            <RevenueChart />

          </div>


          {/* Sales & Performance Analytics */}
          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">

            <SalesChart />

            <PerformanceChart />

          </div>


          {/* Business Insights */}
          <div className="card mt-6 rounded-2xl p-6 shadow-md">

            <h2 className="text-2xl font-semibold">
              Business Insights
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">

              {/* Insight 1 */}
              <div className="rounded-xl bg-blue-50 p-5">

                <h3 className="font-semibold text-blue-700">
                  Revenue Growth
                </h3>

                <p className="mt-2 text-sm text-blue-600">
                  Revenue has shown consistent growth over the recent period,
                  indicating positive business performance.
                </p>

              </div>


              {/* Insight 2 */}
              <div className="rounded-xl bg-green-50 p-5">

                <h3 className="font-semibold text-green-700">
                  Customer Growth
                </h3>

                <p className="mt-2 text-sm text-green-600">
                  The customer base is expanding steadily, contributing to
                  increased overall revenue.
                </p>

              </div>


              {/* Insight 3 */}
              <div className="rounded-xl bg-orange-50 p-5">

                <h3 className="font-semibold text-orange-700">
                  Performance
                </h3>

                <p className="mt-2 text-sm text-orange-600">
                  Business performance is improving across multiple
                  categories with strong growth potential.
                </p>

              </div>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}