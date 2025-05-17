"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function CommonPagination({
  totalItems,
  currentPage = 1,
  pageSize = 10,
  useClientSideNavigation = true,
  onPageChange = null,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pageCount, setPageCount] = useState(Math.ceil(totalItems / pageSize));
  const [isNavigating, setIsNavigating] = useState(false);

  // Update page count when totalItems or pageSize changes
  useEffect(() => {
    const calculatedPageCount = Math.max(1, Math.ceil(totalItems / pageSize));
    setPageCount(calculatedPageCount);
    console.log(
      `Pagination: totalItems=${totalItems}, pageSize=${pageSize}, pageCount=${calculatedPageCount}`
    );
  }, [totalItems, pageSize]);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pageCount && !isNavigating) {
      setIsNavigating(true);

      // If onPageChange prop is provided, use it for client-side pagination
      if (onPageChange) {
        onPageChange(newPage);

        // Reset navigation state after a short delay
        setTimeout(() => {
          setIsNavigating(false);
        }, 300);
        return;
      }

      // Otherwise, use URL-based navigation
      // Create a new URLSearchParams object to preserve existing parameters
      const params = new URLSearchParams(searchParams.toString());

      // Update page parameter
      params.set("page", newPage.toString());

      if (useClientSideNavigation) {
        // Use Next.js router for client-side navigation without full page refresh
        router.push(`${pathname}?${params.toString()}`, { scroll: false });

        // Reset navigation state after a short delay
        setTimeout(() => {
          setIsNavigating(false);
        }, 300);
      } else {
        // Use window.location for a hard navigation that ensures the page changes
        const url = `${pathname}?${params.toString()}`;

        // Use replace state to avoid adding to browser history
        window.history.pushState({}, "", url);

        // Force a reload of the current page to ensure data is fetched correctly
        window.location.reload();
      }
    }
  };

  // Generate page numbers to display with a simpler, more reliable logic
  const getPageNumbers = () => {
    const pages = [];

    // Always show at least 5 page numbers or all pages if less than 5
    const maxVisiblePages = 5;

    if (pageCount <= maxVisiblePages) {
      // Show all pages if there are 5 or fewer
      for (let i = 1; i <= pageCount; i++) {
        pages.push(i);
      }
    } else {
      // Calculate the range of pages to show
      let startPage = Math.max(
        1,
        currentPage - Math.floor(maxVisiblePages / 2)
      );
      let endPage = startPage + maxVisiblePages - 1;

      // Adjust if we're near the end
      if (endPage > pageCount) {
        endPage = pageCount;
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      // Always include first page
      if (startPage > 1) {
        pages.push(1);
        // Add ellipsis if there's a gap
        if (startPage > 2) {
          pages.push("ellipsis1");
        }
      }

      // Add the visible page numbers
      for (let i = startPage; i <= endPage; i++) {
        if (i > 1 && i < pageCount) {
          // Skip first and last as they're handled separately
          pages.push(i);
        }
      }

      // Always include last page
      if (endPage < pageCount) {
        // Add ellipsis if there's a gap
        if (endPage < pageCount - 1) {
          pages.push("ellipsis2");
        }
        pages.push(pageCount);
      }
    }

    return pages;
  };

  // Don't show pagination if there's only one page
  if (pageCount <= 1) return null;

  return (
    <div className="flex justify-center items-center mt-4">
      <nav className="flex flex-wrap items-center justify-center gap-1 sm:space-x-1">
        {/* Previous page button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-2 sm:px-3 py-1 rounded-md flex items-center ${
            currentPage === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
          }`}
          aria-label="Previous page"
          title="Previous page"
        >
          <FaChevronLeft className="h-3 w-3 mr-1" />
          <span className="text-sm hidden sm:inline">Previous</span>
        </button>

        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === "number" && handlePageChange(page)}
            disabled={
              page === "ellipsis" ||
              page === "ellipsis1" ||
              page === "ellipsis2"
            }
            className={`px-2 sm:px-3 py-1 rounded-md text-sm sm:text-base ${
              page === currentPage
                ? "bg-blue-600 text-white font-medium"
                : page === "ellipsis" ||
                  page === "ellipsis1" ||
                  page === "ellipsis2"
                ? "text-gray-700 cursor-default border-none"
                : "text-gray-700 hover:bg-gray-100 border border-gray-300"
            }`}
          >
            {page === "ellipsis" || page === "ellipsis1" || page === "ellipsis2"
              ? "..."
              : page}
          </button>
        ))}

        {/* Next page button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === pageCount}
          className={`px-2 sm:px-3 py-1 rounded-md flex items-center ${
            currentPage === pageCount
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
          }`}
          aria-label="Next page"
          title="Next page"
        >
          <span className="text-sm hidden sm:inline">Next</span>
          <FaChevronRight className="h-3 w-3 sm:ml-1" />
        </button>
      </nav>
    </div>
  );
}
