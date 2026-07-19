"use client";

import { useState } from "react";
import {
  FaUser,
  FaCog,
  FaMoon,
  FaSun,
  FaSignOutAlt,
  FaChevronDown,
} from "react-icons/fa";
import Link from "next/link";
import { useTheme } from "next-themes";

export default function ProfileDropdown() {
  const [open, setOpen] = useState(false);

  const { theme, setTheme } = useTheme();

  return (
    <div className="relative">
      {/* Profile Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-gray-100 dark:hover:bg-slate-800"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
          A
        </div>

        <div className="text-left">
          <p className="font-semibold dark:text-white">
            Admin
          </p>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Administrator
          </p>
        </div>

        <FaChevronDown className="text-gray-500 dark:text-gray-300" />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 z-50 mt-3 w-64 rounded-xl border bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">

          {/* Header */}
          <div className="border-b p-4 dark:border-slate-700">
            <p className="text-lg font-semibold dark:text-white">
              Welcome Admin 👋
            </p>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              admin@metricmind.com
            </p>
          </div>

          {/* My Profile */}
          <Link
            href="/profile"
            className="flex w-full items-center gap-3 p-4 transition hover:bg-gray-50 dark:text-white dark:hover:bg-slate-800"
          >
            <FaUser />
            My Profile
          </Link>

          {/* Settings */}
          <Link
            href="/settings"
            className="flex w-full items-center gap-3 p-4 transition hover:bg-gray-50 dark:text-white dark:hover:bg-slate-800"
          >
            <FaCog />
            Settings
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={() =>
              setTheme(theme === "dark" ? "light" : "dark")
            }
            className="flex w-full items-center gap-3 p-4 transition hover:bg-gray-50 dark:text-white dark:hover:bg-slate-800"
          >
            {theme === "dark" ? <FaSun /> : <FaMoon />}

            {theme === "dark"
              ? "Light Mode"
              : "Dark Mode"}
          </button>

          {/* Logout */}
          <button
            onClick={() => {
              if (confirm("Are you sure you want to logout?")) {
                alert("Logout functionality will be connected to backend.");
              }
            }}
            className="flex w-full items-center gap-3 p-4 text-red-600 transition hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <FaSignOutAlt />
            Logout
          </button>

        </div>
      )}
    </div>
  );
}