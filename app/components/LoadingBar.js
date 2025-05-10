"use client";

import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function LoadingBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Track navigation state
  useEffect(() => {
    if (pathname !== prevPathname) {
      // Start loading
      setLoading(true);
      setProgress(0);
      setPrevPathname(pathname);

      // Simulate progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Cleanup
      return () => clearInterval(interval);
    }
  }, [pathname, prevPathname]);

  // Complete loading when content is loaded
  useEffect(() => {
    if (loading) {
      // Wait for DOM to be fully loaded
      const observer = new MutationObserver((mutations) => {
        // Check if significant DOM changes have occurred
        const significantChanges = mutations.some(
          (mutation) =>
            mutation.addedNodes.length > 3 || // Multiple nodes added
            mutation.removedNodes.length > 3 || // Multiple nodes removed
            (mutation.target.nodeName === "MAIN" &&
              mutation.addedNodes.length > 0) // Content added to main
        );

        if (significantChanges) {
          // Complete the progress
          setProgress(100);

          // Hide the loading bar after a delay
          const timeout = setTimeout(() => {
            setLoading(false);
            setProgress(0);
          }, 500);

          // Disconnect observer after completion
          observer.disconnect();
          return () => clearTimeout(timeout);
        }
      });

      // Observe the entire document for changes
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false,
      });

      // Fallback timeout to ensure loading eventually completes
      const fallbackTimeout = setTimeout(() => {
        setProgress(100);
        setTimeout(() => {
          setLoading(false);
          setProgress(0);
        }, 500);
        observer.disconnect();
      }, 5000); // 5 second maximum loading time

      return () => {
        observer.disconnect();
        clearTimeout(fallbackTimeout);
      };
    }
  }, [searchParams, loading]);

  // Add click handler to track button clicks
  useEffect(() => {
    const handleButtonClick = (e) => {
      if (e.target.tagName === "BUTTON" && !e.target.disabled) {
        setLoading(true);
        setProgress(0);

        // Simulate progress for button clicks
        const interval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 90) {
              clearInterval(interval);
              return 90;
            }
            return prev + 10;
          });
        }, 100);

        // Complete after a timeout if no navigation occurs
        const timeout = setTimeout(() => {
          clearInterval(interval);
          setProgress(100);

          setTimeout(() => {
            setLoading(false);
            setProgress(0);
          }, 500);
        }, 2000);

        return () => {
          clearInterval(interval);
          clearTimeout(timeout);
        };
      }
    };

    document.addEventListener("click", handleButtonClick);
    return () => document.removeEventListener("click", handleButtonClick);
  }, []);

  if (!loading && progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 h-2 z-50">
      <div
        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 ease-out shadow-md shadow-blue-400/50"
        style={{ width: `${progress}%` }}
      />
      {/* Add a pulsing dot at the end of the progress bar */}
      {progress > 0 && progress < 100 && (
        <div
          className="absolute top-0 h-full aspect-square rounded-full bg-white shadow-lg shadow-purple-500/50 animate-pulse"
          style={{ left: `${progress}%`, transform: "translateX(-50%)" }}
        />
      )}
    </div>
  );
}
