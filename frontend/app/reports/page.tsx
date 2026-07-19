"use client";

import Navbar from "../../src/components/layout/Navbar";
import Sidebar from "../../src/components/layout/Sidebar";
import {
  FaDownload,
  FaEye,
  FaFilePdf,
  FaTrash,
} from "react-icons/fa";

const reports = [
  {
    id: 1,
    name: "Revenue Analysis",
    type: "PDF",
    date: "19 Jul 2026",
    status: "Completed",
  },
  {
    id: 2,
    name: "Sales Prediction",
    type: "PDF",
    date: "18 Jul 2026",
    status: "Completed",
  },
  {
    id: 3,
    name: "Customer Insights",
    type: "PDF",
    date: "17 Jul 2026",
    status: "Completed",
  },
];

export default function ReportsPage() {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <main className="min-h-screen bg-slate-100 p-8">

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-slate-800">
                Reports
              </h1>

              <p className="text-gray-500 mt-2">
                View and manage generated reports
              </p>
            </div>

            <button className="rounded-xl bg-blue-600 px-5 py-3 text-white hover:bg-blue-700">
              Generate Report
            </button>
          </div>

          <div className="rounded-2xl bg-white shadow-md overflow-hidden">

            <table className="w-full">

              <thead className="bg-gray-100">

                <tr>

                  <th className="p-4 text-left">Report</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>

                </tr>

              </thead>

              <tbody>

                {reports.map((report) => (

                  <tr
                    key={report.id}
                    className="border-b hover:bg-gray-50"
                  >

                    <td className="p-4 flex items-center gap-3">
                      <FaFilePdf className="text-red-500" />
                      {report.name}
                    </td>

                    <td className="text-center">
                      {report.type}
                    </td>

                    <td className="text-center">
                      {report.date}
                    </td>

                    <td className="text-center">
                      <span className="rounded-full bg-green-100 px-3 py-1 text-green-700">
                        {report.status}
                      </span>
                    </td>

                    <td className="flex justify-center gap-4 p-4">

                      <button>
                        <FaEye />
                      </button>

                      <button>
                        <FaDownload />
                      </button>

                      <button className="text-red-500">
                        <FaTrash />
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </main>

      </div>

    </div>
  );
}