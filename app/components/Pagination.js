'use client';

import { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function Pagination({ 
  totalItems, 
  currentPage = 1, 
  pageSize = 10, 
  onPageChange,
  onPageSizeChange 
}) {
  const [pageCount, setPageCount] = useState(Math.ceil(totalItems / pageSize));
  
  // Update page count when totalItems or pageSize changes
  useEffect(() => {
    setPageCount(Math.ceil(totalItems / pageSize));
  }, [totalItems, pageSize]);
  
  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pageCount) {
      onPageChange(newPage);
    }
  };
  
  // Handle page size change
  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    onPageSizeChange(newSize);
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
        pages.push('...');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add ellipsis if needed
      if (endPage < pageCount - 1) {
        pages.push('...');
      }
      
      // Always show last page
      pages.push(pageCount);
    }
    
    return pages;
  };
  
  // Don't show pagination if there's only one page
  if (pageCount <= 1) return null;
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mt-6 space-y-3 md:space-y-0">
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-700">
          Showing {Math.min((currentPage - 1) * pageSize + 1, totalItems)} to {Math.min(currentPage * pageSize, totalItems)} of {totalItems} entries
        </span>
        <div className="ml-4">
          <label htmlFor="pageSize" className="text-sm font-medium text-gray-700 mr-2">
            Show:
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={handlePageSizeChange}
            className="border border-gray-300 rounded-md text-sm py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>
      
      <nav className="flex items-center space-x-1">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-md ${
            currentPage === 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
          aria-label="Previous page"
        >
          <FaChevronLeft className="h-4 w-4" />
        </button>
        
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && handlePageChange(page)}
            disabled={page === '...'}
            className={`px-3 py-1 rounded-md ${
              page === currentPage
                ? 'bg-blue-600 text-white font-medium'
                : page === '...'
                ? 'text-gray-700 cursor-default'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {page}
          </button>
        ))}
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === pageCount}
          className={`p-2 rounded-md ${
            currentPage === pageCount
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
          aria-label="Next page"
        >
          <FaChevronRight className="h-4 w-4" />
        </button>
      </nav>
    </div>
  );
}
