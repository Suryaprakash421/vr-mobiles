"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaSearch, FaTimes } from "react-icons/fa";
import "../styles/search-bar.css";

export default function SearchBar({ onSearch, searchBarRef }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef(null);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);

      // If onSearch prop exists, call it directly (for client-side filtering)
      if (onSearch) {
        onSearch(searchTerm);
      }
      // Otherwise update the URL (for server-side filtering)
      else {
        // Create new URLSearchParams with current params
        const params = new URLSearchParams(searchParams);

        // Update search parameter and reset to first page
        if (searchTerm.trim()) {
          params.set("search", searchTerm.trim());
        } else {
          params.delete("search");
        }
        params.set("page", "1");

        // Navigate to the new URL with the current path
        const currentPath = window.location.pathname;
        router.push(`${currentPath}?${params.toString()}`);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, router, onSearch]);

  const handleSearch = (e) => {
    e.preventDefault();

    // Immediately trigger search on form submit
    if (onSearch) {
      onSearch(searchTerm);
    } else {
      // Create new URLSearchParams with current params
      const params = new URLSearchParams(searchParams);

      // Update search parameter and reset to first page
      if (searchTerm.trim()) {
        params.set("search", searchTerm.trim());
      } else {
        params.delete("search");
      }
      params.set("page", "1");

      // Navigate to the new URL with the current path
      const currentPath = window.location.pathname;
      router.push(`${currentPath}?${params.toString()}`);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    if (onSearch) {
      onSearch("");
    } else {
      // Create new URLSearchParams with current params
      const params = new URLSearchParams(searchParams);

      // Remove search parameter and reset to first page
      params.delete("search");
      params.set("page", "1");

      // Navigate to the new URL with the current path
      const currentPath = window.location.pathname;
      router.push(`${currentPath}?${params.toString()}`);
    }
  };

  // Expose the clearSearch method via ref
  React.useImperativeHandle(
    searchBarRef,
    () => ({
      clearSearch,
    }),
    []
  );

  // Focus the input when the component mounts
  useEffect(() => {
    // Auto-focus on desktop but not on mobile (to avoid keyboard popping up)
    if (inputRef.current && window.innerWidth > 768) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <form
      onSubmit={handleSearch}
      className="flex w-full max-w-lg relative group"
    >
      <div
        className={`relative flex-grow shadow-md transition-all duration-300
          ${isFocused ? "search-input-focus" : ""}
          search-input-container`}
      >
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <FaSearch
            className={`h-5 w-5 transition-all duration-300 search-icon ${
              isFocused ? "text-purple-500" : "text-blue-500"
            }`}
          />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search by bill number, name, or phone..."
          className={`pl-12 w-full px-5 py-3 border-2 rounded-l-lg font-medium text-gray-900
            transition-all duration-300 bg-white search-input-typing
            ${
              isFocused
                ? "border-purple-500 ring-2 ring-purple-200"
                : "border-gray-200"
            }`}
          aria-label="Search job cards"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            aria-label="Clear search"
          >
            <FaTimes className="h-5 w-5 text-gray-400 hover:text-red-500 transition-colors duration-300" />
          </button>
        )}

        {/* Animated bottom border - only on focus */}
        <div
          className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500
          ${isFocused ? "w-full" : "w-0"}`}
        ></div>
      </div>
      <button
        type="submit"
        className={`px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-r-lg
          hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2
          focus:ring-purple-500 focus:ring-offset-2 font-bold shadow-md hover:shadow-lg
          transition-all duration-300 transform hover:translate-y-[-1px]
          ${searchTerm ? "search-button-pulse" : ""}`}
        aria-label="Submit search"
      >
        Search
      </button>
    </form>
  );
}
