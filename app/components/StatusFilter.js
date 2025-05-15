"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

// Status options with their display properties
const STATUS_OPTIONS = [
  { value: "all", label: "All", color: "#4338ca" },
  { value: "pending", label: "Pending", color: "#d97706" },
  { value: "in-progress", label: "In Progress", color: "#2563eb" },
  { value: "completed", label: "Completed", color: "#059669" },
];

export default function StatusFilter({ currentStatus = "all" }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Ensure currentStatus is a string and has a default value
  const status = currentStatus ? String(currentStatus) : "all";

  console.log(`StatusFilter rendered with currentStatus: "${status}"`);
  console.log("Current URL:", pathname + "?" + searchParams.toString());

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;

    console.log(`Status changed to: ${newStatus}`);

    // Create a form and submit it to force a full page reload
    const form = document.createElement("form");
    form.method = "GET";
    form.action = pathname;

    // Add all existing parameters except status and page
    for (const [key, value] of searchParams.entries()) {
      if (key !== "status" && key !== "page") {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
      }
    }

    // Add the new status parameter if it's not "all"
    if (newStatus !== "all") {
      const statusInput = document.createElement("input");
      statusInput.type = "hidden";
      statusInput.name = "status";
      statusInput.value = newStatus;
      form.appendChild(statusInput);
    }

    // Always reset to page 1
    const pageInput = document.createElement("input");
    pageInput.type = "hidden";
    pageInput.name = "page";
    pageInput.value = "1";
    form.appendChild(pageInput);

    // Submit the form
    document.body.appendChild(form);
    console.log("Submitting form with status:", newStatus);
    form.submit();
  };

  return (
    <div className="flex items-center">
      <label
        htmlFor="statusFilter"
        className="mr-2 text-sm font-medium text-gray-900"
      >
        Filter by Status:
      </label>
      <select
        id="statusFilter"
        value={status}
        onChange={handleStatusChange}
        className="border border-gray-300 rounded-md px-3 py-2 text-sm font-medium focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-indigo-700"
        style={{ fontWeight: 500 }}
      >
        {STATUS_OPTIONS.map((option) => (
          <option
            key={option.value}
            value={option.value}
            style={{ color: option.color, fontWeight: 500 }}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
