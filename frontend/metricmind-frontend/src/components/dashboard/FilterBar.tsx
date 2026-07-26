"use client";

import { useState } from "react";

export default function FilterBar() {
  const [selected, setSelected] = useState("Today");

  const filters = ["Today", "Week", "Month", "Year"];

  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-4">

      <div className="flex gap-3">

        {filters.map((filter) => (

          <button
            key={filter}
            onClick={() => setSelected(filter)}
            className={`rounded-lg px-5 py-2 font-medium transition-all duration-300 ${
              selected === filter
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-gray-700 shadow hover:bg-gray-100"
            }`}
          >
            {filter}
          </button>

        ))}

      </div>

      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="rounded-lg border bg-white px-4 py-2 shadow"
      >
        {filters.map((filter) => (
          <option key={filter}>{filter}</option>
        ))}
      </select>

    </div>
  );
}