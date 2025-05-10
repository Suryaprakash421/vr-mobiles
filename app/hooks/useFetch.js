'use client';

import { useState, useCallback } from 'react';

/**
 * Custom hook for making API calls with loading state
 * @param {Object} options - Configuration options
 * @param {boolean} options.showLoadingOverlay - Whether to show a full-screen loading overlay
 * @returns {Object} - The fetch state and fetchData function
 */
export default function useFetch(options = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  
  const fetchData = useCallback(async (url, fetchOptions = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(url, fetchOptions);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
      return result;
    } catch (err) {
      setError(err.message || 'An error occurred');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  return { isLoading, error, data, fetchData };
}
