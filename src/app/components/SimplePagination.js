"use client";

import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function SimplePagination({
  totalItems,
  currentPage = 1,
  pageSize = 10,
  onPageChange,
}) {
  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  
  // Don't show pagination if there's only one page
  if (totalPages <= 1) return null;
  
  // Generate an array of page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    
    // For small number of pages, show all
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }
    
    // Always show first page
    pages.push(1);
    
    // For current page near the start
    if (currentPage <= 4) {
      pages.push(2, 3, 4, 5);
      pages.push("...");
      pages.push(totalPages);
      return pages;
    }
    
    // For current page near the end
    if (currentPage >= totalPages - 3) {
      pages.push("...");
      pages.push(totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      return pages;
    }
    
    // For current page in the middle
    pages.push("...");
    pages.push(currentPage - 1, currentPage, currentPage + 1);
    pages.push("...");
    pages.push(totalPages);
    
    return pages;
  };
  
  const handlePageClick = (page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };
  
  const pageNumbers = getPageNumbers();
  
  return (
    <div className="flex justify-center items-center mt-4">
      <div className="flex items-center space-x-2">
        {/* Previous button */}
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-md flex items-center ${
            currentPage === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
          }`}
        >
          <FaChevronLeft className="h-3 w-3 mr-1" />
          <span>Prev</span>
        </button>
        
        {/* Page numbers */}
        {pageNumbers.map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === "number" && handlePageClick(page)}
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
        
        {/* Next button */}
        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded-md flex items-center ${
            currentPage === totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
          }`}
        >
          <span>Next</span>
          <FaChevronRight className="h-3 w-3 ml-1" />
        </button>
      </div>
    </div>
  );
}
