"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import LoadingOverlay from "./LoadingOverlay";
import Pagination from "./Pagination";

export default function CustomerTable() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get pagination parameters from URL
  const currentPage = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "5");

  // Pagination state
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchCustomers();
  }, [currentPage, pageSize, searchParams]);

  async function fetchCustomers() {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/customers?page=${currentPage}&pageSize=${pageSize}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch customers: ${response.status}`);
      }

      const data = await response.json();
      setCustomers(data.customers || []);
      setTotalCount(data.totalCount || 0);
      setTotalPages(Math.ceil((data.totalCount || 0) / pageSize));
    } catch (err) {
      console.error("Error fetching customers:", err);
      setError(err.message || "Failed to load customers");
    } finally {
      setLoading(false);
    }
  }

  // We don't need this function anymore as the Pagination component
  // will handle page changes through URL parameters
  // Keeping it as a no-op for any existing references
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value);

    // Update URL parameters
    const params = new URLSearchParams(searchParams);
    params.set("pageSize", newSize.toString());
    params.set("page", "1"); // Reset to first page when changing page size

    // Navigate to the new URL
    router.push(`${pathname}?${params.toString()}`);
  };

  if (loading) {
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
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <span className="text-sm text-gray-700 mr-2">Show</span>
          <select
            value={pageSize}
            onChange={handlePageSizeChange}
            className="border border-gray-300 rounded-md text-gray-900 px-3 py-1 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
          <span className="text-sm text-gray-700 ml-2">entries</span>
        </div>
        <div className="text-sm text-gray-700">
          Showing {Math.min((currentPage - 1) * pageSize + 1, totalCount)} to{" "}
          {Math.min(currentPage * pageSize, totalCount)} of {totalCount} entries
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  S.No
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Contact Number
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Aadhar Number
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Address
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Visits
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map((customer, index) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {(currentPage - 1) * pageSize + index + 1}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {customer.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {customer.mobileNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {customer.aadhaarNumber || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {customer.address || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {customer.visitCount} visits
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        href={`/customers/${customer.id}`}
                        className="text-blue-600 hover:text-blue-900"
                        title="View"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </Link>
                      <Link
                        href={`/customers/${customer.id}/edit`}
                        className="text-green-600 hover:text-green-900"
                        title="Edit"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        totalItems={totalCount}
        currentPage={currentPage}
        pageSize={pageSize}
      />
    </div>
  );
}
