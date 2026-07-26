"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "../../src/components/layout/Navbar";
import Sidebar from "../../src/components/layout/Sidebar";

import {
  FaUpload,
  FaRobot,
  FaFileCircleCheck,
} from "react-icons/fa6";

import {
  uploadDataset,
  generateAIReport,
} from "../../src/lib/api";

export default function AIGeneratorPage() {
  const router = useRouter();

  // ================================
  // Dataset Upload State
  // ================================

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [uploading, setUploading] =
    useState(false);

  const [uploadMessage, setUploadMessage] =
    useState("");

  const [uploadSuccess, setUploadSuccess] =
    useState(false);


  // ================================
  // AI Report State
  // ================================

  const [generatingReport, setGeneratingReport] =
    useState(false);

  const [reportMessage, setReportMessage] =
    useState("");

  const [reportSuccess, setReportSuccess] =
    useState(false);


  // ================================
  // AI Model State
  // ================================

  const [selectedModel, setSelectedModel] =
    useState("GPT-5.5");


  // ================================
  // Analysis Options
  // ================================

  const [analysisOptions, setAnalysisOptions] =
    useState({
      revenue: true,
      sales: true,
      customer: true,
      forecasting: true,
      risk: true,
      recommendations: true,
    });


  // ================================
  // File Selection
  // ================================

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (
      event.target.files &&
      event.target.files.length > 0
    ) {
      const file = event.target.files[0];

      setSelectedFile(file);

      setUploadMessage("");
      setUploadSuccess(false);

      setReportMessage("");
      setReportSuccess(false);
    }
  };


  // ================================
  // Upload Dataset
  // ================================

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadMessage(
        "Please select a dataset first."
      );

      setUploadSuccess(false);

      return;
    }

    try {
      setUploading(true);

      setUploadMessage("");
      setUploadSuccess(false);

      setReportMessage("");
      setReportSuccess(false);


      const result =
        await uploadDataset(selectedFile);


      console.log(
        "Dataset uploaded successfully:",
        result
      );


      setUploadMessage(
        "Dataset uploaded successfully! You can now generate your AI report."
      );

      setUploadSuccess(true);

    } catch (error) {
      console.error(
        "Dataset upload failed:",
        error
      );

      setUploadMessage(
        error instanceof Error
          ? error.message
          : "Failed to upload dataset."
      );

      setUploadSuccess(false);

    } finally {
      setUploading(false);
    }
  };


  // ================================
  // Generate AI Report
  // ================================

  const handleGenerateReport = async () => {
    if (!uploadSuccess) {
      setReportMessage(
        "Please upload a dataset before generating a report."
      );

      setReportSuccess(false);

      return;
    }

    try {
      setGeneratingReport(true);

      setReportMessage("");
      setReportSuccess(false);


      const request = {
        model: selectedModel,

        analysis_options: Object.entries(
          analysisOptions
        )
          .filter(
            ([, enabled]) => enabled
          )
          .map(
            ([option]) => option
          ),
      };


      console.log(
        "Generating AI report with:",
        request
      );


      const result =
        await generateAIReport(request);


      console.log(
        "AI report generated successfully:",
        result
      );


      setReportMessage(
        "AI report generated successfully!"
      );

      setReportSuccess(true);


      // Wait a little so the user can see
      // the success message before redirecting.
      setTimeout(() => {
        router.push("/reports");
      }, 1000);

    } catch (error) {
      console.error(
        "AI report generation failed:",
        error
      );

      setReportMessage(
        error instanceof Error
          ? error.message
          : "Failed to generate AI report."
      );

      setReportSuccess(false);

    } finally {
      setGeneratingReport(false);
    }
  };


  // ================================
  // Analysis Checkbox Handler
  // ================================

  const handleOptionChange = (
    option: keyof typeof analysisOptions
  ) => {
    setAnalysisOptions((previous) => ({
      ...previous,

      [option]:
        !previous[option],
    }));
  };


  // ================================
  // JSX
  // ================================

  return (
    <div className="flex min-h-screen">

      {/* Sidebar */}
      <Sidebar />


      {/* Main Application Area */}
      <div className="flex-1">

        {/* Navbar */}
        <Navbar />


        {/* Main Content */}
        <main className="min-h-screen bg-slate-100 p-8">


          {/* ================================
              Page Header
          ================================= */}

          <div className="mb-8">

            <h1 className="text-4xl font-bold text-slate-800">
              AI Report Generator
            </h1>

            <p className="mt-2 text-gray-600">
              Upload your dataset and generate
              AI-powered business insights.
            </p>

          </div>



          {/* ================================
              Upload Section
          ================================= */}

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



          {/* ================================
              Dataset Information
          ================================= */}

          <div className="mt-8 rounded-2xl bg-white p-8 shadow-md">

            <h2 className="mb-6 text-2xl font-semibold">
              Dataset Information
            </h2>


            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">


              {/* File Name */}

              <div>

                <p className="text-gray-500">
                  File Name
                </p>

                <h3 className="font-semibold">
                  {selectedFile
                    ? selectedFile.name
                    : "No file selected"}
                </h3>

              </div>



              {/* File Size */}

              <div>

                <p className="text-gray-500">
                  File Size
                </p>

                <h3 className="font-semibold">

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

              <div>

                <p className="text-gray-500">
                  Records
                </p>

                <h3 className="font-semibold">
                  {uploadSuccess
                    ? "Dataset Uploaded"
                    : "Pending Analysis"}
                </h3>

              </div>



              {/* Status */}

              <div>

                <p className="text-gray-500">
                  Status
                </p>

                <h3
                  className={`font-semibold ${
                    uploadSuccess
                      ? "text-green-600"
                      : selectedFile
                      ? "text-blue-600"
                      : "text-orange-500"
                  }`}
                >

                  {uploadSuccess
                    ? "Dataset Uploaded"
                    : selectedFile
                    ? "Ready for Upload"
                    : "Waiting for Upload"}

                </h3>

              </div>

            </div>

          </div>



          {/* ================================
              AI Model Selection
          ================================= */}

          <div className="mt-8 rounded-2xl bg-white p-8 shadow-md">

            <div className="mb-6 flex items-center gap-3">

              <FaRobot className="text-3xl text-blue-600" />

              <h2 className="text-2xl font-semibold">
                AI Model Selection
              </h2>

            </div>


            <select
              value={selectedModel}
              onChange={(event) =>
                setSelectedModel(
                  event.target.value
                )
              }
              className="w-full rounded-xl border p-4 outline-none focus:ring-2 focus:ring-blue-500"
            >

              <option value="GPT-5.5">
                GPT-5.5
              </option>

              <option value="GPT-4.1">
                GPT-4.1
              </option>

              <option value="Llama 4">
                Llama 4
              </option>

              <option value="Gemini">
                Gemini
              </option>

            </select>

          </div>



          {/* ================================
              Analysis Options
          ================================= */}

          <div className="mt-8 rounded-2xl bg-white p-8 shadow-md">

            <h2 className="mb-6 text-2xl font-semibold">
              Analysis Options
            </h2>


            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">


              <label className="flex items-center gap-3">

                <input
                  type="checkbox"
                  checked={
                    analysisOptions.revenue
                  }
                  onChange={() =>
                    handleOptionChange(
                      "revenue"
                    )
                  }
                />

                Revenue Analysis

              </label>



              <label className="flex items-center gap-3">

                <input
                  type="checkbox"
                  checked={
                    analysisOptions.sales
                  }
                  onChange={() =>
                    handleOptionChange(
                      "sales"
                    )
                  }
                />

                Sales Analysis

              </label>



              <label className="flex items-center gap-3">

                <input
                  type="checkbox"
                  checked={
                    analysisOptions.customer
                  }
                  onChange={() =>
                    handleOptionChange(
                      "customer"
                    )
                  }
                />

                Customer Insights

              </label>



              <label className="flex items-center gap-3">

                <input
                  type="checkbox"
                  checked={
                    analysisOptions.forecasting
                  }
                  onChange={() =>
                    handleOptionChange(
                      "forecasting"
                    )
                  }
                />

                Business Forecasting

              </label>



              <label className="flex items-center gap-3">

                <input
                  type="checkbox"
                  checked={
                    analysisOptions.risk
                  }
                  onChange={() =>
                    handleOptionChange(
                      "risk"
                    )
                  }
                />

                Risk Analysis

              </label>



              <label className="flex items-center gap-3">

                <input
                  type="checkbox"
                  checked={
                    analysisOptions.recommendations
                  }
                  onChange={() =>
                    handleOptionChange(
                      "recommendations"
                    )
                  }
                />

                AI Recommendations

              </label>

            </div>

          </div>



          {/* ================================
              Upload Status
          ================================= */}

          {uploadMessage && (

            <div
              className={`mt-6 rounded-xl p-4 text-center font-medium ${
                uploadSuccess
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >

              {uploadMessage}

            </div>

          )}



          {/* ================================
              Report Status
          ================================= */}

          {reportMessage && (

            <div
              className={`mt-6 rounded-xl p-4 text-center font-medium ${
                reportSuccess
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >

              {reportMessage}

            </div>

          )}



          {/* ================================
              Action Buttons
          ================================= */}

          <div className="mt-8 flex flex-col justify-end gap-4 sm:flex-row">


            {/* Upload Button */}

            <button
              disabled={
                !selectedFile ||
                uploading
              }
              onClick={
                handleUpload
              }
              className={`rounded-xl px-8 py-4 text-lg font-semibold text-white transition ${
                selectedFile &&
                !uploading
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "cursor-not-allowed bg-gray-400"
              }`}
            >

              {uploading
                ? "Uploading..."
                : "Upload Dataset"}

            </button>



            {/* Generate Report Button */}

            <button
              disabled={
                !uploadSuccess ||
                generatingReport
              }
              onClick={
                handleGenerateReport
              }
              className={`flex items-center justify-center gap-3 rounded-xl px-8 py-4 text-lg font-semibold text-white transition ${
                uploadSuccess &&
                !generatingReport
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "cursor-not-allowed bg-gray-400"
              }`}
            >

              <FaFileCircleCheck />

              {generatingReport
                ? "Generating Report..."
                : "Generate AI Report"}

            </button>

          </div>


        </main>

      </div>

    </div>
  );
}