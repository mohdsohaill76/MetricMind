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
        className="relative rounded-full p-2 hover:bg-gray-100 transition"
      >
        <FaBell className="text-xl text-gray-700" />

        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
          {notifications.length}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 rounded-xl border bg-white shadow-xl z-50">
          <div className="border-b p-4">
            <h2 className="font-semibold">Notifications</h2>
          </div>

          {notifications.map((item) => (
  <div
    key={item.id}
    className="cursor-pointer border-b p-4 hover:bg-gray-50 transition"
  >
    <p className="font-semibold">{item.title}</p>

    <p className="text-sm text-gray-600">
      {item.description}
    </p>

    <p className="mt-1 text-xs text-gray-400">
      {item.time}
    </p>
  </div>
))}

          <button className="w-full p-3 text-center text-blue-600 hover:bg-gray-100">
            View All
          </button>
        </div>
      )}
    </div>
  );
}