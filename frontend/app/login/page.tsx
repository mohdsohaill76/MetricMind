"use client";

import { useState } from "react";
import Link from "next/link";
import { FaChartLine, FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    alert(
      "Login API will be connected once the backend authentication API is ready."
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
              Intelligent Business Analytics
            </p>

            <h2 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
              Turn your business data into
              <span className="text-blue-400">
                {" "}smarter decisions.
              </span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-400">
              Analyze your business performance, discover important insights,
              and generate AI-powered reports from one powerful platform.
            </p>

          </div>


          {/* Bottom */}
          <div className="text-sm text-slate-500">
            © 2026 MetricMind. All rights reserved.
          </div>

        </div>

      </div>


      {/* ================= RIGHT SIDE ================= */}

      <div className="flex w-full items-center justify-center bg-white px-6 py-12 lg:w-1/2">

        <div className="w-full max-w-md">

          {/* Mobile Logo */}
          <div className="mb-10 flex items-center gap-3 lg:hidden">

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
          <div className="mb-8">

            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Welcome back
            </h2>

            <p className="mt-2 text-slate-500">
              Sign in to your MetricMind account to continue.
            </p>

          </div>


          {/* Login Form */}
          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >

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

              <div className="mb-2 flex items-center justify-between">

                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-blue-600 transition hover:text-blue-700"
                >
                  Forgot password?
                </Link>

              </div>


              <div className="relative">

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
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


            {/* Remember Me */}
            <div className="flex items-center gap-3">

              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />

              <label
                htmlFor="remember"
                className="text-sm text-slate-600"
              >
                Remember me
              </label>

            </div>


            {/* Login Button */}
            <button
              type="submit"
              className="w-full rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg"
            >
              Sign In
            </button>

          </form>


          {/* Register */}
          <div className="mt-8 text-center">

            <p className="text-sm text-slate-500">
              Don't have an account?{" "}

              <Link
                href="/register"
                className="font-semibold text-blue-600 transition hover:text-blue-700"
              >
                Create an account
              </Link>
            </p>

          </div>


          {/* Security Note */}
          <div className="mt-8 rounded-xl border border-slate-100 bg-slate-50 p-4 text-center">

            <p className="text-xs leading-5 text-slate-500">
              Your account credentials are securely handled by the
              MetricMind authentication system.
            </p>

          </div>

        </div>

      </div>

    </main>
  );
}