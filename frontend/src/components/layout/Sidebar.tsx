"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  FaChartPie,
  FaChartLine,
  FaRobot,
  FaFileAlt,
  FaUser,
  FaCog,
} from "react-icons/fa";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: <FaChartPie />,
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: <FaChartLine />,
    },
    {
      name: "AI Generator",
      href: "/ai-generator",
      icon: <FaRobot />,
    },
    {
      name: "Reports",
      href: "/reports",
      icon: <FaFileAlt />,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: <FaUser />,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: <FaCog />,
    },
  ];

  return (
    <aside className="min-h-screen w-64 bg-slate-900 text-white shadow-lg">

      {/* Logo */}
      <div className="border-b border-slate-700 p-6">
        <h1 className="text-3xl font-bold text-blue-400">
          MetricMind
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          AI Business Analytics
        </p>
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-4">

        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`mb-2 flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 ${
              pathname === item.href
                ? "bg-blue-600 text-white shadow-md"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <span className="text-lg">{item.icon}</span>

            <span>{item.name}</span>
          </Link>
        ))}

      </nav>

      {/* Footer */}
      <div className="absolute bottom-6 w-64 px-6">
        <div className="rounded-xl bg-slate-800 p-4">

          <h3 className="font-semibold text-blue-400">
            MetricMind
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            Version 1.0.0
          </p>

        </div>
      </div>

    </aside>
  );
}