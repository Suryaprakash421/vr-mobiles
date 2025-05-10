'use client';

export default function LoadingSpinner({ size = 'md', color = 'blue', fullScreen = false }) {
  // Size classes
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };
  
  // Color classes
  const colorClasses = {
    blue: 'text-blue-600',
    violet: 'text-violet-600',
    indigo: 'text-indigo-600',
    gray: 'text-gray-600',
    white: 'text-white'
  };
  
  const spinnerSize = sizeClasses[size] || sizeClasses.md;
  const spinnerColor = colorClasses[color] || colorClasses.blue;
  
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
          <svg 
            className={`animate-spin ${spinnerSize} ${spinnerColor}`} 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            ></circle>
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="mt-3 text-gray-800 font-medium">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <svg 
      className={`animate-spin ${spinnerSize} ${spinnerColor}`} 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      ></circle>
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
}
