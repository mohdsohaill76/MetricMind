"use client";

import NotificationDropdown from "./NotificationDropdown";
import ProfileDropdown from "./ProfileDropdown";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <header className="card flex h-16 items-center justify-between border-b px-8 shadow-sm">

      <div>
        <h1 className="text-2xl font-bold">
          MetricMind Dashboard
        </h1>

        <p className="text-sm opacity-70">
          AI Powered Business Analytics
        </p>
      </div>

      <div className="flex items-center gap-4">

        <ThemeToggle />

        <NotificationDropdown />

        <ProfileDropdown />

      </div>

    </header>
  );
}