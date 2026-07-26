"use client";

import { useState } from "react";
import Navbar from "../../src/components/layout/Navbar";
import Sidebar from "../../src/components/layout/Sidebar";

import {
  FaUser,
  FaEnvelope,
  FaMoon,
  FaBell,
  FaLock,
  FaShieldAlt,
  FaSave,
  FaChevronRight,
} from "react-icons/fa";

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [dashboardNotifications, setDashboardNotifications] = useState(true);

  const [fullName, setFullName] = useState("Admin");
  const [email, setEmail] = useState("admin@metricmind.com");

  const handleSaveProfile = () => {
    alert("Profile saved successfully!");
  };

  const handleChangePassword = () => {
    alert("Password functionality will be connected to the backend.");
  };

  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex min-w-0 flex-1 flex-col">

        <Navbar />

        <main className="flex-1 p-5 sm:p-7 lg:p-10">

          {/* ================= HEADER ================= */}

          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <div className="mb-2 flex items-center gap-2 text-sm text-blue-600">
                <span>Dashboard</span>
                <FaChevronRight className="text-xs" />
                <span className="text-slate-400">Settings</span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Settings
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-slate-500 sm:text-base">
                Manage your profile, preferences, notifications, and account
                security from one place.
              </p>
            </div>

            {/* Status */}
            <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Account Active
            </div>

          </div>


          {/* ================= PROFILE ================= */}

          <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* Section Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-lg text-white shadow-sm">
                  <FaUser />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Profile Information
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Update your personal account information.
                  </p>
                </div>

              </div>

              <span className="hidden rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 sm:block">
                Account
              </span>

            </div>


            {/* Content */}
            <div className="p-6">

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                {/* Full Name */}
                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Full Name
                  </label>

                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                  />

                </div>


                {/* Email */}
                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Email Address
                  </label>

                  <div className="relative">

                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                    />

                  </div>

                </div>

              </div>


              <div className="mt-6 flex justify-end">

                <button
                  onClick={handleSaveProfile}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md"
                >
                  <FaSave />
                  Save Changes
                </button>

              </div>

            </div>

          </section>


          {/* ================= TWO COLUMN SETTINGS ================= */}

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">


            {/* ================= APPEARANCE ================= */}

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="border-b border-slate-100 px-6 py-5">

                <div className="flex items-center gap-4">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <FaMoon />
                  </div>

                  <div>
                    <h2 className="font-semibold text-slate-900">
                      Appearance
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Customize your dashboard theme.
                    </p>
                  </div>

                </div>

              </div>


              <div className="p-6">

                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-5">

                  <div>

                    <h3 className="font-semibold text-slate-800">
                      Dark Mode
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Switch between light and dark themes.
                    </p>

                  </div>

                  <button
                    onClick={() => {
                      document.documentElement.classList.toggle("dark");
                    }}
                    className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
                  >
                    Toggle
                  </button>

                </div>

              </div>

            </section>


            {/* ================= SECURITY ================= */}

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="border-b border-slate-100 px-6 py-5">

                <div className="flex items-center gap-4">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <FaShieldAlt />
                  </div>

                  <div>
                    <h2 className="font-semibold text-slate-900">
                      Security
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Protect your account and manage access.
                    </p>
                  </div>

                </div>

              </div>


              <div className="p-6">

                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-5">

                  <div className="flex items-center gap-4">

                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm">
                      <FaLock />
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-800">
                        Password
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Keep your account secure.
                      </p>
                    </div>

                  </div>

                  <button
                    onClick={handleChangePassword}
                    className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-500 hover:text-blue-600"
                  >
                    Change
                  </button>

                </div>

              </div>

            </section>


            {/* ================= NOTIFICATIONS ================= */}

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-2">

              <div className="border-b border-slate-100 px-6 py-5">

                <div className="flex items-center gap-4">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
                    <FaBell />
                  </div>

                  <div>
                    <h2 className="font-semibold text-slate-900">
                      Notifications
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Control how MetricMind keeps you informed.
                    </p>
                  </div>

                </div>

              </div>


              <div className="grid grid-cols-1 gap-4 p-6 lg:grid-cols-2">

                {/* Email Notification */}
                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-5">

                  <div>

                    <h3 className="font-semibold text-slate-800">
                      Email Notifications
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Receive important updates through email.
                    </p>

                  </div>

                  <button
                    onClick={() =>
                      setEmailNotifications(!emailNotifications)
                    }
                    className={`relative h-7 w-12 rounded-full transition ${
                      emailNotifications
                        ? "bg-blue-600"
                        : "bg-slate-300"
                    }`}
                  >

                    <span
                      className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
                        emailNotifications
                          ? "left-6"
                          : "left-1"
                      }`}
                    />

                  </button>

                </div>


                {/* Dashboard Notification */}
                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-5">

                  <div>

                    <h3 className="font-semibold text-slate-800">
                      Dashboard Notifications
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Show important alerts inside your dashboard.
                    </p>

                  </div>

                  <button
                    onClick={() =>
                      setDashboardNotifications(
                        !dashboardNotifications
                      )
                    }
                    className={`relative h-7 w-12 rounded-full transition ${
                      dashboardNotifications
                        ? "bg-blue-600"
                        : "bg-slate-300"
                    }`}
                  >

                    <span
                      className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
                        dashboardNotifications
                          ? "left-6"
                          : "left-1"
                      }`}
                    />

                  </button>

                </div>

              </div>

            </section>

          </div>


          {/* ================= FOOTER NOTE ================= */}

          <div className="mt-6 flex items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white/60 p-4 text-center text-sm text-slate-500">

            Your settings will be securely synchronized with your MetricMind
            account once the backend API is connected.

          </div>

        </main>

      </div>

    </div>
  );
}