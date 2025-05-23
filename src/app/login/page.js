"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DebugInfo from "../components/DebugInfo";

// Disable static generation for this page
export const dynamic = "force-dynamic";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Show loading overlay
    if (typeof window !== "undefined") {
      console.log("Showing loading overlay...");
      window.dispatchEvent(
        new CustomEvent("show-loading-overlay", {
          detail: { message: "Signing in..." },
        })
      );

      // Set a backup timeout to hide the overlay in case of issues
      window.loginLoadingTimeout = setTimeout(() => {
        console.log("Backup timeout: hiding loading overlay...");
        window.dispatchEvent(new CustomEvent("hide-loading-overlay"));
      }, 10000);
    }

    try {
      console.log(
        "Attempting login with username:",
        username,
        "and password length:",
        password.length
      );

      // First try our debug login endpoint
      try {
        const debugResponse = await fetch("/api/debug/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        const debugResult = await debugResponse.json();
        console.log("Debug login result:", debugResult);

        if (debugResult.success) {
          console.log("Debug login successful, proceeding with NextAuth login");
        } else {
          console.error("Debug login failed:", debugResult.error);
        }
      } catch (debugError) {
        console.error("Error with debug login:", debugError);
      }

      // Add a small delay to ensure the server is ready
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Now try the actual NextAuth login
      console.log("Attempting NextAuth login with credentials...");

      // First try with redirect: false to check the result
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
        callbackUrl: "/",
      });

      console.log("NextAuth login result:", result);

      if (result?.error) {
        console.error("Login error:", result.error);
        setError("Invalid username or password. Please try again.");
        setIsLoading(false);

        // Hide loading overlay
        if (typeof window !== "undefined") {
          console.log("Error occurred: hiding loading overlay...");
          window.dispatchEvent(new CustomEvent("hide-loading-overlay"));

          // Clear the backup timeout
          if (window.loginLoadingTimeout) {
            clearTimeout(window.loginLoadingTimeout);
            window.loginLoadingTimeout = null;
          }
        }
        return;
      }

      console.log("Login successful, navigating to dashboard...");

      // Add a small delay to ensure the session is properly set
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Force a hard navigation to ensure cookies are properly set and recognized
      window.location.href = "/";
    } catch (error) {
      console.error("Login error:", error);
      setError(
        "An error occurred during login: " + (error.message || "Unknown error")
      );
      setIsLoading(false);

      // Hide loading overlay
      if (typeof window !== "undefined") {
        console.log("Error in catch block: hiding loading overlay...");
        window.dispatchEvent(new CustomEvent("hide-loading-overlay"));

        // Clear the backup timeout
        if (window.loginLoadingTimeout) {
          clearTimeout(window.loginLoadingTimeout);
          window.loginLoadingTimeout = null;
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            VR Mobiles Service
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Username"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </div>

          <div className="text-sm text-center">
            <Link
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Don&apos;t have an account? Register
            </Link>
          </div>
        </form>

        <DebugInfo />
      </div>
    </div>
  );
}
