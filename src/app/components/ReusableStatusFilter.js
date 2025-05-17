"use client";

import { useState, useEffect } from "react";

// Status options with their display properties and colors
const STATUS_OPTIONS = [
  {
    value: "all",
    label: "All Statuses",
    color: "bg-gradient-to-r from-blue-50 to-purple-50 text-gray-800",
  },
  { value: "pending", label: "Pending", color: "bg-amber-50 text-amber-800" },
  {
    value: "in-progress",
    label: "In Progress",
    color: "bg-blue-50 text-blue-800",
  },
  {
    value: "completed",
    label: "Completed",
    color: "bg-green-50 text-green-800",
  },
];

export default function ReusableStatusFilter({
  currentStatus = "all",
  onStatusChange,
  className = "",
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

  // Find the current status option for styling
  const currentStatusOption =
    STATUS_OPTIONS.find((option) => option.value === status) ||
    STATUS_OPTIONS[0];

  return (
    <div className={`flex items-center ${className}`}>
      <label
        htmlFor="status-filter"
        className="block text-sm font-bold text-gray-800 mr-3"
      >
        Status:
      </label>
      <div className="relative">
        <select
          id="status-filter"
          value={status}
          onChange={handleStatusChange}
          className={`appearance-none block w-full min-w-[160px] rounded-lg border-2 border-gray-200
            shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50
            text-sm font-semibold px-4 py-2.5 pr-10 transition-all duration-200 ease-in-out
            hover:border-blue-400 ${currentStatusOption.color}`}
        >
          {STATUS_OPTIONS.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className={`${option.color} font-medium py-2`}
            >
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
