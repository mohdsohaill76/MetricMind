"use client";

import { useEffect, useState } from "react";
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

import { getReports } from "../../src/lib/api";


// ========================================
// Report Type
// ========================================

interface Report {
  report_id: string;
  generated_at: string;
  status: string;
  dataset_quality?: string;
}


// ========================================
// Reports Page
// ========================================

export default function ReportsPage() {

  // Reports from backend
  const [reports, setReports] =
    useState<Report[]>([]);

  // Search
  const [search, setSearch] =
    useState("");

  // Loading
  const [loading, setLoading] =
    useState(true);

  // Error
  const [error, setError] =
    useState("");


  // ========================================
  // Fetch Reports
  // ========================================

  useEffect(() => {

    async function loadReports() {

      try {

        setLoading(true);
        setError("");

        const data = await getReports();

        console.log(
          "Reports from backend:",
          data
        );

        // Backend response is expected to be:
        //
        // {
        //   count: number,
        //   reports: [...]
        // }

        setReports(
          data.reports || []
        );

      } catch (err) {

        console.error(
          "Failed to load reports:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load reports."
        );

      } finally {

        setLoading(false);

      }

    }

    loadReports();

  }, []);


  // ========================================
  // Search Reports
  // ========================================

  const filteredReports =
    reports.filter((report) => {

      const searchText =
        search.toLowerCase();

      return (
        report.report_id
          .toLowerCase()
          .includes(searchText) ||
        report.status
          .toLowerCase()
          .includes(searchText) ||
        (
          report.dataset_quality || ""
        )
          .toLowerCase()
          .includes(searchText)
      );

    });


  // ========================================
  // Format Date
  // ========================================

  const formatDate = (
    dateString: string
  ) => {

    if (!dateString) {
      return "Unknown";
    }

    const date =
      new Date(dateString);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return dateString;
    }

    return date.toLocaleString(
      "en-IN",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );

  };


  // ========================================
  // Render
  // ========================================

  return (

    <div className="flex min-h-screen">

      {/* Sidebar */}
      <Sidebar />


      {/* Main Application Area */}
      <div className="flex-1">

        {/* Navbar */}
        <Navbar />


        <main className="min-h-screen bg-slate-100 p-8">


          {/* ========================================
              Header
          ========================================= */}

          <div className="mb-8">

            <h1 className="text-4xl font-bold">
              Reports
            </h1>

            <p className="mt-2 opacity-70">
              View and manage your AI-generated
              business reports.
            </p>

          </div>



          {/* ========================================
              Search
          ========================================= */}

          <div className="card mb-6 rounded-2xl p-5 shadow-md">

            <div className="relative max-w-xl">

              <FaMagnifyingGlass
                className="absolute left-4 top-4 text-gray-400"
              />


              <input
                type="text"
                placeholder="Search reports..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                className="w-full rounded-xl border bg-transparent py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

          </div>



          {/* ========================================
              Loading
          ========================================= */}

          {loading && (

            <div className="card rounded-2xl p-10 text-center shadow-md">

              <p className="text-lg">
                Loading reports...
              </p>

            </div>

          )}



          {/* ========================================
              Error
          ========================================= */}

          {!loading && error && (

            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">

              <h2 className="font-semibold text-red-700">
                Unable to load reports
              </h2>

              <p className="mt-2 text-red-600">
                {error}
              </p>

            </div>

          )}



          {/* ========================================
              Reports
          ========================================= */}

          {!loading &&
            !error &&
            filteredReports.length > 0 && (

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                {filteredReports.map(
                  (report) => (

                    <div
                      key={
                        report.report_id
                      }
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

                              AI Business Report

                            </h2>

                            <p className="mt-1 text-sm opacity-60">

                              Report ID:{" "}

                              {report.report_id}

                            </p>

                          </div>

                        </div>


                        {/* Status */}

                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">

                          {report.status}

                        </span>

                      </div>



                      {/* Dataset Quality */}

                      <div className="mt-6">

                        <p className="text-sm opacity-60">
                          Dataset Quality
                        </p>

                        <p className="mt-1 font-medium">

                          {report.dataset_quality ||
                            "Not available"}

                        </p>

                      </div>



                      {/* Generated Date */}

                      <div className="mt-4">

                        <p className="text-sm opacity-60">
                          Generated on
                        </p>

                        <p className="mt-1 font-medium">

                          {formatDate(
                            report.generated_at
                          )}

                        </p>

                      </div>



                      {/* Actions */}

                      <div className="mt-6 flex gap-3 border-t pt-5">


                        {/* View */}

                        <Link
                          href={`/reports/${report.report_id}`}
                          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >

                          <FaEye />

                          View

                        </Link>



                        {/* Download */}

                        <button
                          type="button"
                          className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-100"
                        >

                          <FaDownload />

                          Download

                        </button>



                        {/* Delete */}

                        <button
                          type="button"
                          className="ml-auto flex items-center gap-2 rounded-lg px-3 py-2 text-red-600 hover:bg-red-50"
                        >

                          <FaTrash />

                        </button>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}



          {/* ========================================
              No Reports
          ========================================= */}

          {!loading &&
            !error &&
            filteredReports.length === 0 && (

              <div className="card mt-6 rounded-2xl p-10 text-center shadow-md">

                <FaFileLines className="mx-auto text-5xl opacity-30" />


                <h2 className="mt-4 text-xl font-semibold">

                  No Reports Found

                </h2>


                <p className="mt-2 opacity-60">

                  {reports.length === 0
                    ? "Generate an AI report from the AI Generator page."
                    : "Try searching with a different report name."}

                </p>

              </div>

            )}

        </main>

      </div>

    </div>

  );

}