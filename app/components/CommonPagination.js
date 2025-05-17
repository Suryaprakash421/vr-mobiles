"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function CommonPagination({
  totalItems,
  currentPage = 1,
  pageSize = 10,
  useClientSideNavigation = true,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pageCount, setPageCount] = useState(Math.ceil(totalItems / pageSize));
  const [isNavigating, setIsNavigating] = useState(false);

  // Update page count when totalItems or pageSize changes
  useEffect(() => {
    setPageCount(Math.ceil(totalItems / pageSize));
  }, [totalItems, pageSize]);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pageCount && !isNavigating) {
      setIsNavigating(true);

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

  // Generate page numbers to display with the new logic
  const getPageNumbers = () => {
    const pages = [];

    if (pageCount <= 3) {
      // Show all pages if there are 3 or fewer
      for (let i = 1; i <= pageCount; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // For current page 1, show pages 1, 2, ..., last
      if (currentPage === 1) {
        pages.push(2);
        if (pageCount > 3) {
          pages.push("ellipsis");
        }
      }
      // For current page 2, show pages 1, 2, 3, ..., last
      else if (currentPage === 2) {
        pages.push(2);
        if (pageCount > 3) {
          pages.push(3);
          if (pageCount > 4) {
            pages.push("ellipsis");
          }
        }
      }
      // For last page, show pages 1, ..., second-to-last, last
      else if (currentPage === pageCount) {
        if (pageCount > 3) {
          pages.push("ellipsis");
          pages.push(pageCount - 1);
        }
      }
      // For second-to-last page, show pages 1, ..., third-to-last, second-to-last, last
      else if (currentPage === pageCount - 1) {
        if (pageCount > 3) {
          pages.push("ellipsis");
          if (pageCount > 4) {
            pages.push(pageCount - 2);
          }
          pages.push(pageCount - 1);
        }
      }
      // For pages in the middle, show pages 1, ..., current, ..., last
      else {
        pages.push("ellipsis1");
        pages.push(currentPage);
        pages.push("ellipsis2");
      }

      // Always show last page if not already included
      if (!pages.includes(pageCount)) {
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
