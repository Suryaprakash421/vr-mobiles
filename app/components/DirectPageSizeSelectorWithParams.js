"use client";

import SearchParamsProvider from "./SearchParamsProvider";
import DirectPageSizeSelector from "./DirectPageSizeSelector";

export default function DirectPageSizeSelectorWithParams(props) {
  const fallback = (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-gray-900">Show</span>
      <div className="w-16 h-8 bg-gray-100 animate-pulse rounded-md"></div>
      <span className="text-sm font-medium text-gray-900">entries</span>
    </div>
  );

  return (
    <SearchParamsProvider fallback={fallback}>
      {(searchParams) => {
        const pageSize = parseInt(searchParams.get("pageSize") || "5");
        return (
          <DirectPageSizeSelector
            {...props}
            pageSize={props.pageSize || pageSize}
            searchParamsData={searchParams}
          />
        );
      }}
    </SearchParamsProvider>
  );
}
