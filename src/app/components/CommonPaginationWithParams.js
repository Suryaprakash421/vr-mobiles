"use client";

import SearchParamsProvider from "./SearchParamsProvider";
import CommonPagination from "./CommonPagination";

export default function CommonPaginationWithParams(props) {
  const fallback = (
    <div className="flex justify-center items-center mt-4">
      <div className="h-8 w-64 bg-gray-100 animate-pulse rounded-md"></div>
    </div>
  );

  return (
    <SearchParamsProvider fallback={fallback}>
      {(searchParams) => {
        const currentPage = parseInt(searchParams.get("page") || "1");
        const pageSize = parseInt(searchParams.get("pageSize") || "5");
        
        return (
          <CommonPagination
            {...props}
            currentPage={props.currentPage || currentPage}
            pageSize={props.pageSize || pageSize}
            searchParamsData={searchParams}
            useClientSideNavigation={props.useClientSideNavigation !== undefined ? props.useClientSideNavigation : true}
          />
        );
      }}
    </SearchParamsProvider>
  );
}
