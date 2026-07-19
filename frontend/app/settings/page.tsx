"use client";

import Navbar from "../../src/components/layout/Navbar";
import Sidebar from "../../src/components/layout/Sidebar";

export default function SettingsPage() {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <main className="min-h-screen bg-slate-100 p-8">

          <h1 className="text-4xl font-bold text-slate-800">
            Settings
          </h1>

          <p className="mt-2 text-gray-600">
            Customize your MetricMind experience.
          </p>

          <div className="mt-8 space-y-6">

            <div className="rounded-2xl bg-white p-6 shadow-md">
              <h2 className="text-xl font-semibold">
                Theme
              </h2>

              <p className="mt-2 text-gray-500">
                Switch between Light and Dark mode.
              </p>

              <button className="mt-5 rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700">
                Toggle Theme
              </button>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-md">
              <h2 className="text-xl font-semibold">
                Notifications
              </h2>

              <p className="mt-2 text-gray-500">
                Manage email and dashboard notifications.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-md">
              <h2 className="text-xl font-semibold">
                Security
              </h2>

              <p className="mt-2 text-gray-500">
                Change password and manage account security.
              </p>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}