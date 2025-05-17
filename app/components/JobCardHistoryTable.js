"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import JobCardHistoryFilter from "./JobCardHistoryFilter";
// Define formatDate function inline to avoid import issues
const formatDate = (dateString) => {
  const date = new Date(dateString);
  // Use a consistent date format that doesn't depend on locale
  return date.toISOString().split("T")[0].split("-").reverse().join("/");
};

export default function JobCardHistoryTable({ jobCards }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [statusFilter, setStatusFilter] = useState("all");

  // Filter job cards by status
  const filteredJobCards = useMemo(() => {
    if (statusFilter === "all") {
      return jobCards;
    }
    return jobCards.filter((jobCard) => jobCard.status === statusFilter);
  }, [jobCards, statusFilter]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredJobCards.length / pageSize);

  // Get current job cards
  const indexOfLastItem = currentPage * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;
  const currentJobCards = filteredJobCards.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Change page
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleStatusChange = (newStatus) => {
    setStatusFilter(newStatus);
    setCurrentPage(1); // Reset to first page when changing status filter
  };

  return (
    <div className="mt-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2 md:mb-0">
          Job Card History
        </h3>
        <JobCardHistoryFilter
          currentStatus={statusFilter}
          onStatusChange={handleStatusChange}
        />
      </div>
      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Bill No
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Model
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Complaint
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Customer Name
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
            {currentJobCards.length > 0 ? (
              currentJobCards.map((jobCard) => (
                <tr key={jobCard.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{jobCard.billNo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(jobCard.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {jobCard.model}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {jobCard.complaint}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${
                        jobCard.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : jobCard.status === "in-progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {jobCard.status === "completed"
                        ? "Completed"
                        : jobCard.status === "in-progress"
                        ? "In Progress"
                        : "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                    {jobCard.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      href={`/job-cards/${jobCard.id}`}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                >
                  No job cards found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="mt-6 bg-white p-4 rounded-lg shadow">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <span className="text-sm text-gray-700 mr-2">Show</span>
                <select
                  className="border border-gray-300 rounded px-2 py-1 text-sm text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={pageSize}
                  onChange={handlePageSizeChange}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-sm text-gray-700 ml-2">entries</span>
              </div>
            </div>
            <div className="text-sm font-medium text-gray-900">
              Showing {filteredJobCards.length > 0 ? indexOfFirstItem + 1 : 0}{" "}
              to {Math.min(indexOfLastItem, filteredJobCards.length)} of{" "}
              {filteredJobCards.length} entries{" "}
              {statusFilter !== "all" &&
                `(filtered from ${jobCards.length} total entries)`}
            </div>
          </div>

          <div className="flex justify-center items-center mt-4">
            <nav className="flex items-center space-x-1">
              {/* Previous page button */}
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md flex items-center ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                }`}
                aria-label="Previous page"
                title="Previous page"
              >
                <span className="text-sm">Previous</span>
              </button>

              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded-md ${
                      page === currentPage
                        ? "bg-blue-600 text-white font-medium"
                        : "text-gray-700 hover:bg-gray-100 border border-gray-300"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              {/* Next page button */}
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`px-3 py-1 rounded-md flex items-center ${
                  currentPage === totalPages || totalPages === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                }`}
                aria-label="Next page"
                title="Next page"
              >
                <span className="text-sm">Next</span>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
