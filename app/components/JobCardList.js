"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import DirectSearchBar from "./DirectSearchBar";
import DirectPagination from "./DirectPagination";
import LoadingOverlay from "./LoadingOverlay";
import SimpleStatusDropdown from "./SimpleStatusDropdown";
import DirectPageSizeSelector from "./DirectPageSizeSelector";
import StatusFilter from "./StatusFilter";

export default function JobCardList({
  jobCards,
  totalCount,
  currentPage = 1,
  pageSize = 10,
  showSearch = true,
  showStatusFilter = true,
  currentStatus = "all",
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const searchBarRef = useRef();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    // Use a consistent date format that doesn't depend on locale
    return date.toISOString().split("T")[0].split("-").reverse().join("/");
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this job card?")) {
      setIsDeleting(true);
      setDeleteId(id);

      // Show loading overlay
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("show-loading-overlay", {
            detail: { message: "Deleting job card..." },
          })
        );
      }

      try {
        const response = await fetch(`/api/job-cards/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete job card");
        }

        router.refresh();
      } catch (error) {
        console.error("Error deleting job card:", error);
        alert("Failed to delete job card");
      } finally {
        setIsDeleting(false);
        setDeleteId(null);

        // Hide loading overlay
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("hide-loading-overlay"));
        }
      }
    }
  };

  // Search is handled server-side through URL parameters

  if (!jobCards || jobCards.length === 0) {
    return (
      <div>
        {showSearch && (
          <div className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-bold mb-3 bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
              Find Job Cards
            </h2>
            <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-grow">
                <DirectSearchBar searchBarRef={searchBarRef} />
              </div>
              {showStatusFilter && (
                <div>
                  <StatusFilter currentStatus={currentStatus} />
                </div>
              )}
            </div>
          </div>
        )}
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <p className="text-gray-500">No job cards found.</p>
          {searchParams?.get("search") && (
            <button
              onClick={() => {
                // Clear the search input field
                if (searchBarRef.current) {
                  searchBarRef.current.clearSearch();
                } else {
                  // Fallback if ref is not available
                  const params = new URLSearchParams();
                  params.set("page", "1");
                  router.push(`/job-cards?${params.toString()}`);
                }
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
            Find Job Cards
          </h2>
          <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-grow">
              <DirectSearchBar searchBarRef={searchBarRef} />
            </div>
            {showStatusFilter && (
              <div>
                <StatusFilter currentStatus={currentStatus} />
              </div>
            )}
          </div>
        </div>
      )}

      <div className="overflow-x-auto bg-white rounded-lg shadow relative">
        <LoadingOverlay
          isVisible={isDeleting}
          message="Deleting job card..."
          fullScreen={false}
        />
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
                Bill No
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider"
              >
                Customer
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider"
              >
                Mobile
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider"
              >
                Model
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider"
              >
                Complaint
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider min-w-[120px]"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-bold text-white uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {jobCards.length > 0 ? (
              jobCards.map((jobCard) => (
                <tr
                  key={jobCard.id}
                  className="hover:bg-blue-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-700">
                    {jobCard.billNo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {formatDate(jobCard.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {jobCard.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {jobCard.mobileNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {jobCard.model}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                    {jobCard.complaint}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap min-w-[120px]">
                    <SimpleStatusDropdown
                      jobId={jobCard.id}
                      currentStatus={jobCard.status}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/job-cards/${jobCard.id}`}
                      className="inline-block px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-md font-medium mr-2 transition-colors"
                    >
                      View
                    </Link>
                    <Link
                      href={`/job-cards/${jobCard.id}/edit`}
                      className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-md font-medium mr-2 transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(jobCard.id)}
                      disabled={isDeleting && deleteId === jobCard.id}
                      className="inline-block px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded-md font-medium transition-colors disabled:opacity-50"
                    >
                      {isDeleting && deleteId === jobCard.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="9"
                  className="px-6 py-10 text-center text-gray-500"
                >
                  No matching job cards found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination and Page Size Selector */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <div className="mb-4 md:mb-0">
            <DirectPageSizeSelector pageSize={pageSize} />
          </div>
          <div className="text-sm font-medium text-gray-900">
            Showing {Math.min((currentPage - 1) * pageSize + 1, totalCount)} to{" "}
            {Math.min(currentPage * pageSize, totalCount)} of {totalCount}{" "}
            entries
          </div>
        </div>

        <DirectPagination
          totalItems={totalCount}
          currentPage={currentPage}
          pageSize={pageSize}
        />
      </div>
    </div>
  );
}
