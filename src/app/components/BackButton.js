'use client';

import Link from 'next/link';

export default function BackButton({ href, label }) {
  return (
    <Link 
      href={href} 
      className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
      aria-label={label || "Go back"}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-6 w-6 text-gray-600" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M10 19l-7-7m0 0l7-7m-7 7h18" 
        />
      </svg>
    </Link>
  );
}
