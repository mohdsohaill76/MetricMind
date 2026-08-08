"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  const applyTheme = (theme: "dark-mode" | "light-mode") => {
    const root = document.documentElement;

    root.classList.remove("dark-mode", "light-mode");
    root.classList.add(theme);

    localStorage.setItem("theme", theme);
    setDarkMode(theme === "dark-mode");
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    applyTheme(savedTheme === "dark-mode" ? "dark-mode" : "light-mode");
  }, []);

  const toggleTheme = () => {
    applyTheme(darkMode ? "light-mode" : "dark-mode");
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--card-background)] text-xl text-[var(--foreground)] shadow-sm transition hover:scale-105"
      title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {darkMode ? "☀️" : "🌙"}
    </button>
  );
}
