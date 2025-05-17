'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// Create context
const LoadingContext = createContext({
  isLoading: false,
  setLoading: () => {},
  progress: 0,
  setProgress: () => {},
});

// Provider component
export function LoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Reset progress when route changes
  useEffect(() => {
    // Start loading
    setIsLoading(true);
    setProgress(0);
    
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
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      
      // Hide the progress bar after completion
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 500);
    }, 500);
    
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [pathname, searchParams]);

  // Custom method to manually set loading state
  const setLoading = (loading) => {
    setIsLoading(loading);
    if (loading) {
      setProgress(0);
    } else {
      setProgress(100);
      setTimeout(() => setProgress(0), 500);
    }
  };

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading, progress, setProgress }}>
      {children}
    </LoadingContext.Provider>
  );
}

// Custom hook to use the loading context
export function useLoading() {
  return useContext(LoadingContext);
}
