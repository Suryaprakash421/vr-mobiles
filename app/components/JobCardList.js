"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SearchBar from "./SearchBar";
import Pagination from "./Pagination";

export default function JobCardList({ jobCards, showSearch = true }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    // Use a consistent date format that doesn't depend on locale
    return date.toISOString().split("T")[0].split("-").reverse().join("/");
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this job card?")) {
      setIsDeleting(true);
      setDeleteId(id);

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
      }
    }
  };

  // Filter job cards based on search query
  const filteredJobCards = useMemo(() => {
    if (!searchQuery.trim()) return jobCards || [];

    const query = searchQuery.toLowerCase().trim();
    return (jobCards || []).filter(
      (card) =>
        // Search by bill number
        (card.billNo && card.billNo.toString().includes(query)) ||
        // Search by customer name
        (card.customerName &&
          card.customerName.toLowerCase().includes(query)) ||
        // Search by mobile number
        (card.mobileNumber && card.mobileNumber.toLowerCase().includes(query))
    );
  }, [jobCards, searchQuery]);

  // Paginate job cards
  const paginatedJobCards = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredJobCards.slice(startIndex, startIndex + pageSize);
  }, [filteredJobCards, currentPage, pageSize]);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle page size change
  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  if (!jobCards || jobCards.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No job cards found.</p>
      </div>
    );
  }

  return (
    <div>
      {showSearch && (
        <div className="mb-6">
          <SearchBar onSearch={setSearchQuery} />
        </div>
      )}

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
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
                className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider"
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        jobCard.finalAmount
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {jobCard.finalAmount ? "Completed" : "In Progress"}
                    </span>
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
                  colSpan="8"
                  className="px-6 py-10 text-center text-gray-500"
                >
                  No matching job cards found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        totalItems={filteredJobCards.length}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}
