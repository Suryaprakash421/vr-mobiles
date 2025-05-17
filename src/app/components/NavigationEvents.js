'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function NavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Create a custom event for navigation start
    const startNavigation = () => {
      const event = new CustomEvent('navigationStart');
      document.dispatchEvent(event);
    };

    // Create a custom event for navigation end
    const endNavigation = () => {
      const event = new CustomEvent('navigationEnd');
      document.dispatchEvent(event);
    };

    // Dispatch navigation end event when route changes
    endNavigation();

    // Cleanup function (will be called before the next effect runs)
    return () => {
      // This runs when navigation starts
      startNavigation();
    };
  }, [pathname, searchParams]);

  return null;
}
