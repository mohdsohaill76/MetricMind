"use client";

import { useState } from "react";
import Navbar from "../../src/components/layout/Navbar";
import Sidebar from "../../src/components/layout/Sidebar";
import Link from "next/link";
import {
  FaFileLines,
  FaDownload,
  FaEye,
  FaTrash,
  FaMagnifyingGlass,
} from "react-icons/fa6";

const reports = [
  {
    id: 1,
    title: "Monthly Business Performance",
    type: "Business Analysis",
    date: "July 20, 2026",
    status: "Completed",
  },
  {
    id: 2,
    title: "Revenue Growth Analysis",
    type: "Revenue",
    date: "July 18, 2026",
    status: "Completed",
  },
  {
    id: 3,
    title: "Customer Insights Report",
    type: "Customer",
    date: "July 15, 2026",
    status: "Completed",
  },
  {
    id: 4,
    title: "Sales Performance Report",
    type: "Sales",
    date: "July 12, 2026",
    status: "Completed",
  },
];

export default function ReportsPage() {
  const [search, setSearch] = useState("");

  const filteredReports = reports.filter((report) =>
    report.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen">

      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1">

        {/* Navbar */}
        <Navbar />

        <main className="min-h-screen bg-slate-100 p-8">

          {/* Header */}
          <div className="mb-8">

            <h1 className="text-4xl font-bold">
              Reports
            </h1>

            <p className="mt-2 opacity-70">
              View and manage your AI-generated business reports.
            </p>

          </div>


          {/* Search */}
          <div className="card mb-6 rounded-2xl p-5 shadow-md">

            <div className="relative max-w-xl">

              <FaMagnifyingGlass className="absolute left-4 top-4 text-gray-400" />

              <input
                type="text"
                placeholder="Search reports..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border bg-transparent py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

          </div>


          {/* Reports */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

            {filteredReports.map((report) => (

              <div
                key={report.id}
                className="card rounded-2xl p-6 shadow-md"
              >

                {/* Report Header */}
                <div className="flex items-start justify-between">

                  <div className="flex items-center gap-4">

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">

                      <FaFileLines className="text-xl text-blue-600" />

                    </div>

                    <div>

                      <h2 className="text-lg font-semibold">
                        {report.title}
                      </h2>

                      <p className="mt-1 text-sm opacity-60">
                        {report.type}
                      </p>

                    </div>

                  </div>


                  {/* Status */}
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">

                    {report.status}

                  </span>

                </div>


                {/* Date */}
                <div className="mt-6">

                  <p className="text-sm opacity-60">
                    Generated on
                  </p>

                  <p className="mt-1 font-medium">
                    {report.date}
                  </p>

                </div>


                {/* Actions */}
                <div className="mt-6 flex gap-3 border-t pt-5">

                  <Link
                    href={`/reports/${report.id}`}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    <FaEye />
                    View
                  </Link>

                  <button
                    className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-100"
                  >
                    <FaDownload />
                    Download
                  </button>

                  <button
                    className="ml-auto flex items-center gap-2 rounded-lg px-3 py-2 text-red-600 hover:bg-red-50"
                  >
                    <FaTrash />
                  </button>

                </div>

              </div>

            ))}

          </div>


          {/* No Results */}
          {filteredReports.length === 0 && (

            <div className="card mt-6 rounded-2xl p-10 text-center shadow-md">

              <FaFileLines className="mx-auto text-5xl opacity-30" />

              <h2 className="mt-4 text-xl font-semibold">
                No Reports Found
              </h2>

              <p className="mt-2 opacity-60">
                Try searching with a different report name.
              </p>

            </div>

          )}

        </main>

      </div>

    </div>
  );
}