"use client";

import { useState } from "react";
import Navbar from "../../src/components/layout/Navbar";
import Sidebar from "../../src/components/layout/Sidebar";
import { FaUpload, FaRobot } from "react-icons/fa6";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000/api/v1";

interface UploadResult {
  filename: string;
  rows: number;
  columns: number;
  column_names: string[];
  preview: Record<string, unknown>[];
  profile: {
    shape: {
      rows: number;
      columns: number;
    };
    missing_values: Record<string, number>;
    missing_percentage: Record<string, number>;
    dtypes: Record<string, string>;
    numeric_columns: string[];
    categorical_columns: string[];
    unique_values: Record<string, number>;
    duplicate_rows: number;
    memory_usage_bytes: number;
    numeric_summary: Record<
      string,
      Record<string, number>
    >;
  };
}

export default function AIGeneratorPage() {
  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [uploadResult, setUploadResult] =
    useState<UploadResult | null>(null);

  const [uploading, setUploading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setSelectedFile(file);
    setUploadResult(null);
    setError("");

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Please select a CSV file.");
      return;
    }

    const formData = new FormData();

    formData.append("file", file);

    setUploading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData =
          await response.json().catch(() => null);

        throw new Error(
          errorData?.detail ||
            "Failed to upload dataset."
        );
      }

      const data: UploadResult =
        await response.json();

      setUploadResult(data);

    } catch (error) {
      console.error("Upload error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to upload dataset."
      );

      setUploadResult(null);

    } finally {
      setUploading(false);
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
                Upload Your Dataset
              </h3>

              <p className="mt-2 text-gray-500">
                CSV files supported
              </p>

              <span className="mt-8 rounded-xl bg-blue-600 px-6 py-3 text-white hover:bg-blue-700">
                {uploading
                  ? "Uploading..."
                  : "Choose File"}
              </span>

              <input
                id="file-upload"
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileChange}
                disabled={uploading}
              />
            </label>

            {/* Error Message */}
            {error && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
                {error}
              </div>
            )}

            {/* Success Message */}
            {uploadResult && (
              <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
                Dataset uploaded and analyzed successfully.
              </div>
            )}

          </div>

          {/* Dataset Information */}
          <div className="mt-8 rounded-2xl bg-white p-8 shadow-md">

            <h2 className="mb-6 text-2xl font-semibold text-slate-800">
              Dataset Information
            </h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

              {/* File Name */}
              <div className="rounded-xl bg-slate-50 p-5">
                <p className="text-sm text-gray-500">
                  File Name
                </p>

                <h3 className="mt-2 break-all font-semibold text-slate-800">
                  {uploadResult
                    ? uploadResult.filename
                    : selectedFile
                    ? selectedFile.name
                    : "--"}
                </h3>
              </div>

              {/* File Size */}
              <div className="rounded-xl bg-slate-50 p-5">
                <p className="text-sm text-gray-500">
                  File Size
                </p>

                <h3 className="mt-2 font-semibold text-slate-800">
                  {selectedFile
                    ? `${(
                        selectedFile.size /
                        1024 /
                        1024
                      ).toFixed(2)} MB`
                    : "--"}
                </h3>
              </div>

              {/* Records */}
              <div className="rounded-xl bg-slate-50 p-5">
                <p className="text-sm text-gray-500">
                  Records
                </p>

                <h3 className="mt-2 font-semibold text-slate-800">
                  {uploadResult
                    ? uploadResult.rows
                    : "--"}
                </h3>
              </div>

              {/* Columns */}
              <div className="rounded-xl bg-slate-50 p-5">
                <p className="text-sm text-gray-500">
                  Columns
                </p>

                <h3 className="mt-2 font-semibold text-slate-800">
                  {uploadResult
                    ? uploadResult.columns
                    : "--"}
                </h3>
              </div>

              {/* Missing Values */}
              <div className="rounded-xl bg-slate-50 p-5">
                <p className="text-sm text-gray-500">
                  Missing Values
                </p>

                <h3 className="mt-2 font-semibold text-slate-800">
                  {uploadResult
                    ? Object.values(
                        uploadResult.profile
                          .missing_values
                      ).reduce(
                        (total, value) =>
                          total + value,
                        0
                      )
                    : "--"}
                </h3>
              </div>

              {/* Duplicate Rows */}
              <div className="rounded-xl bg-slate-50 p-5">
                <p className="text-sm text-gray-500">
                  Duplicate Rows
                </p>

                <h3 className="mt-2 font-semibold text-slate-800">
                  {uploadResult
                    ? uploadResult.profile
                        .duplicate_rows
                    : "--"}
                </h3>
              </div>

            </div>

            {/* Dataset Status */}
            <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-5">

              <p className="text-sm text-gray-500">
                Dataset Status
              </p>

              <h3 className="mt-1 font-semibold text-blue-700">
                {uploadResult
                  ? "Uploaded Successfully"
                  : selectedFile
                  ? "Processing..."
                  : "Waiting for Upload"}
              </h3>

            </div>

          </div>

          {/* Column Analysis */}
          {uploadResult && (
            <div className="mt-8 rounded-2xl bg-white p-8 shadow-md">

              <h2 className="mb-6 text-2xl font-semibold text-slate-800">
                Column Analysis
              </h2>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                {/* Numeric Columns */}
                <div className="rounded-xl border border-blue-100 bg-blue-50 p-6">

                  <h3 className="mb-3 font-semibold text-blue-700">
                    Numeric Columns
                  </h3>

                  {uploadResult.profile
                    .numeric_columns.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {uploadResult.profile.numeric_columns.map(
                        (column) => (
                          <span
                            key={column}
                            className="rounded-lg bg-blue-600 px-3 py-1 text-sm text-white"
                          >
                            {column}
                          </span>
                        )
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      No numeric columns found.
                    </p>
                  )}

                </div>

                {/* Categorical Columns */}
                <div className="rounded-xl border border-purple-100 bg-purple-50 p-6">

                  <h3 className="mb-3 font-semibold text-purple-700">
                    Categorical Columns
                  </h3>

                  {uploadResult.profile
                    .categorical_columns.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {uploadResult.profile.categorical_columns.map(
                        (column) => (
                          <span
                            key={column}
                            className="rounded-lg bg-purple-600 px-3 py-1 text-sm text-white"
                          >
                            {column}
                          </span>
                        )
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      No categorical columns found.
                    </p>
                  )}

                </div>

              </div>

            </div>
          )}

          {/* Data Preview */}
          {uploadResult &&
            uploadResult.preview.length > 0 && (
              <div className="mt-8 rounded-2xl bg-white p-8 shadow-md">

                <h2 className="mb-6 text-2xl font-semibold text-slate-800">
                  Dataset Preview
                </h2>

                <div className="overflow-x-auto rounded-xl border">

                  <table className="min-w-full text-left text-sm">

                    <thead className="bg-slate-100">
                      <tr>
                        {uploadResult.column_names.map(
                          (column) => (
                            <th
                              key={column}
                              className="whitespace-nowrap px-5 py-4 font-semibold text-slate-700"
                            >
                              {column}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>

                    <tbody>
                      {uploadResult.preview.map(
                        (row, index) => (
                          <tr
                            key={index}
                            className="border-t hover:bg-slate-50"
                          >
                            {uploadResult.column_names.map(
                              (column) => (
                                <td
                                  key={column}
                                  className="whitespace-nowrap px-5 py-4 text-gray-600"
                                >
                                  {String(
                                    row[column] ?? "--"
                                  )}
                                </td>
                              )
                            )}
                          </tr>
                        )
                      )}
                    </tbody>

                  </table>

                </div>

              </div>
            )}

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
              disabled={!uploadResult}
              className={`rounded-xl px-8 py-4 text-lg font-semibold text-white transition ${
                uploadResult
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