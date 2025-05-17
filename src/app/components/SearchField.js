"use client";

import { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import { useRouter, usePathname } from "next/navigation";
import { debounce } from "lodash";

export default function SearchField({
  placeholder = "Search...",
  debounceTime = 300,
  onSearch,
  initialValue = "",
  className = "",
  searchParamsData,
}) {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = searchParamsData;
  const searchInputRef = useRef(null);

  // Create a debounced search function
  const debouncedSearch = useRef(
    debounce((value) => {
      if (onSearch) {
        onSearch(value);
      } else {
        // Default behavior: update URL with search parameter
        const params = new URLSearchParams(searchParams.toString());

        if (value) {
          params.set("search", value);
        } else {
          params.delete("search");
        }

        // Preserve other parameters like page and pageSize
        const newUrl = `${pathname}?${params.toString()}`;
        router.push(newUrl);
      }
    }, debounceTime)
  ).current;

  // Update search when input changes
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchTerm("");
    debouncedSearch("");
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Clean up debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <FaSearch className="w-4 h-4 text-gray-500" />
        </div>
        <input
          ref={searchInputRef}
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          className="block w-full p-2 pl-10 text-sm font-medium text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
          placeholder={placeholder}
        />
        {searchTerm && (
          <button
            onClick={handleClearSearch}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
          >
            <span className="text-xl font-medium">&times;</span>
          </button>
        )}
      </div>
    </div>
  );
}
