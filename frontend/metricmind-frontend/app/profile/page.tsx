"use client";

import { useState } from "react";

import Navbar from "../../src/components/layout/Navbar";
import Sidebar from "../../src/components/layout/Sidebar";

import {
  FaUser,
  FaEnvelope,
  FaBriefcase,
  FaCalendar,
  FaPen,
  FaLock,
} from "react-icons/fa6";

export default function ProfilePage() {
  const [editing, setEditing] = useState(false);

  const [name, setName] = useState("Admin");
  const [email, setEmail] = useState("admin@metricmind.com");

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

            <h1 className="text-4xl font-bold text-slate-800">
              My Profile
            </h1>

            <p className="mt-2 text-gray-600">
              View and manage your MetricMind account information.
            </p>

          </div>


          {/* Profile Card */}
          <div className="rounded-2xl bg-white p-8 shadow-md">

            <div className="flex flex-col gap-8 md:flex-row md:items-center">

              {/* Avatar */}
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-blue-600 text-5xl font-bold text-white">
                A
              </div>


              {/* Profile Info */}
              <div>

                <h2 className="text-3xl font-bold">
                  {name}
                </h2>

                <p className="mt-2 text-gray-500">
                  Administrator
                </p>

                <p className="mt-1 text-gray-500">
                  admin@metricmind.com
                </p>

              </div>

            </div>

          </div>


          {/* Personal Information */}
          <div className="mt-6 rounded-2xl bg-white p-8 shadow-md">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <FaUser className="text-2xl text-blue-600" />

                <h2 className="text-2xl font-semibold">
                  Personal Information
                </h2>

              </div>


              <button
                onClick={() => setEditing(!editing)}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
              >
                <FaPen />

                {editing ? "Cancel" : "Edit Profile"}
              </button>

            </div>


            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">

              {/* Full Name */}
              <div>

                <label className="mb-2 block font-medium">
                  Full Name
                </label>

                <div className="relative">

                  <FaUser className="absolute left-4 top-4 text-gray-400" />

                  <input
                    type="text"
                    value={name}
                    disabled={!editing}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border px-4 py-3 pl-11 outline-none disabled:bg-gray-100 focus:ring-2 focus:ring-blue-500"
                  />

                </div>

              </div>


              {/* Email */}
              <div>

                <label className="mb-2 block font-medium">
                  Email Address
                </label>

                <div className="relative">

                  <FaEnvelope className="absolute left-4 top-4 text-gray-400" />

                  <input
                    type="email"
                    value={email}
                    disabled={!editing}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border px-4 py-3 pl-11 outline-none disabled:bg-gray-100 focus:ring-2 focus:ring-blue-500"
                  />

                </div>

              </div>

            </div>


            {/* Save Button */}
            {editing && (
              <button
                onClick={() => {
                  setEditing(false);
                  alert("Profile updated successfully!");
                }}
                className="mt-6 rounded-xl bg-green-600 px-6 py-3 font-medium text-white hover:bg-green-700"
              >
                Save Changes
              </button>
            )}

          </div>


          {/* Account Information */}
          <div className="mt-6 rounded-2xl bg-white p-8 shadow-md">

            <h2 className="text-2xl font-semibold">
              Account Information
            </h2>


            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">

              {/* Role */}
              <div className="rounded-xl border p-5">

                <FaBriefcase className="text-2xl text-blue-600" />

                <p className="mt-4 text-sm text-gray-500">
                  Role
                </p>

                <p className="mt-1 font-semibold">
                  Administrator
                </p>

              </div>


              {/* Account Type */}
              <div className="rounded-xl border p-5">

                <FaUser className="text-2xl text-purple-600" />

                <p className="mt-4 text-sm text-gray-500">
                  Account Type
                </p>

                <p className="mt-1 font-semibold">
                  Admin Account
                </p>

              </div>


              {/* Joined */}
              <div className="rounded-xl border p-5">

                <FaCalendar className="text-2xl text-green-600" />

                <p className="mt-4 text-sm text-gray-500">
                  Member Since
                </p>

                <p className="mt-1 font-semibold">
                  January 2026
                </p>

              </div>

            </div>

          </div>


          {/* Security */}
          <div className="mt-6 rounded-2xl bg-white p-8 shadow-md">

            <div className="flex items-center gap-3">

              <FaLock className="text-2xl text-blue-600" />

              <div>

                <h2 className="text-2xl font-semibold">
                  Account Security
                </h2>

                <p className="mt-1 text-gray-500">
                  Manage your password and account security.
                </p>

              </div>

            </div>


            <button
              onClick={() =>
                alert(
                  "Password change functionality will be connected to the backend."
                )
              }
              className="mt-6 rounded-xl border border-blue-600 px-6 py-3 font-medium text-blue-600 hover:bg-blue-50"
            >
              Change Password
            </button>

          </div>

        </main>

      </div>

    </div>
  );
}