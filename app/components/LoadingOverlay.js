'use client';

import LoadingSpinner from './LoadingSpinner';

export default function LoadingOverlay({ isVisible, message = 'Loading...', fullScreen = true }) {
  if (!isVisible) return null;
  
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
          <LoadingSpinner size="lg" color="blue" />
          <p className="mt-3 text-gray-900 font-medium">{message}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-lg">
      <div className="flex flex-col items-center">
        <LoadingSpinner size="md" color="blue" />
        <p className="mt-2 text-gray-900 font-medium">{message}</p>
      </div>
    </div>
  );
}
