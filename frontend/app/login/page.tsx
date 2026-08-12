"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaChartLine,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

import { loginUser } from "../../src/lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] =
    useState(false);

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await loginUser({
        username,
        password,
      });

      // Login successful
      router.push("/dashboard");

    } catch (error) {
      console.error(
        "Login Error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Invalid username or password."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen bg-slate-100">

      {/* ================= LEFT SIDE ================= */}

      <div className="relative hidden overflow-hidden bg-slate-900 lg:flex lg:w-1/2">

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


          {/* Error Message */}

          {error && (

            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">

              {error}

            </div>

          )}


          {/* Login Form */}

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >


            {/* Username */}

            <div>

              <label
                htmlFor="username"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Username
              </label>

              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                placeholder="Enter your username"
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
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                />


                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
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
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            >

              {loading
                ? "Signing in..."
                : "Sign In"}

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