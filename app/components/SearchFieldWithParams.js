"use client";

import SearchParamsProvider from "./SearchParamsProvider";
import SearchField from "./SearchField";

export default function SearchFieldWithParams(props) {
  const fallback = (
    <div className="w-full h-10 bg-gray-100 animate-pulse rounded-lg"></div>
  );

  return (
    <SearchParamsProvider fallback={fallback}>
      {(searchParams) => (
        <SearchField
          {...props}
          initialValue={props.initialValue || searchParams.get("search") || ""}
          searchParamsData={searchParams}
        />
      )}
    </SearchParamsProvider>
  );
}
