"use client";

import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import LoadingSpinner from "./LoadingSpinner";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import "../styles/nprogress-custom.css";

// Configure NProgress
NProgress.configure({
  showSpinner: false,
  minimum: 0.1,
  easing: "ease",
  speed: 300,
});

export default function GlobalLoading() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Track navigation state
  useEffect(() => {
    // If pathname changed, start loading
    if (pathname !== prevPathname) {
      setIsLoading(true);
      NProgress.start();
      setPrevPathname(pathname);

      // Set a timeout to ensure loading state is cleared even if something goes wrong
      const timer = setTimeout(() => {
        setIsLoading(false);
        NProgress.done();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [pathname, prevPathname]);

  // Clear loading state when navigation is complete
  useEffect(() => {
    const handleComplete = () => {
      setIsLoading(false);
      NProgress.done();
    };

    // Use MutationObserver to detect DOM changes that indicate page load completion
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          handleComplete();
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Also clear loading when component unmounts
    return () => {
      observer.disconnect();
      handleComplete();
    };
  }, []);

  // Clear loading when searchParams change (indicates navigation is complete)
  useEffect(() => {
    setIsLoading(false);
    NProgress.done();
  }, [searchParams]);

  // Add click handler to track link clicks
  useEffect(() => {
    const handleLinkClick = (e) => {
      // Check if the clicked element is a link or inside a link
      const link = e.target.closest("a");
      if (
        link &&
        link.href &&
        !link.target &&
        link.href.startsWith(window.location.origin)
      ) {
        NProgress.start();
        setIsLoading(true);
      }
    };

    document.addEventListener("click", handleLinkClick);
    return () => document.removeEventListener("click", handleLinkClick);
  }, []);

  // Add form submit handler
  useEffect(() => {
    const handleFormSubmit = () => {
      NProgress.start();
      setIsLoading(true);
    };

    document.addEventListener("submit", handleFormSubmit);
    return () => document.removeEventListener("submit", handleFormSubmit);
  }, []);

  return null; // NProgress adds its own UI to the page
}
