"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FaChartLine,
  FaEye,
  FaEyeSlash,
  FaCheck,
} from "react-icons/fa";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    alert(
      "Registration API will be connected once the backend authentication API is ready."
    );
  };

  return (
    <main className="flex min-h-screen bg-slate-100">

      {/* ================= LEFT SIDE ================= */}

      <div className="relative hidden overflow-hidden bg-slate-900 lg:flex lg:w-1/2">

        {/* Decorative Background */}
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />

        <div className="relative flex w-full flex-col justify-between p-12 xl:p-16">

          {/* Logo */}
          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg">
              <FaChartLine className="text-xl" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-white">
                MetricMind
              </h1>

              <p className="text-sm text-slate-400">
                AI Business Analytics
              </p>
            </div>

          </div>


          {/* Main Content */}
          <div className="max-w-lg">

            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue-400">
              Get Started With MetricMind
            </p>

            <h2 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
              Build smarter strategies with
              <span className="text-blue-400">
                {" "}AI-powered insights.
              </span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-400">
              Create your MetricMind account and bring your business
              analytics, reports, and AI-powered insights together in one
              intelligent platform.
            </p>


            {/* Benefits */}
            <div className="mt-8 space-y-4">

              <div className="flex items-center gap-3 text-slate-300">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                  <FaCheck />
                </span>

                <span>
                  Monitor your business performance
                </span>
              </div>


              <div className="flex items-center gap-3 text-slate-300">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                  <FaCheck />
                </span>

                <span>
                  Generate AI-powered business reports
                </span>
              </div>


              <div className="flex items-center gap-3 text-slate-300">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                  <FaCheck />
                </span>

                <span>
                  Discover actionable business insights
                </span>
              </div>

            </div>

          </div>


          {/* Footer */}
          <div className="text-sm text-slate-500">
            © 2026 MetricMind. All rights reserved.
          </div>

        </div>

      </div>


      {/* ================= RIGHT SIDE ================= */}

      <div className="flex w-full items-center justify-center bg-white px-6 py-10 lg:w-1/2">

        <div className="w-full max-w-md">

          {/* Mobile Logo */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
              <FaChartLine />
            </div>

            <div>
              <h1 className="text-xl font-bold text-slate-900">
                MetricMind
              </h1>

              <p className="text-xs text-slate-500">
                AI Business Analytics
              </p>
            </div>

          </div>


          {/* Header */}
          <div className="mb-7">

            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Create your account
            </h2>

            <p className="mt-2 text-slate-500">
              Get started with MetricMind in just a few steps.
            </p>

          </div>


          {/* Register Form */}
          <form
            onSubmit={handleRegister}
            className="space-y-4"
          >

            {/* Full Name */}
            <div>

              <label
                htmlFor="fullName"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Full Name
              </label>

              <input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />

            </div>


            {/* Email */}
            <div>

              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />

            </div>


            {/* Password */}
            <div>

              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Password
              </label>

              <div className="relative">

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  required
                  minLength={6}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>

              </div>

            </div>


            {/* Confirm Password */}
            <div>

              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Confirm Password
              </label>

              <div className="relative">

                <input
                  id="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Confirm your password"
                  required
                  minLength={6}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>

              </div>

            </div>


            {/* Terms */}
            <div className="flex items-start gap-3 pt-2">

              <input
                id="terms"
                type="checkbox"
                required
                className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />

              <label
                htmlFor="terms"
                className="text-sm leading-5 text-slate-500"
              >
                I agree to the MetricMind terms of service and
                privacy policy.
              </label>

            </div>


            {/* Register Button */}
            <button
              type="submit"
              className="mt-2 w-full rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg"
            >
              Create Account
            </button>

          </form>


          {/* Login Link */}
          <div className="mt-7 text-center">

            <p className="text-sm text-slate-500">
              Already have an account?{" "}

              <Link
                href="/login"
                className="font-semibold text-blue-600 transition hover:text-blue-700"
              >
                Sign in
              </Link>
            </p>

          </div>


          {/* Security Note */}
          <div className="mt-7 rounded-xl border border-slate-100 bg-slate-50 p-4 text-center">

            <p className="text-xs leading-5 text-slate-500">
              Your account information will be securely handled by
              the MetricMind authentication system.
            </p>

          </div>

        </div>

      </div>

    </main>
  );
}