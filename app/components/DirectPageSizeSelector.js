"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

export default function DirectPageSizeSelector({ pageSize, searchParamsData }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = searchParamsData;
  const [isChanging, setIsChanging] = useState(false);

  const handlePageSizeChange = (e) => {
    if (isChanging) return;

    const newPageSize = e.target.value;
    setIsChanging(true);

    // Create a new URLSearchParams object to preserve existing parameters
    const params = new URLSearchParams(searchParams.toString());

    // Update page size and reset to first page
    params.set("pageSize", newPageSize);
    params.set("page", "1");

    // Use Next.js router for client-side navigation without full page refresh
    router.push(`${pathname}?${params.toString()}`, { scroll: false });

    // Reset changing state after a short delay
    setTimeout(() => {
      setIsChanging(false);
    }, 300);
  };

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="pageSize" className="text-sm font-medium text-gray-900">
        Show
      </label>
      <select
        id="pageSize"
        value={pageSize}
        onChange={handlePageSizeChange}
        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm text-gray-900 font-medium"
      >
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>
      <span className="text-sm font-medium text-gray-900">entries</span>
    </div>
  );
}
