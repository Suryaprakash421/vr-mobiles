"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function PageSizeSelector({ pageSize }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageSizeChange = (e) => {
    const newPageSize = e.target.value;

    // Create new URLSearchParams with current params
    const params = new URLSearchParams(searchParams);

    // Update page size and reset to first page
    params.set("pageSize", newPageSize);
    params.set("page", "1");

    // Navigate to the new URL with scroll: false to prevent jumping
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
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
