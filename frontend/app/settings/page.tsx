"use client";

import { useState } from "react";

import Navbar from "../../src/components/layout/Navbar";
import Sidebar from "../../src/components/layout/Sidebar";

import {
  FaMoon,
  FaBell,
  FaLock,
  FaUser,
  FaEnvelope,
  FaFloppyDisk,
} from "react-icons/fa6";

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [dashboardNotifications, setDashboardNotifications] = useState(true);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSaveSettings = () => {
    alert("Settings saved successfully!");
  };

  const handlePasswordChange = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill in all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }

    alert("Password update will be connected to the backend later.");

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="flex min-h-screen">

      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1">

        {/* Navbar */}
        <Navbar />

        <main className="min-h-screen bg-slate-100 p-8">

          {/* Page Header */}
          <div className="mb-8">

            <h1 className="text-4xl font-bold text-slate-800">
              Settings
            </h1>

            <p className="mt-2 text-gray-600">
              Customize your MetricMind experience and manage your account.
            </p>

          </div>


          {/* Profile Settings */}
          <div className="rounded-2xl bg-white p-6 shadow-md">

            <div className="flex items-center gap-3">

              <FaUser className="text-2xl text-blue-600" />

              <div>
                <h2 className="text-xl font-semibold">
                  Profile Information
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Manage your personal information.
                </p>
              </div>

            </div>


            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">

              <div>

                <label className="mb-2 block font-medium">
                  Full Name
                </label>

                <input
                  type="text"
                  defaultValue="Admin"
                  className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>


              <div>

                <label className="mb-2 block font-medium">
                  Email Address
                </label>

                <div className="relative">

                  <FaEnvelope className="absolute left-4 top-4 text-gray-400" />

                  <input
                    type="email"
                    defaultValue="admin@metricmind.com"
                    className="w-full rounded-xl border px-4 py-3 pl-11 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                </div>

              </div>

            </div>

          </div>


          {/* Theme Settings */}
          <div className="mt-6 rounded-2xl bg-white p-6 shadow-md">

            <div className="flex items-center gap-3">

              <FaMoon className="text-2xl text-blue-600" />

              <div>

                <h2 className="text-xl font-semibold">
                  Appearance
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Change the appearance of your MetricMind dashboard.
                </p>

              </div>

            </div>


            <div className="mt-6 flex items-center justify-between rounded-xl border p-4">

              <div>

                <p className="font-medium">
                  Dark Mode
                </p>

                <p className="text-sm text-gray-500">
                  Switch between light and dark themes.
                </p>

              </div>

              <button
                onClick={() => {
                  document
                    .querySelector("button[aria-label='theme-toggle']")
                    ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
                }}
                aria-label="theme-toggle"
                className="rounded-xl bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700"
              >
                Toggle Theme
              </button>

            </div>

          </div>


          {/* Notification Settings */}
          <div className="mt-6 rounded-2xl bg-white p-6 shadow-md">

            <div className="flex items-center gap-3">

              <FaBell className="text-2xl text-blue-600" />

              <div>

                <h2 className="text-xl font-semibold">
                  Notifications
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Manage your email and dashboard notifications.
                </p>

              </div>

            </div>


            <div className="mt-6 space-y-5">

              {/* Email Notifications */}
              <div className="flex items-center justify-between">

                <div>

                  <p className="font-medium">
                    Email Notifications
                  </p>

                  <p className="text-sm text-gray-500">
                    Receive important updates through email.
                  </p>

                </div>

                <button
                  onClick={() =>
                    setEmailNotifications(!emailNotifications)
                  }
                  className={`relative h-6 w-11 rounded-full transition ${
                    emailNotifications
                      ? "bg-blue-600"
                      : "bg-gray-300"
                  }`}
                >

                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                      emailNotifications
                        ? "left-6"
                        : "left-1"
                    }`}
                  />

                </button>

              </div>


              {/* Dashboard Notifications */}
              <div className="flex items-center justify-between">

                <div>

                  <p className="font-medium">
                    Dashboard Notifications
                  </p>

                  <p className="text-sm text-gray-500">
                    Show notifications inside the dashboard.
                  </p>

                </div>

                <button
                  onClick={() =>
                    setDashboardNotifications(
                      !dashboardNotifications
                    )
                  }
                  className={`relative h-6 w-11 rounded-full transition ${
                    dashboardNotifications
                      ? "bg-blue-600"
                      : "bg-gray-300"
                  }`}
                >

                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                      dashboardNotifications
                        ? "left-6"
                        : "left-1"
                    }`}
                  />

                </button>

              </div>

            </div>

          </div>


          {/* Security Settings */}
          <div className="mt-6 rounded-2xl bg-white p-6 shadow-md">

            <div className="flex items-center gap-3">

              <FaLock className="text-2xl text-blue-600" />

              <div>

                <h2 className="text-xl font-semibold">
                  Security
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Change your password and manage account security.
                </p>

              </div>

            </div>


            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">

              <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) =>
                  setCurrentPassword(e.target.value)
                }
                className="rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
                className="rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                className="rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>


            <button
              onClick={handlePasswordChange}
              className="mt-5 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
            >
              Update Password
            </button>

          </div>


          {/* Save Settings */}
          <div className="mt-6 flex justify-end">

            <button
              onClick={handleSaveSettings}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white hover:bg-blue-700"
            >

              <FaFloppyDisk />

              Save Settings

            </button>

          </div>

        </main>

      </div>

    </div>
  );
}