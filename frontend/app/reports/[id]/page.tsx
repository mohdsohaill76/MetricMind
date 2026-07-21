"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import Navbar from "../../../src/components/layout/Navbar";
import Sidebar from "../../../src/components/layout/Sidebar";

import {
  FaArrowLeft,
  FaDownload,
  FaFileLines,
  FaLightbulb,
  FaChartLine,
  FaUsers,
  FaListCheck,
} from "react-icons/fa6";

export default function ReportDetailsPage() {
  const params = useParams();

  return (
    <div className="flex min-h-screen">

      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1">

        {/* Navbar */}
        <Navbar />

        <main className="min-h-screen bg-slate-100 p-8">

          {/* Back Button */}
          <Link
            href="/reports"
            className="mb-6 inline-flex items-center gap-2 font-medium text-blue-600 hover:text-blue-700"
          >
            <FaArrowLeft />
            Back to Reports
          </Link>


          {/* Report Header */}
          <div className="card rounded-2xl p-8 shadow-md">

            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100">

                  <FaFileLines className="text-2xl text-blue-600" />

                </div>

                <div>

                  <h1 className="text-3xl font-bold">
                    Monthly Business Performance
                  </h1>

                  <p className="mt-2 opacity-60">
                    Business Analysis • July 20, 2026
                  </p>

                </div>

              </div>


              {/* Download */}
              <button
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
              >
                <FaDownload />
                Download Report
              </button>

            </div>

          </div>


          {/* AI Summary */}
          <div className="card mt-6 rounded-2xl p-8 shadow-md">

            <div className="flex items-center gap-3">

              <FaLightbulb className="text-2xl text-yellow-500" />

              <h2 className="text-2xl font-semibold">
                AI Business Summary
              </h2>

            </div>

            <p className="mt-5 leading-7 opacity-70">
              The business has demonstrated strong overall growth during the
              analyzed period. Revenue increased consistently, supported by
              improved sales performance and customer acquisition. The
              analysis indicates that the business is maintaining a positive
              growth trajectory with opportunities for further expansion.
            </p>

          </div>


          {/* Key Metrics */}
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">

            <div className="card rounded-2xl p-6 shadow-md">

              <FaChartLine className="text-2xl text-blue-600" />

              <p className="mt-4 opacity-60">
                Revenue Growth
              </p>

              <h3 className="mt-2 text-3xl font-bold">
                +18.5%
              </h3>

            </div>


            <div className="card rounded-2xl p-6 shadow-md">

              <FaUsers className="text-2xl text-purple-600" />

              <p className="mt-4 opacity-60">
                Customer Growth
              </p>

              <h3 className="mt-2 text-3xl font-bold">
                +12.8%
              </h3>

            </div>


            <div className="card rounded-2xl p-6 shadow-md">

              <FaChartLine className="text-2xl text-green-600" />

              <p className="mt-4 opacity-60">
                Profit Growth
              </p>

              <h3 className="mt-2 text-3xl font-bold">
                +15.2%
              </h3>

            </div>

          </div>


          {/* Key Decisions */}
          <div className="card mt-6 rounded-2xl p-8 shadow-md">

            <div className="flex items-center gap-3">

              <FaListCheck className="text-2xl text-blue-600" />

              <h2 className="text-2xl font-semibold">
                Key Decisions
              </h2>

            </div>

            <ul className="mt-5 space-y-4">

              <li className="rounded-xl bg-slate-50 p-4">
                Increase investment in high-performing sales regions.
              </li>

              <li className="rounded-xl bg-slate-50 p-4">
                Focus on customer retention strategies to improve long-term
                revenue.
              </li>

              <li className="rounded-xl bg-slate-50 p-4">
                Expand marketing campaigns in regions showing strong growth
                potential.
              </li>

            </ul>

          </div>


          {/* Action Items */}
          <div className="card mt-6 rounded-2xl p-8 shadow-md">

            <h2 className="text-2xl font-semibold">
              Action Items
            </h2>

            <div className="mt-5 space-y-4">

              <div className="flex items-center justify-between rounded-xl border p-4">

                <div>

                  <p className="font-semibold">
                    Review regional sales performance
                  </p>

                  <p className="mt-1 text-sm opacity-60">
                    Owner: Sales Team
                  </p>

                </div>

                <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-700">
                  Pending
                </span>

              </div>


              <div className="flex items-center justify-between rounded-xl border p-4">

                <div>

                  <p className="font-semibold">
                    Create customer retention strategy
                  </p>

                  <p className="mt-1 text-sm opacity-60">
                    Owner: Marketing Team
                  </p>

                </div>

                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                  In Progress
                </span>

              </div>


              <div className="flex items-center justify-between rounded-xl border p-4">

                <div>

                  <p className="font-semibold">
                    Prepare next month sales forecast
                  </p>

                  <p className="mt-1 text-sm opacity-60">
                    Owner: Analytics Team
                  </p>

                </div>

                <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                  Completed
                </span>

              </div>

            </div>

          </div>


          {/* AI Recommendations */}
          <div className="card mt-6 rounded-2xl p-8 shadow-md">

            <div className="flex items-center gap-3">

              <FaLightbulb className="text-2xl text-orange-500" />

              <h2 className="text-2xl font-semibold">
                AI Recommendations
              </h2>

            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">

              <div className="rounded-xl bg-blue-50 p-5">

                <h3 className="font-semibold text-blue-700">
                  Improve Customer Retention
                </h3>

                <p className="mt-2 text-sm text-blue-600">
                  Introduce personalized offers and loyalty programs to
                  increase repeat purchases.
                </p>

              </div>


              <div className="rounded-xl bg-green-50 p-5">

                <h3 className="font-semibold text-green-700">
                  Expand High-Performing Regions
                </h3>

                <p className="mt-2 text-sm text-green-600">
                  Increase marketing investment in regions with consistently
                  strong sales performance.
                </p>

              </div>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}