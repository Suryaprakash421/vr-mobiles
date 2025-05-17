"use client";

import { useState } from "react";

export default function ClientPageSizeSelector({ pageSize, onPageSizeChange }) {
  const [isChanging, setIsChanging] = useState(false);

  const handlePageSizeChange = (e) => {
    if (isChanging) return;

    const newPageSize = parseInt(e.target.value);
    setIsChanging(true);

    // Call the onPageSizeChange callback with the new page size
    if (onPageSizeChange) {
      onPageSizeChange(newPageSize);
    }

    // Reset changing state after a short delay
    setTimeout(() => {
      setIsChanging(false);
    }, 300);
  };

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="pageSize" className="text-sm font-medium text-gray-900">
        Show
      </label>
      <select
        id="pageSize"
        value={pageSize}
        onChange={handlePageSizeChange}
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
  );
}
