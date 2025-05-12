"use client";

import { useCallback } from "react";

export default function CustomerPagination({ totalItems, currentPage, pageSize }) {
  // Calculate total pages
  const pageCount = Math.ceil(totalItems / pageSize);
  
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5; // Show at most 5 page numbers
    
    if (pageCount <= maxPagesToShow) {
      // If we have 5 or fewer pages, show all of them
      for (let i = 1; i <= pageCount; i++) {
        pages.push(i);
      }
    } else {
      // Always include first page
      pages.push(1);
      
      // Calculate start and end of page numbers to show
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(pageCount - 1, currentPage + 1);
      
      // Adjust if we're near the beginning
      if (currentPage <= 3) {
        start = 2;
        end = Math.min(pageCount - 1, 4);
      }
      
      // Adjust if we're near the end
      if (currentPage >= pageCount - 2) {
        start = Math.max(2, pageCount - 3);
        end = pageCount - 1;
      }
      
      // Add ellipsis before middle pages if needed
      if (start > 2) {
        pages.push("...");
      }
      
      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      // Add ellipsis after middle pages if needed
      if (end < pageCount - 1) {
        pages.push("...");
      }
      
      // Always include last page
      pages.push(pageCount);
    }
    
    return pages;
  };

  // Direct navigation function that uses window.location
  const navigateToPage = useCallback((page) => {
    if (page >= 1 && page <= pageCount) {
      // Get current URL and parameters
      const url = new URL(window.location.href);
      const params = url.searchParams;
      
      // Update page parameter
      params.set("page", page.toString());
      
      // Update URL without using Next.js router
      window.location.href = url.toString();
    }
  }, [pageCount]);

  // Handle previous page
  const handlePrevious = useCallback(() => {
    if (currentPage > 1) {
      navigateToPage(currentPage - 1);
    }
  }, [currentPage, navigateToPage]);

  // Handle next page
  const handleNext = useCallback(() => {
    if (currentPage < pageCount) {
      navigateToPage(currentPage + 1);
    }
  }, [currentPage, pageCount, navigateToPage]);

  // If there's only one page, don't show pagination
  if (pageCount <= 1) {
    return null;
  }

  return (
    <div className="flex justify-center mt-4">
      <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
        {/* Previous Page Button */}
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`relative inline-flex items-center px-3 py-2 rounded-l-md border ${
            currentPage === 1
              ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
              : "border-gray-300 bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-700"
          } text-sm font-medium`}
        >
          <span className="sr-only">Previous</span>
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Page Numbers */}
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => (typeof page === "number" ? navigateToPage(page) : null)}
            disabled={typeof page !== "number"}
            className={`relative inline-flex items-center px-4 py-2 border ${
              page === currentPage
                ? "z-10 bg-blue-600 border-blue-600 text-white"
                : typeof page === "number"
                ? "bg-white border-gray-300 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                : "bg-white border-gray-300 text-gray-700"
            } text-sm font-medium`}
          >
            {page}
          </button>
        ))}

        {/* Next Page Button */}
        <button
          onClick={handleNext}
          disabled={currentPage === pageCount}
          className={`relative inline-flex items-center px-3 py-2 rounded-r-md border ${
            currentPage === pageCount
              ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
              : "border-gray-300 bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-700"
          } text-sm font-medium`}
        >
          <span className="sr-only">Next</span>
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </nav>
    </div>
  );
}
