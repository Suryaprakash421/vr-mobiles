"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import SearchField from "./SearchField";
import CommonPagination from "./CommonPagination";
import { FaEye, FaEdit, FaTrash, FaExclamationTriangle } from "react-icons/fa";

export default function ClientSideCustomerList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [customers, setCustomers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Get pagination and search parameters
  const search = searchParams?.get("search") || "";
  const currentPage = parseInt(searchParams?.get("page") || "1");
  const pageSize = parseInt(searchParams?.get("pageSize") || "10");

  // Fetch customers when parameters change
  useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Build query parameters
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        params.set("page", currentPage.toString());
        params.set("pageSize", pageSize.toString());

        // Fetch data from API using relative URL (works in both dev and production)
        const response = await fetch(`/api/customers?${params.toString()}`);

        if (!response.ok) {
          throw new Error(
            `API returned ${response.status}: ${response.statusText}`
          );
        }

        const data = await response.json();
        setCustomers(data.customers || []);
        setTotalCount(data.totalCount || 0);
      } catch (err) {
        console.error("Error fetching customers:", err);
        setError(err.message || "Failed to fetch customers");
        setCustomers([]);
        setTotalCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, [search, currentPage, pageSize]);

  // Handle page change
  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`/customers?${params.toString()}`);
  };

  // Handle page size change
  const handlePageSizeChange = (size) => {
    const params = new URLSearchParams(searchParams);
    params.set("pageSize", size.toString());
    params.set("page", "1"); // Reset to first page
    router.push(`/customers?${params.toString()}`);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      const baseUrl = window.location.origin;
      const response = await fetch(`${baseUrl}/api/customers/${deleteId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Refresh the data
        setCustomers(customers.filter((customer) => customer.id !== deleteId));
        setTotalCount((prev) => prev - 1);
      } else {
        const data = await response.json();
        alert(`Error: ${data.error || "Failed to delete customer"}`);
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      alert("An error occurred while deleting the customer");
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / pageSize);

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="text-center">
          <FaExclamationTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
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

  // Empty state
  if (customers.length === 0) {
    return (
      <div>
        <div className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-bold mb-3 bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
            Find Customers
          </h2>
          <SearchField
            placeholder="Search by name, mobile number, or address..."
            initialValue={search}
            debounceTime={500}
            className="w-full"
          />
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="text-center py-10">
            <p className="text-gray-500">No customers found.</p>
            {search && (
              <button
                onClick={() => {
                  // Clear the search by navigating to the page without search params
                  const params = new URLSearchParams();
                  params.set("page", "1");
                  router.push(`/customers?${params.toString()}`);
                }}
                className="mt-4 px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-md font-medium transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Render customer list
  return (
    <div>
      <div className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-bold mb-3 bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
          Find Customers
        </h2>
        <SearchField
          placeholder="Search by name, mobile number, or address..."
          initialValue={search}
          debounceTime={500}
          className="w-full"
        />
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
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Mobile Number
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
                  Visit Count
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
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {customer.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {customer.mobileNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 max-w-xs truncate">
                      {customer.address || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
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
                        <FaEye />
                      </Link>
                      <Link
                        href={`/customers/${customer.id}/edit`}
                        className="text-green-600 hover:text-green-900"
                        title="Edit"
                      >
                        <FaEdit />
                      </Link>
                      <button
                        onClick={() => setDeleteId(customer.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <CommonPagination
          totalItems={totalCount}
          currentPage={currentPage}
          pageSize={pageSize}
          useClientSideNavigation={true}
        />
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this customer? This action cannot
              be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
