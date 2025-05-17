"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import SearchField from "./SearchField";
import SimplePagination from "./SimplePagination";
import LoadingOverlay from "./LoadingOverlay";
import SimpleStatusDropdown from "./SimpleStatusDropdown";
import ReusableStatusFilter from "./ReusableStatusFilter";

export default function ClientFilteredJobCardList({
  jobCards,
  showSearch = true,
  showStatusFilter = true,
  initialStatus = "all",
  initialPage = 1,
  initialPageSize = 10,
  searchParamsData,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = searchParamsData;

  // State for client-side filtering and pagination
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [searchTerm, setSearchTerm] = useState(
    searchParams?.get("search") || ""
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Filter job cards by status and search term
  const filteredJobCards = useMemo(() => {
    console.log(
      `Filtering with status: ${statusFilter}, search: ${searchTerm}`
    );

    return jobCards.filter((jobCard) => {
      // Filter by status
      const statusMatch =
        statusFilter === "all" || jobCard.status === statusFilter;

      // Filter by search term
      let searchMatch = true;
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        searchMatch =
          (jobCard.billNo && jobCard.billNo.toString().includes(searchTerm)) ||
          (jobCard.customerName &&
            jobCard.customerName.toLowerCase().includes(searchLower)) ||
          (jobCard.mobileNumber &&
            jobCard.mobileNumber.toLowerCase().includes(searchLower)) ||
          (jobCard.model && jobCard.model.toLowerCase().includes(searchLower));
      }

      return statusMatch && searchMatch;
    });
  }, [jobCards, statusFilter, searchTerm]);

  // Calculate total count after filtering
  const filteredTotalCount = filteredJobCards.length;

  // Get current page of filtered job cards
  const paginatedJobCards = useMemo(() => {
    const indexOfLastItem = currentPage * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;
    return filteredJobCards.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredJobCards, currentPage, pageSize]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
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

  // Handle status filter change
  const handleStatusChange = (newStatus) => {
    console.log(`Status changed to: ${newStatus}`);
    setStatusFilter(newStatus);
    setCurrentPage(1); // Reset to first page when changing filter
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    console.log(`Page changed to: ${newPage}`);
    setCurrentPage(newPage);
  };

  // Handle page size change
  const handlePageSizeChange = (newSize) => {
    console.log(`Page size changed to: ${newSize}`);
    setPageSize(parseInt(newSize));
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Handle search change
  const handleSearchChange = (newSearch) => {
    console.log(`Search changed to: ${newSearch}`);
    setSearchTerm(newSearch);
    setCurrentPage(1); // Reset to first page when changing search

    // Update URL for search term (optional)
    const params = new URLSearchParams(searchParams.toString());
    if (newSearch) {
      params.set("search", newSearch);
    } else {
      params.delete("search");
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

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
                <SearchField
                  placeholder="Search by bill number, name, or phone..."
                  initialValue={searchTerm}
                  onSearch={handleSearchChange}
                  debounceTime={500}
                  className="w-full"
                />
              </div>
              {showStatusFilter && (
                <div>
                  <ReusableStatusFilter
                    currentStatus={statusFilter}
                    onStatusChange={handleStatusChange}
                  />
                </div>
              )}
            </div>
          </div>
        )}
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <p className="text-gray-500">No job cards found.</p>
          {searchTerm && (
            <button
              onClick={() => handleSearchChange("")}
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
              <SearchField
                placeholder="Search by bill number, name, or phone..."
                initialValue={searchTerm}
                onSearch={handleSearchChange}
                debounceTime={500}
                className="w-full"
              />
            </div>
            {showStatusFilter && (
              <div>
                <ReusableStatusFilter
                  currentStatus={statusFilter}
                  onStatusChange={handleStatusChange}
                />
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
            {paginatedJobCards.length > 0 ? (
              paginatedJobCards.map((jobCard) => (
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
            <div className="flex items-center space-x-2">
              <label
                htmlFor="pageSize"
                className="text-sm font-medium text-gray-900"
              >
                Show
              </label>
              <select
                id="pageSize"
                value={pageSize}
                onChange={(e) => handlePageSizeChange(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm text-gray-900 font-medium"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span className="text-sm font-medium text-gray-900">entries</span>
            </div>
          </div>
          <div className="text-sm font-medium text-gray-900">
            Showing{" "}
            {filteredTotalCount > 0
              ? Math.min((currentPage - 1) * pageSize + 1, filteredTotalCount)
              : 0}{" "}
            to {Math.min(currentPage * pageSize, filteredTotalCount)} of{" "}
            {filteredTotalCount} entries
            {statusFilter !== "all" &&
              filteredTotalCount !== jobCards.length && (
                <span> (filtered from {jobCards.length} total entries)</span>
              )}
          </div>
        </div>

        <SimplePagination
          totalItems={filteredTotalCount}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
