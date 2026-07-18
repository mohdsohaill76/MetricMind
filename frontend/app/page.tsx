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


export default function Home() {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <main className="min-h-screen bg-slate-100 p-8">
          {/* Dashboard Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-800">
              Dashboard
            </h1>

            <p className="mt-2 text-gray-600">
              Welcome back! Here's your business overview.
            </p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

            <KPICard
              title="Revenue"
              value="$24,500"
              change="+12% this month"
              icon={<FaDollarSign className="text-blue-600" />}
            />

            <KPICard
              title="Profit"
              value="$8,700"
              change="+8% this month"
              icon={<FaChartLine className="text-green-600" />}
            />

            <KPICard
              title="Customers"
              value="1,250"
              change="+210 New Users"
              icon={<FaUsers className="text-purple-600" />}
            />

            <KPICard
              title="Growth"
              value="18%"
              change="Excellent"
              icon={<FaArrowTrendUp className="text-orange-500" />}
            />

          </div>
          {/* Revenue Chart */}
           <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">

  <div className="xl:col-span-2">
    <RevenueChart />
  </div>

  <div>
  <AIInsights />
</div>

</div>
<div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">

    <SalesChart />

    <PerformanceChart />

</div>

        </main>
      </div>
    </div>
  );
}