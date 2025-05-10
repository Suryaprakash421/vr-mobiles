"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaSearch, FaTimes } from "react-icons/fa";

export default function SearchBar({ onSearch }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);

      // If onSearch prop exists, call it directly (for client-side filtering)
      if (onSearch) {
        onSearch(searchTerm);
      }
      // Otherwise update the URL (for server-side filtering)
      else if (searchTerm.trim()) {
        router.push(
          `/job-cards?search=${encodeURIComponent(searchTerm.trim())}`
        );
      } else {
        router.push("/job-cards");
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, router, onSearch]);

  const handleSearch = (e) => {
    e.preventDefault();

    // Immediately trigger search on form submit
    if (onSearch) {
      onSearch(searchTerm);
    } else if (searchTerm.trim()) {
      router.push(`/job-cards?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push("/job-cards");
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    if (onSearch) {
      onSearch("");
    } else {
      router.push("/job-cards");
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex w-full max-w-lg relative">
      <div className="relative flex-grow">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by bill number, name, or phone..."
          className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-medium text-gray-900"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <FaTimes className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 font-medium"
      >
        Search
      </button>
    </form>
  );
}
