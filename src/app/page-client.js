"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Layout from "./components/Layout";

// Disable static generation for this page
export const dynamic = "force-dynamic";

export default function HomeClient() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    console.log("Dashboard - Session status:", status);
    console.log("Dashboard - Session data:", session);

    if (status === "unauthenticated") {
      console.log(
        "Dashboard - User is not authenticated, redirecting to login..."
      );
      router.push("/login");
    } else if (status === "authenticated") {
      console.log("Dashboard - User is authenticated:", session?.user);
    }
  }, [status, session, router]);

  if (status === "loading") {
    console.log("Dashboard - Session is loading...");
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-lg font-medium text-gray-700">
            Loading your dashboard...
          </p>
        </div>
      </Layout>
    );
  }

  if (status === "unauthenticated") {
    console.log("Dashboard - Rendering null for unauthenticated user");

    // Force redirect if useEffect doesn't trigger
    setTimeout(() => {
      if (window.location.pathname === "/") {
        console.log("Dashboard - Forcing redirect to login page");
        window.location.href = "/login";
      }
    }, 1000);

    return null; // Will redirect in the useEffect
  }

  return (
    <Layout>
      <div className="bg-white shadow-lg rounded-lg p-8 border-t-4 border-blue-600 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-violet-600 to-blue-500"></div>
        <h1 className="text-3xl font-extrabold mb-8 bg-gradient-to-r from-blue-700 to-violet-700 text-transparent bg-clip-text">
          Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-blue-500">
            <h2 className="text-xl font-bold text-blue-700 mb-3">Job Cards</h2>
            <p className="text-gray-700 mb-5 font-medium">
              Manage all service job cards
            </p>
            <Link
              href="/job-cards"
              className="inline-block bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 font-bold shadow-sm hover:shadow transition-all duration-300 transform hover:translate-y-[-2px]"
            >
              View All Job Cards
            </Link>
          </div>

          <div className="bg-green-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-green-500">
            <h2 className="text-xl font-bold text-green-700 mb-3">New Job</h2>
            <p className="text-gray-700 mb-5 font-medium">
              Create a new service job card
            </p>
            <Link
              href="/job-cards/new"
              className="inline-block bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 font-bold shadow-sm hover:shadow transition-all duration-300 transform hover:translate-y-[-2px]"
            >
              Create New Job Card
            </Link>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-purple-500">
            <h2 className="text-xl font-bold text-purple-700 mb-3">Search</h2>
            <p className="text-gray-700 mb-5 font-medium">
              Find job cards by bill number or customer details
            </p>
            <Link
              href="/job-cards"
              className="inline-block bg-purple-600 text-white px-5 py-2 rounded-md hover:bg-purple-700 font-bold shadow-sm hover:shadow transition-all duration-300 transform hover:translate-y-[-2px]"
            >
              Search Job Cards
            </Link>
          </div>
        </div>

        <div className="mt-10 bg-gray-50 p-6 rounded-lg shadow-md relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-violet-600 to-blue-500"></div>
          <h2 className="text-xl font-bold mb-5 bg-gradient-to-r from-blue-700 to-violet-700 text-transparent bg-clip-text">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/job-cards/new"
              className="bg-gradient-to-r from-blue-600 to-violet-600 text-white px-5 py-3 rounded-md hover:from-blue-700 hover:to-violet-700 font-bold shadow-sm hover:shadow-md transition-all duration-300 transform hover:translate-y-[-2px]"
            >
              New Job Card
            </Link>
            <Link
              href="/job-cards"
              className="bg-gradient-to-r from-gray-700 to-gray-600 text-white px-5 py-3 rounded-md hover:from-gray-800 hover:to-gray-700 font-bold shadow-sm hover:shadow-md transition-all duration-300 transform hover:translate-y-[-2px]"
            >
              View All Jobs
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
