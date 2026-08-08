"use client";

import { useState } from "react";
import { FaBell } from "react-icons/fa";

const notifications = [
  {
    id: 1,
    title: "AI Report Generated",
    description: "Revenue_Report.pdf is ready",
    time: "2 min ago",
  },
  {
    id: 2,
    title: "Dataset Uploaded",
    description: "sales_data.csv uploaded successfully",
    time: "10 min ago",
  },
  {
    id: 3,
    title: "Weekly Analytics Ready",
    description: "Revenue increased by 18%",
    time: "Today",
  },
];
export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative rounded-full p-2 transition hover:bg-[var(--background)]"
      >
        <FaBell className="text-xl text-[var(--foreground)] opacity-80" />

        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
          {notifications.length}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-3 w-80 rounded-xl border border-[var(--border-color)] bg-[var(--card-background)] shadow-xl">
          <div className="border-b p-4">
            <h2 className="font-semibold">Notifications</h2>
          </div>

          {notifications.map((item) => (
  <div
    key={item.id}
    className="cursor-pointer border-b border-[var(--border-color)] p-4 transition hover:bg-[var(--background)]"
  >
    <p className="font-semibold">{item.title}</p>

    <p className="text-sm text-[var(--foreground)] opacity-75">
      {item.description}
    </p>

    <p className="mt-1 text-xs text-[var(--foreground)] opacity-50">
      {item.time}
    </p>
  </div>
))}

          <button className="w-full p-3 text-center text-blue-600 transition hover:bg-[var(--background)]">
            View All
          </button>
        </div>
      )}
    </div>
  );
}