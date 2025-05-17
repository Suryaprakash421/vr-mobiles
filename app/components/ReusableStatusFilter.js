"use client";

import { useState, useEffect } from "react";

// Status options with their display properties
const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

export default function ReusableStatusFilter({ 
  currentStatus = "all", 
  onStatusChange,
  className = "" 
}) {
  const [status, setStatus] = useState(currentStatus);

  // Update status state when currentStatus prop changes
  useEffect(() => {
    setStatus(currentStatus);
  }, [currentStatus]);

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    
    // Call the onStatusChange callback with the new status
    if (onStatusChange) {
      onStatusChange(newStatus);
    }
  };

  return (
    <div className={`flex items-center ${className}`}>
      <label
        htmlFor="status-filter"
        className="block text-sm font-medium text-gray-700 mr-2"
      >
        Status:
      </label>
      <select
        id="status-filter"
        value={status}
        onChange={handleStatusChange}
        className="block w-full max-w-xs rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm font-medium text-gray-900 px-3 py-2"
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
