"use client";

import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeoutId, setTimeoutId] = useState(null);

  // Reset progress when route changes
  useEffect(() => {
    // Start loading
    setIsLoading(true);
    setProgress(0);

    // Clear any existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prevProgress + 10;
      });
    }, 100);

    // Complete the progress after a short delay
    const id = setTimeout(() => {
      clearInterval(interval);
      setProgress(100);

      // Hide the progress bar after completion
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 500);
    }, 500);

    setTimeoutId(id);

    return () => {
      clearInterval(interval);
      if (timeoutId) clearTimeout(timeoutId);
      if (id) clearTimeout(id);
    };
  }, [pathname, searchParams, timeoutId]);

  if (!isLoading && progress === 0) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div
        className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300 ease-out"
        style={{
          width: `${progress}%`,
          opacity: progress === 100 ? "0" : "1",
          transition: "width 0.3s ease-out, opacity 0.5s ease-in-out",
        }}
      />
    </div>
  );
}
