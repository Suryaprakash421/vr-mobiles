"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function JobCardNavigation({ prevJobCard, nextJobCard }) {
  const router = useRouter();

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Left arrow key for previous job card
      if (e.key === "ArrowLeft" && prevJobCard) {
        router.push(`/job-cards/${prevJobCard.id}`);
      }
      // Right arrow key for next job card
      else if (e.key === "ArrowRight" && nextJobCard) {
        router.push(`/job-cards/${nextJobCard.id}`);
      }
    };

    // Add event listener
    window.addEventListener("keydown", handleKeyDown);

    // Clean up
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [prevJobCard, nextJobCard, router]);

  return (
    <div className="flex justify-between items-center mt-8 border-t border-gray-200 pt-4">
      <div>
        {prevJobCard ? (
          <Link
            href={`/job-cards/${prevJobCard.id}`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            title="Previous job card (Left arrow key)"
          >
            <FaChevronLeft className="mr-2 h-4 w-4" />
            Previous: {prevJobCard.customerName} - #{prevJobCard.billNo}
          </Link>
        ) : (
          <button
            disabled
            className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-md shadow-sm text-sm font-medium text-gray-400 bg-gray-50 cursor-not-allowed"
          >
            <FaChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </button>
        )}
      </div>

      <div>
        {nextJobCard ? (
          <Link
            href={`/job-cards/${nextJobCard.id}`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            title="Next job card (Right arrow key)"
          >
            Next: {nextJobCard.customerName} - #{nextJobCard.billNo}
            <FaChevronRight className="ml-2 h-4 w-4" />
          </Link>
        ) : (
          <button
            disabled
            className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-md shadow-sm text-sm font-medium text-gray-400 bg-gray-50 cursor-not-allowed"
          >
            Next
            <FaChevronRight className="ml-2 h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
