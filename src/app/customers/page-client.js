"use client";

import { lazy } from "react";
import Link from "next/link";
import Layout from "../components/Layout";
import CustomerTableWithSearchParams from "../components/CustomerTableWithSearchParams";

// Disable static generation for this page
export const dynamic = "force-dynamic";

export default function CustomersPageClient() {
  return (
    <Layout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-4 md:mb-0">
            Customer Details
          </h1>
          <Link
            href="/job-cards/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors duration-200 inline-flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add New Job Card
          </Link>
        </div>

        {/* The CustomerTableWithSearchParams component already has its own Suspense boundary */}
        <CustomerTableWithSearchParams />
      </div>
    </Layout>
  );
}
