"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import SearchField from "./SearchField";
import CommonPagination from "./CommonPagination";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import ConfirmDialog from "./ConfirmDialog";

export default function CustomerList({
  customers,
  totalCount,
  currentPage = 1,
  pageSize = 10,
  showSearch = true,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(totalCount / pageSize);
  }, [totalCount, pageSize]);

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
      const response = await fetch(`/api/customers/${deleteId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Refresh the page to show updated data
        router.refresh();
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

  // Handle delete cancel
  const handleDeleteCancel = () => {
    setDeleteId(null);
  };

  if (!customers || customers.length === 0) {
    return (
      <div>
        {showSearch && (
          <div className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-bold mb-3 bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
              Find Customers
            </h2>
            <SearchField
              placeholder="Search by name, mobile number, or address..."
              initialValue={searchParams.get("search") || ""}
              debounceTime={500}
              className="w-full"
            />
          </div>
        )}
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <p className="text-gray-500">No customers found.</p>
          {searchParams?.get("search") && (
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
    );
  }

  return (
    <div>
      {showSearch && (
        <div className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-bold mb-3 bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
            Find Customers
          </h2>
          <SearchField
            placeholder="Search by name, mobile number, or address..."
            initialValue={searchParams.get("search") || ""}
            debounceTime={500}
            className="w-full"
          />
        </div>
      )}

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
          useClientSideNavigation={false}
        />
      </div>

      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Delete Customer"
        message="Are you sure you want to delete this customer? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
}
