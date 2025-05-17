"use client";

import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function Pagination({
  totalItems,
  currentPage = 1,
  pageSize = 10,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [pageCount, setPageCount] = useState(Math.ceil(totalItems / pageSize));

  // Update page count when totalItems or pageSize changes
  useEffect(() => {
    setPageCount(Math.ceil(totalItems / pageSize));
  }, [totalItems, pageSize]);

  // Handle page change with a more direct approach
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pageCount) {
      // Create new URLSearchParams with current params
      const params = new URLSearchParams(searchParams.toString());

      // Update page parameter
      params.set("page", newPage.toString());

      // Use window.location.href for a hard navigation that ensures the page changes
      // This is a more direct approach that bypasses Next.js router issues
      const url = `${pathname}?${params.toString()}`;

      // Use replace state to avoid adding to browser history
      window.history.pushState({}, "", url);

      // Force a reload of the current page to ensure data is fetched correctly
      window.location.reload();
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (pageCount <= maxPagesToShow) {
      // Show all pages if there are few
      for (let i = 1; i <= pageCount; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate start and end of page range
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(pageCount - 1, currentPage + 1);

      // Adjust if at the beginning
      if (currentPage <= 2) {
        endPage = 4;
      }

      // Adjust if at the end
      if (currentPage >= pageCount - 1) {
        startPage = pageCount - 3;
      }

      // Add ellipsis if needed
      if (startPage > 2) {
        pages.push("...");
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis if needed
      if (endPage < pageCount - 1) {
        pages.push("...");
      }

      // Always show last page
      pages.push(pageCount);
    }

    return pages;
  };

  // Don't show pagination if there's only one page
  if (pageCount <= 1) return null;

  return (
    <div className="flex justify-center items-center mt-4">
      <nav className="flex items-center space-x-1">
        {/* Previous page button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-md flex items-center ${
            currentPage === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
          }`}
          aria-label="Previous page"
          title="Previous page"
        >
          <FaChevronLeft className="h-3 w-3 mr-1" />
          <span className="text-sm">Previous</span>
        </button>

        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === "number" && handlePageChange(page)}
            disabled={page === "..."}
            className={`px-3 py-1 rounded-md ${
              page === currentPage
                ? "bg-blue-600 text-white font-medium"
                : page === "..."
                ? "text-gray-700 cursor-default"
                : "text-gray-700 hover:bg-gray-100 border border-gray-300"
            }`}
          >
            {page}
          </button>
        ))}

        {/* Next page button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === pageCount}
          className={`px-3 py-1 rounded-md flex items-center ${
            currentPage === pageCount
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
          }`}
          aria-label="Next page"
          title="Next page"
        >
          <span className="text-sm">Next</span>
          <FaChevronRight className="h-3 w-3 ml-1" />
        </button>
      </nav>
    </div>
  );
}
