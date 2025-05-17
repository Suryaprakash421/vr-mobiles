"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import CommonPaginationWithParams from "./CommonPaginationWithParams";
import SearchFieldWithParams from "./SearchFieldWithParams";
import DirectPageSizeSelectorWithParams from "./DirectPageSizeSelectorWithParams";
import { createApiUrl } from "../utils/safeUrl";

export default function CustomerTable({ searchParamsData }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = searchParamsData;
  const isInitialLoad = useRef(true);

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);

  // Get pagination parameters from URL
  // Use searchParams directly to avoid issues with server-side rendering
  const currentPage = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "5");

  // Pagination state
  const [totalCount, setTotalCount] = useState(0);

  // Extract the current URL parameters we need to track
  const urlPage = searchParams.get("page");
  const urlPageSize = searchParams.get("pageSize");
  const urlSearch = searchParams.get("search");

  // Track the last URL parameters to detect changes
  const lastUrlParamsRef = useRef({
    page: urlPage,
    pageSize: urlPageSize,
    search: urlSearch,
  });

  // Function to fetch customers data
  const fetchCustomers = useCallback(
    async (isSearching = false) => {
      try {
        // Only show loading spinner on initial load, not during search
        if (!isSearching) {
          setLoading(true);
        }

        // Get the current URL parameters from searchParams
        const page = searchParams.get("page") || "1";
        const size = searchParams.get("pageSize") || "5";
        const searchTerm = searchParams.get("search") || "";

        // Build query parameters object
        const queryParams = {
          page,
          pageSize: size,
        };

        if (searchTerm) {
          queryParams.search = searchTerm;
        }

        // Create a safe API URL that works in both client and server environments
        const apiUrl = createApiUrl("/api/customers", queryParams);

        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`Failed to fetch customers: ${response.status}`);
        }

        const data = await response.json();
        setCustomers(data.customers || []);
        setTotalCount(data.totalCount || 0);

        // Update the last URL parameters
        lastUrlParamsRef.current = {
          page,
          pageSize: size,
          search: searchTerm,
        };
      } catch (err) {
        console.error("Error fetching customers:", err);
        setError(err.message || "Failed to load customers");
      } finally {
        setLoading(false);
        setSearching(false);
        isInitialLoad.current = false;
      }
    },
    [searchParams]
  ); // Only depend on searchParams

  // Effect for initial load and URL parameter changes
  useEffect(() => {
    // Get parameters from searchParams
    const currentPage = searchParams.get("page");
    const currentPageSize = searchParams.get("pageSize");
    const currentSearch = searchParams.get("search");

    // Check if any relevant URL parameters have changed
    const paramsChanged =
      currentPage !== lastUrlParamsRef.current.page ||
      currentPageSize !== lastUrlParamsRef.current.pageSize ||
      currentSearch !== lastUrlParamsRef.current.search;

    // If it's a search operation, we'll handle it separately
    if (currentSearch && !isInitialLoad.current && paramsChanged) {
      setSearching(true);
    }

    // Only fetch if parameters changed or it's the initial load
    if (paramsChanged || isInitialLoad.current) {
      fetchCustomers(currentSearch && !isInitialLoad.current);
    }
  }, [fetchCustomers, searchParams]);

  // We don't need a page size change handler as the DirectPageSizeSelectorWithParams component
  // will handle page size changes through URL parameters

  // Only show full loading screen on initial load
  if (loading && isInitialLoad.current) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-red-500 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="text-xl font-bold text-red-600 mb-2">
            Error Loading Customers
          </h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <p className="text-gray-500">
            Please try refreshing the page or contact support if the problem
            persists.
          </p>
        </div>
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="text-center py-10">
          <p className="text-gray-500">
            No customers found. Customers are automatically created when you add
            job cards.
          </p>
          <Link
            href="/job-cards/new"
            className="mt-4 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md font-medium transition-colors inline-block"
          >
            Create Your First Job Card
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl shadow-sm relative">
        <h2 className="text-lg font-bold mb-3 bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
          Find Customers
        </h2>
        <SearchFieldWithParams
          placeholder="Search by name, mobile number, or address..."
          debounceTime={500}
          className="w-full"
        />

        {/* Subtle search loading indicator */}
        {searching && (
          <div className="absolute top-2 right-2">
            <div className="animate-pulse flex space-x-1">
              <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
              <div className="h-2 w-2 bg-indigo-600 rounded-full animation-delay-200"></div>
              <div className="h-2 w-2 bg-purple-600 rounded-full animation-delay-500"></div>
            </div>
          </div>
        )}
      </div>

      {/* No customers message */}
      {customers.length === 0 && !loading && (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <p className="text-gray-500">No customers found.</p>
          {searchParams?.get("search") && (
            <button
              onClick={() => {
                // Clear the search by navigating to the page without search params
                const params = new URLSearchParams();
                params.set("page", "1");
                // Using pathname directly is safe
                router.push(`${pathname}?${params.toString()}`);
              }}
              className="mt-4 px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-md font-medium transition-colors"
            >
              Clear Search
            </button>
          )}
        </div>
      )}

      {/* Customer Table */}
      {customers.length > 0 && (
        <div
          className={`overflow-x-auto bg-white rounded-lg shadow relative ${
            searching ? "opacity-70 transition-opacity duration-300" : ""
          }`}
        >
          {/* Overlay loading indicator for search operations */}
          {searching && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-white bg-opacity-30">
              <div className="animate-pulse flex space-x-2">
                <div className="h-3 w-3 bg-blue-600 rounded-full"></div>
                <div className="h-3 w-3 bg-indigo-600 rounded-full animation-delay-200"></div>
                <div className="h-3 w-3 bg-purple-600 rounded-full animation-delay-500"></div>
              </div>
            </div>
          )}
          <table
            className="min-w-full divide-y divide-gray-200"
            style={{ position: "relative", zIndex: 0 }}
          >
            <thead className="bg-gradient-to-r from-blue-700 to-violet-600">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider"
                >
                  S.No
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider"
                >
                  Contact Number
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider"
                >
                  Aadhar Number
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider"
                >
                  Address
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider"
                >
                  Visits
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map((customer, index) => (
                <tr
                  key={customer.id}
                  className="hover:bg-blue-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-700">
                    {(currentPage - 1) * pageSize + index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {customer.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {customer.mobileNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {customer.aadhaarNumber || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                    {customer.address || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {customer.visitCount} visits
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      href={`/customers/${customer.id}`}
                      className="inline-block px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-md font-medium mr-2 transition-colors"
                    >
                      View
                    </Link>
                    <Link
                      href={`/customers/${customer.id}/edit`}
                      className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-md font-medium transition-colors"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination and Page Size Selector */}
      {customers.length > 0 && (
        <div className="mt-6 bg-white p-4 rounded-lg shadow">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <div className="mb-4 md:mb-0">
              <DirectPageSizeSelectorWithParams />
            </div>
            <div className="text-sm font-medium text-gray-900">
              Showing {Math.min((currentPage - 1) * pageSize + 1, totalCount)}{" "}
              to {Math.min(currentPage * pageSize, totalCount)} of {totalCount}{" "}
              entries
            </div>
          </div>

          <CommonPaginationWithParams totalItems={totalCount} />
        </div>
      )}
    </div>
  );
}
