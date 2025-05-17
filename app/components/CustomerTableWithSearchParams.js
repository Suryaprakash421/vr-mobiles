"use client";

import { Suspense } from "react";
import CustomerTable from "./CustomerTable";
import SearchParamsProvider from "./SearchParamsProvider";

export default function CustomerTableWithSearchParams() {
  const fallback = (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    </div>
  );

  return (
    <SearchParamsProvider fallback={fallback}>
      {(searchParams) => <CustomerTable searchParamsData={searchParams} />}
    </SearchParamsProvider>
  );
}
