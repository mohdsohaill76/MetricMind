import Navbar from "../src/components/layout/Navbar";
import Sidebar from "../src/components/layout/Sidebar";
import KPICard from "../src/components/dashboard/KPICard";
import RevenueChart from "../src/components/charts/RevenueChart";
import {
  FaDollarSign,
  FaChartLine,
  FaUsers,
  FaArrowTrendUp,
} from "react-icons/fa6";
import AIInsights from "../src/components/dashboard/AIInsights";
import SalesChart from "../src/components/charts/SalesChart";
import PerformanceChart from "../src/components/charts/PerformanceChart";
import RecentActivity from "../src/components/dashboard/RecentActivity";
import FilterBar from "../src/components/dashboard/FilterBar";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Application Area */}
      <div className="min-w-0 flex-1">

        {/* Navbar */}
        <Navbar />

        {/* Dashboard Content */}
        <main className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 lg:px-8">

          {/* Dashboard Header */}
          <section className="mb-8">

            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
                  Dashboard
                </h1>

                <p className="mt-2 text-sm text-slate-500 sm:text-base">
                  Welcome back! Here's your business overview.
                </p>
              </div>

              {/* Filter */}
              <div>
                <FilterBar />
              </div>

            </div>

          </section>

          {/* KPI Cards */}
          <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

            <KPICard
              title="Revenue"
              value="$24,500"
              change="+12% this month"
              icon={
                <FaDollarSign className="text-blue-600" />
              }
            />

            <KPICard
              title="Profit"
              value="$8,700"
              change="+8% this month"
              icon={
                <FaChartLine className="text-green-600" />
              }
            />

            <KPICard
              title="Customers"
              value="1,250"
              change="+210 New Users"
              icon={
                <FaUsers className="text-purple-600" />
              }
            />

            <KPICard
              title="Growth"
              value="18%"
              change="Excellent"
              icon={
                <FaArrowTrendUp className="text-orange-500" />
              }
            />

          </section>

          {/* Revenue + AI Insights */}
          <section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">

            {/* Revenue Chart */}
            <div className="min-w-0 xl:col-span-2">
              <RevenueChart />
            </div>

            {/* AI Insights */}
            <div className="min-w-0">
              <AIInsights />
            </div>

          </section>

          {/* Sales + Performance */}
          <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">

            <div className="min-w-0">
              <SalesChart />
            </div>

            <div className="min-w-0">
              <PerformanceChart />
            </div>

          </section>

          {/* Recent Activity */}
          <section className="mt-6">

            <RecentActivity />

          </section>

        </main>

      </div>

    </div>
  );
}