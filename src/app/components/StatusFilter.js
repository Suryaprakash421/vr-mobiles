"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

// Status options with their display properties
const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

export default function StatusFilter({ currentStatus = "all" }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState(currentStatus);

  // Update status state when currentStatus prop changes
  useEffect(() => {
    setStatus(currentStatus);
  }, [currentStatus]);

  console.log(`StatusFilter rendered with currentStatus: "${status}"`);
  console.log("Current URL:", pathname + "?" + searchParams.toString());

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;

    console.log(`Status changed to: ${newStatus}`);

    // Create a new URLSearchParams object to preserve existing parameters
    const params = new URLSearchParams(searchParams.toString());

    // Update status parameter and reset to first page
    if (newStatus !== "all") {
      params.set("status", newStatus);
    } else {
      params.delete("status");
    }
    params.set("page", "1");

    // Build the new URL - use the job-cards-filtered page for status filtering
    const basePath =
      pathname === "/job-cards" ? "/job-cards-filtered" : pathname;
    const newUrl = `${basePath}?${params.toString()}`;
    console.log(`Navigating to: ${newUrl}`);

    // Use window.location for a hard navigation to ensure server-side rendering
    window.location.href = newUrl;
  };

  return (
    <div className="flex items-center">
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
