"use client";

import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function GlobalLoadingIndicator() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Track navigation state
  useEffect(() => {
    if (pathname !== prevPathname) {
      setIsLoading(true);
      setPrevPathname(pathname);
    }
  }, [pathname, prevPathname]);

  // Listen for custom navigation events
  useEffect(() => {
    const handleNavigationStart = () => {
      setIsLoading(true);
    };

    const handleNavigationEnd = () => {
      // Add a small delay to ensure the loading indicator is visible
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    };

    // Add event listeners
    document.addEventListener("navigationStart", handleNavigationStart);
    document.addEventListener("navigationEnd", handleNavigationEnd);

    return () => {
      document.removeEventListener("navigationStart", handleNavigationStart);
      document.removeEventListener("navigationEnd", handleNavigationEnd);
    };
  }, []);

  // Clear loading state when navigation is complete
  useEffect(() => {
    if (isLoading) {
      // Set a timeout to ensure loading state is cleared even if something goes wrong
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 8000); // Increased to 8 seconds for better visibility

      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // Clear loading when searchParams change (indicates navigation is complete)
  useEffect(() => {
    setIsLoading(false);
  }, [searchParams]);

  // Add click handler to track button and link clicks
  useEffect(() => {
    const handleClick = (e) => {
      // Check for button clicks
      if (
        (e.target.tagName === "BUTTON" && !e.target.disabled) ||
        // Check for link clicks that navigate within the app
        (e.target.tagName === "A" &&
          e.target.href &&
          e.target.href.startsWith(window.location.origin)) ||
        // Check for parent links (when clicking on a child of an <a> tag)
        (e.target.closest &&
          e.target.closest("a") &&
          e.target.closest("a").href &&
          e.target.closest("a").href.startsWith(window.location.origin))
      ) {
        setIsLoading(true);

        // Set a timeout to ensure loading state is cleared even if no navigation occurs
        const timer = setTimeout(() => {
          setIsLoading(false);
        }, 5000); // 5 seconds for better visibility

        return () => clearTimeout(timer);
      }
    };

    // Add form submit handler
    const handleFormSubmit = () => {
      setIsLoading(true);
    };

    document.addEventListener("click", handleClick);
    document.addEventListener("submit", handleFormSubmit);

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("submit", handleFormSubmit);
    };
  }, []);

  // Add API call tracking
  useEffect(() => {
    const originalFetch = window.fetch;

    window.fetch = function (...args) {
      // Only show loading for API calls, not for static assets
      const url = args[0].toString();
      if (url.includes("/api/") && !url.includes("/api/auth/session")) {
        setIsLoading(true);

        return originalFetch
          .apply(this, args)
          .then((response) => {
            setIsLoading(false);
            return response;
          })
          .catch((error) => {
            setIsLoading(false);
            throw error;
          });
      }
      return originalFetch.apply(this, args);
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Top loading bar */}
      <div className="h-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient-x shadow-md"></div>

      {/* Loading indicator in the corner */}
      <div className="fixed top-4 right-4 flex items-center bg-white px-4 py-2 rounded-full shadow-lg border border-gray-200">
        <div className="w-4 h-4 rounded-full bg-blue-600 mr-2 animate-pulse"></div>
        <span className="text-sm font-medium text-gray-900">Loading...</span>
      </div>
    </div>
  );
}

// Add this to your global CSS
const styles = `
@keyframes gradient-x {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.animate-gradient-x {
  background-size: 200% 100%;
  animation: gradient-x 2s linear infinite;
}
`;
