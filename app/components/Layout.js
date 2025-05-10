"use client";

import { usePathname } from "next/navigation";
import SideNav from "./SideNav";
import LoadingBar from "./LoadingBar";
import GlobalLoadingOverlay from "./GlobalLoadingOverlay";
import { useEffect } from "react";
import "../styles/button-loading.css";

export default function Layout({ children }) {
  const pathname = usePathname();

  // Add loading class to buttons when clicked
  useEffect(() => {
    const handleButtonClick = (e) => {
      if (e.target.tagName === "BUTTON" && !e.target.disabled) {
        e.target.classList.add("loading-btn");

        // Remove the class after a timeout
        setTimeout(() => {
          e.target.classList.remove("loading-btn");
        }, 2000);
      }
    };

    document.addEventListener("click", handleButtonClick);

    return () => {
      document.removeEventListener("click", handleButtonClick);
    };
  }, []);

  // Don't show sidebar on login page
  if (pathname === "/login" || pathname === "/register") {
    return (
      <div className="min-h-screen bg-gray-50">
        <LoadingBar />
        <GlobalLoadingOverlay />
        {children}
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-gray-50 flex">
      <LoadingBar />
      <GlobalLoadingOverlay />
      <SideNav />
      <div className="flex-1 overflow-auto">
        <main className="py-8 px-4 sm:px-6 lg:px-8 md:px-10">{children}</main>
      </div>
    </div>
  );
}
