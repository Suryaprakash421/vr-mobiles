'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function GlobalLoadingOverlay() {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('Loading...');
  const [longOperation, setLongOperation] = useState(false);
  
  useEffect(() => {
    // Function to show the loading overlay
    const showLoading = (event) => {
      if (event.detail?.message) {
        setMessage(event.detail.message);
      } else {
        setMessage('Loading...');
      }
      setIsVisible(true);
      
      // If operation takes more than 1 second, consider it a long operation
      const timer = setTimeout(() => {
        setLongOperation(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    };
    
    // Function to hide the loading overlay
    const hideLoading = () => {
      setIsVisible(false);
      setLongOperation(false);
    };
    
    // Listen for custom events to show/hide loading overlay
    window.addEventListener('show-loading-overlay', showLoading);
    window.addEventListener('hide-loading-overlay', hideLoading);
    
    // Listen for form submissions
    const handleFormSubmit = () => {
      showLoading({ detail: { message: 'Submitting...' } });
    };
    
    // Listen for API calls
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
      // Only show loading for API calls, not for static assets
      const url = args[0].toString();
      if (url.includes('/api/') && !url.includes('/api/auth/session')) {
        showLoading({ detail: { message: 'Processing...' } });
        
        return originalFetch.apply(this, args)
          .then(response => {
            hideLoading();
            return response;
          })
          .catch(error => {
            hideLoading();
            throw error;
          });
      }
      return originalFetch.apply(this, args);
    };
    
    document.addEventListener('submit', handleFormSubmit);
    
    return () => {
      window.addEventListener('show-loading-overlay', showLoading);
      window.addEventListener('hide-loading-overlay', hideLoading);
      document.removeEventListener('submit', handleFormSubmit);
      window.fetch = originalFetch;
    };
  }, []);
  
  // Don't render anything on the server
  if (typeof window === 'undefined') return null;
  
  // Don't render if not visible
  if (!isVisible) return null;
  
  // Use portal to render at the root level
  return createPortal(
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center max-w-md mx-auto">
        <div className="relative w-16 h-16 mb-4">
          {/* Spinner animation */}
          <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 border-4 border-transparent border-b-purple-600 rounded-full animate-spin" style={{ animationDuration: '1.5s' }}></div>
        </div>
        <p className="text-gray-900 font-medium text-center">{message}</p>
        
        {longOperation && (
          <p className="text-gray-500 text-sm mt-2 text-center">
            This is taking longer than expected. Please wait...
          </p>
        )}
      </div>
    </div>,
    document.body
  );
}
