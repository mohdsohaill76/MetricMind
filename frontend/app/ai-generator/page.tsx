"use client";

import { useState } from "react";
import Navbar from "../../src/components/layout/Navbar";
import Sidebar from "../../src/components/layout/Sidebar";
import { FaUpload, FaRobot } from "react-icons/fa6";

export default function AIGeneratorPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <main className="min-h-screen bg-slate-100 p-8">

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-800">
              AI Report Generator
            </h1>

            <p className="mt-2 text-gray-600">
              Upload your dataset and generate AI-powered business insights.
            </p>
          </div>

          {/* Upload Section */}
          <div className="rounded-2xl bg-white p-8 shadow-md">

            <h2 className="mb-6 text-2xl font-semibold">
              Upload Dataset
            </h2>

            <label
              htmlFor="file-upload"
              className="flex h-64 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-blue-400 transition hover:bg-blue-50"
            >
              <FaUpload className="mb-5 text-6xl text-blue-600" />

              <h3 className="text-2xl font-semibold">
                Drag & Drop Dataset
              </h3>

              <p className="mt-2 text-gray-500">
                CSV • XLSX • JSON Supported
              </p>

              <span className="mt-8 rounded-xl bg-blue-600 px-6 py-3 text-white hover:bg-blue-700">
                Choose File
              </span>

              <input
                id="file-upload"
                type="file"
                accept=".csv,.xlsx,.xls,.json"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

          </div>

          {/* Dataset Information */}
          <div className="mt-8 rounded-2xl bg-white p-8 shadow-md">

            <h2 className="mb-6 text-2xl font-semibold">
              Dataset Information
            </h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

              <div>
                <p className="text-gray-500">File Name</p>
                <h3 className="font-semibold">
                  {selectedFile ? selectedFile.name : "No file selected"}
                </h3>
              </div>

              <div>
                <p className="text-gray-500">File Size</p>
                <h3 className="font-semibold">
                  {selectedFile
                    ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`
                    : "--"}
                </h3>
              </div>

              <div>
                <p className="text-gray-500">Records</p>
                <h3 className="font-semibold">
                  Pending Analysis
                </h3>
              </div>

              <div>
                <p className="text-gray-500">Status</p>
                <h3
                  className={`font-semibold ${
                    selectedFile
                      ? "text-green-600"
                      : "text-orange-500"
                  }`}
                >
                  {selectedFile
                    ? "Ready for Analysis"
                    : "Waiting for Upload"}
                </h3>
              </div>

            </div>

          </div>

          {/* AI Model Selection */}
          <div className="mt-8 rounded-2xl bg-white p-8 shadow-md">

            <div className="mb-6 flex items-center gap-3">
              <FaRobot className="text-3xl text-blue-600" />

              <h2 className="text-2xl font-semibold">
                AI Model Selection
              </h2>
            </div>

            <select className="w-full rounded-xl border p-4 outline-none">

              <option>GPT-5.5</option>
              <option>GPT-4.1</option>
              <option>Llama 4</option>
              <option>Gemini</option>

            </select>

          </div>

          {/* Analysis Options */}
          <div className="mt-8 rounded-2xl bg-white p-8 shadow-md">

            <h2 className="mb-6 text-2xl font-semibold">
              Analysis Options
            </h2>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              <label className="flex items-center gap-3">
                <input type="checkbox" />
                Revenue Analysis
              </label>

              <label className="flex items-center gap-3">
                <input type="checkbox" />
                Sales Analysis
              </label>

              <label className="flex items-center gap-3">
                <input type="checkbox" />
                Customer Insights
              </label>

              <label className="flex items-center gap-3">
                <input type="checkbox" />
                Business Forecasting
              </label>

              <label className="flex items-center gap-3">
                <input type="checkbox" />
                Risk Analysis
              </label>

              <label className="flex items-center gap-3">
                <input type="checkbox" />
                AI Recommendations
              </label>

            </div>

          </div>

          {/* Generate Button */}
          <div className="mt-8 flex justify-end">

            <button
              disabled={!selectedFile}
              className={`rounded-xl px-8 py-4 text-lg font-semibold text-white transition ${
                selectedFile
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "cursor-not-allowed bg-gray-400"
              }`}
            >
              Generate AI Report
            </button>

          </div>

        </main>
      </div>
    </div>
  );
}