"use client";

import Navbar from "../../src/components/layout/Navbar";
import Sidebar from "../../src/components/layout/Sidebar";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaUserGraduate,
  FaBriefcase,
} from "react-icons/fa";

export default function ProfilePage() {
  return (
    <div className="flex">

      <Sidebar />

      <div className="flex-1">

        <Navbar />

        <main className="min-h-screen bg-slate-100 p-8">

          <h1 className="mb-8 text-4xl font-bold text-slate-800">
            My Profile
          </h1>

          <div className="rounded-2xl bg-white p-8 shadow-md">

            <div className="flex flex-col items-center gap-6 md:flex-row">

              <div className="flex h-32 w-32 items-center justify-center rounded-full bg-blue-600 text-5xl font-bold text-white">
                A
              </div>

              <div>

                <h2 className="text-3xl font-bold">
                  Admin User
                </h2>

                <p className="text-gray-500">
                  AI Analytics Administrator
                </p>

              </div>

            </div>

            <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">

              <div className="space-y-5">

                <div className="flex items-center gap-4">
                  <FaEnvelope className="text-blue-600" />
                  <span>admin@metricmind.com</span>
                </div>

                <div className="flex items-center gap-4">
                  <FaPhone className="text-blue-600" />
                  <span>+91 9876543210</span>
                </div>

                <div className="flex items-center gap-4">
                  <FaMapMarkerAlt className="text-blue-600" />
                  <span>Bangalore, India</span>
                </div>

              </div>

              <div className="space-y-5">

                <div className="flex items-center gap-4">
                  <FaBriefcase className="text-blue-600" />
                  <span>Administrator</span>
                </div>

                <div className="flex items-center gap-4">
                  <FaUserGraduate className="text-blue-600" />
                  <span>MetricMind Team</span>
                </div>

              </div>

            </div>

            <button className="mt-10 rounded-xl bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700">
              Edit Profile
            </button>

          </div>

        </main>

      </div>

    </div>
  );
}