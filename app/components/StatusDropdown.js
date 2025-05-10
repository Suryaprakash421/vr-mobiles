"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Portal from "./Portal";

const STATUS_OPTIONS = [
  {
    value: "pending",
    label: "Pending",
    color: "bg-yellow-100 text-yellow-900 border-yellow-200 font-medium",
  },
  {
    value: "in-progress",
    label: "In Progress",
    color: "bg-blue-100 text-blue-900 border-blue-200 font-medium",
  },
  {
    value: "completed",
    label: "Completed",
    color: "bg-green-100 text-green-900 border-green-200 font-medium",
  },
];

export default function StatusDropdown({ jobId, currentStatus }) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus || "pending");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    // Add event listener when dropdown is open
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Find the current status option
  const currentOption =
    STATUS_OPTIONS.find((option) => option.value === status) ||
    STATUS_OPTIONS[0];

  const updateStatus = async (newStatus) => {
    if (newStatus === status) {
      setIsOpen(false);
      return;
    }

    console.log(
      `Updating status for job ${jobId} from ${status} to ${newStatus}`
    );
    setIsUpdating(true);

    try {
      const response = await fetch(`/api/job-cards/${jobId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      console.log("Status update response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to update status");
      }

      setStatus(newStatus);
      router.refresh();
      console.log("Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status: " + error.message);
    } finally {
      setIsUpdating(false);
      setIsOpen(false);
    }
  };

  const [buttonPosition, setButtonPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  // Update button position when dropdown opens
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      setButtonPosition({
        top: rect.top + rect.height + window.scrollY,
        left: rect.left + rect.width / 2 + window.scrollX,
        width: rect.width,
      });
    }
  }, [isOpen]);

  return (
    <div className="inline-block" ref={dropdownRef}>
      <button
        type="button"
        className={`inline-flex items-center px-3 py-1 rounded-full border ${
          currentOption.color
        } text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
          isUpdating ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        disabled={isUpdating}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span>{currentOption.label}</span>
        <svg
          className="ml-1 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <Portal>
          <div
            className="fixed inset-0 z-[9998]"
            onClick={() => setIsOpen(false)}
          />
          <div
            className="fixed z-[9999] w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
            onClick={(e) => e.stopPropagation()}
            style={{
              top: buttonPosition.top + 5,
              left: buttonPosition.left,
              transform: "translateX(-50%)",
              boxShadow:
                "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            }}
          >
            <div className="py-1" role="listbox">
              {STATUS_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  className={`${
                    option.value === status ? "bg-gray-100" : ""
                  } block w-full text-left px-4 py-2 text-sm text-gray-900 font-medium hover:bg-gray-50 focus:outline-none focus:bg-gray-100`}
                  onClick={() => updateStatus(option.value)}
                  role="option"
                  aria-selected={option.value === status}
                >
                  <div className="flex items-center">
                    <span
                      className={`inline-block w-3 h-3 rounded-full mr-2 ${
                        option.value === "pending"
                          ? "bg-yellow-500"
                          : option.value === "in-progress"
                          ? "bg-blue-500"
                          : "bg-green-500"
                      }`}
                    ></span>
                    {option.label}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
