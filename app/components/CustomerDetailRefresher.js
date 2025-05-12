"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function CustomerDetailRefresher() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Force a refresh of the page data when the component mounts
    router.refresh();

    // Set up an interval to refresh the data every 5 seconds
    const intervalId = setInterval(() => {
      router.refresh();
    }, 5000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [router, pathname]);

  return null; // This component doesn't render anything
}
