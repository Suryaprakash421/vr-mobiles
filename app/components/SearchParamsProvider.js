"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

// This component wraps any component that needs to use search params
// It handles the useSearchParams() hook and passes the values as props
export function SearchParamsWrapper({ children }) {
  const searchParams = useSearchParams();
  
  // Clone children and pass searchParams as a prop
  return children(searchParams);
}

// This component provides a Suspense boundary for components that use search params
export default function SearchParamsProvider({ fallback, children }) {
  return (
    <Suspense fallback={fallback || <div>Loading...</div>}>
      <SearchParamsWrapper>
        {(searchParams) => {
          // Pass searchParams to children as a function
          return typeof children === "function" 
            ? children(searchParams) 
            : children;
        }}
      </SearchParamsWrapper>
    </Suspense>
  );
}
