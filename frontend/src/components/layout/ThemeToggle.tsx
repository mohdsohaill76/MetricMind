"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark-mode") {
      document.body.classList.add("dark-mode");
      document.body.classList.remove("light-mode");
      setDarkMode(true);
    } else {
      document.body.classList.add("light-mode");
      document.body.classList.remove("dark-mode");
      setDarkMode(false);
    }
  }, []);

  const toggleTheme = () => {
    if (darkMode) {
      document.body.classList.remove("dark-mode");
      document.body.classList.add("light-mode");
      localStorage.setItem("theme", "light-mode");
    } else {
      document.body.classList.remove("light-mode");
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark-mode");
    }

    setDarkMode(!darkMode);
  };

  return (
    <button
      onClick={toggleTheme}
      className="h-11 w-11 rounded-full border bg-white shadow hover:bg-gray-100"
    >
      {darkMode ? "☀️" : "🌙"}
    </button>
  );
}