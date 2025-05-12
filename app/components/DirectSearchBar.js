"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import "../styles/search-bar.css";

export default function DirectSearchBar({ searchBarRef, onSearch }) {
  const inputRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize with empty search term to avoid hydration mismatch
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Debounce delay in milliseconds
  const DEBOUNCE_DELAY = 500;

  // Update search term from URL after component mounts (client-side only)
  useEffect(() => {
    const searchParam = searchParams.get("search") || "";
    setSearchTerm(searchParam);
    setDebouncedSearchTerm(searchParam);
  }, [searchParams]);

  // Perform the actual search
  const performSearch = useCallback(
    (term) => {
      setIsSearching(true);

      // If onSearch prop exists, call it directly (for client-side filtering)
      if (onSearch) {
        onSearch(term);
        setIsSearching(false);
      }
      // Otherwise update the URL using Next.js router (for client-side navigation)
      else {
        try {
          // Create a new URLSearchParams object to preserve existing parameters
          const params = new URLSearchParams(searchParams.toString());

          // Update search parameter and reset to first page
          if (term.trim()) {
            params.set("search", term.trim());
          } else {
            params.delete("search");
          }
          params.set("page", "1");

          // Use Next.js router for client-side navigation without full page refresh
          router.push(`${pathname}?${params.toString()}`, { scroll: false });

          // Set a timeout to reset the searching state after navigation
          setTimeout(() => {
            setIsSearching(false);
          }, 300);
        } catch (error) {
          console.error("Error updating search URL:", error);
          setIsSearching(false);
        }
      }
    },
    [onSearch, router, pathname, searchParams]
  );

  // Debounce effect - triggers search after delay when searchTerm changes
  useEffect(() => {
    // Skip the initial render
    if (debouncedSearchTerm === searchTerm) return;

    // Set typing indicator
    if (searchTerm !== debouncedSearchTerm) {
      setIsTyping(true);
    }

    // Create a timeout to update the debounced value after delay
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setIsTyping(false);

      // Only perform search if the term is different from current URL search param
      const currentSearchParam = searchParams.get("search") || "";

      if (searchTerm !== currentSearchParam) {
        performSearch(searchTerm);
      }
    }, DEBOUNCE_DELAY);

    // Cleanup function to clear the timeout if searchTerm changes again before delay completes
    return () => clearTimeout(timerId);
  }, [
    searchTerm,
    debouncedSearchTerm,
    performSearch,
    DEBOUNCE_DELAY,
    searchParams,
  ]);

  // Handle form submission - now just a fallback for accessibility
  const handleSearch = (e) => {
    e.preventDefault();
    performSearch(searchTerm);
  };

  const clearSearch = () => {
    // Clear the search term in the input field
    setSearchTerm("");
    setDebouncedSearchTerm("");

    // Perform search with empty string to clear the search
    performSearch("");
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
        <div className="relative w-full">
          {/* Search icon inside the input field */}
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            <FaSearch
              className={`h-5 w-5 transition-colors duration-300 ${
                isFocused ? "text-purple-500" : "text-blue-500"
              }`}
            />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => {
              // Update the local state, debounce will handle the search
              setSearchTerm(e.target.value);
            }}
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

          {/* Typing indicator */}
          {isTyping && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="flex space-x-1">
                <div className="h-2 w-2 bg-blue-600 rounded-full animate-pulse"></div>
                <div className="h-2 w-2 bg-indigo-600 rounded-full animate-pulse delay-150"></div>
                <div className="h-2 w-2 bg-purple-600 rounded-full animate-pulse delay-300"></div>
              </div>
            </div>
          )}
        </div>
        {/* Clear button - always render but conditionally show */}
        <button
          type="button"
          onClick={clearSearch}
          className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
            searchTerm ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          aria-label="Clear search"
        >
          <FaTimes className="h-5 w-5 text-gray-400 hover:text-red-500 transition-colors duration-300" />
        </button>

        {/* Animated bottom border - always render but conditionally style */}
        <div
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
          style={{ width: isFocused ? "100%" : "0%" }}
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
        disabled={isSearching}
      >
        <div className="flex items-center">
          {isSearching ? (
            <>
              <div className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Searching...</span>
            </>
          ) : (
            <>
              <FaSearch className="h-4 w-4 mr-2" />
              <span>Search</span>
            </>
          )}
        </div>
      </button>
    </form>
  );
}
