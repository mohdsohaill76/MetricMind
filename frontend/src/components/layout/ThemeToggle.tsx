"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark-mode") {
      document.body.classList.add("dark-mode");
      setDarkMode(true);
    } else {
      document.body.classList.add("light-mode");
      setDarkMode(false);
    }
  }, []);

  const toggleTheme = () => {
    if (document.body.classList.contains("dark-mode")) {
      document.body.classList.remove("dark-mode");
      document.body.classList.add("light-mode");

      localStorage.setItem("theme", "light-mode");

      setDarkMode(false);
    } else {
      document.body.classList.remove("light-mode");
      document.body.classList.add("dark-mode");

      localStorage.setItem("theme", "dark-mode");

      setDarkMode(true);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex h-11 w-11 items-center justify-center rounded-full border bg-white text-xl shadow-sm transition hover:scale-105"
      title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {darkMode ? "☀️" : "🌙"}
    </button>
  );
}