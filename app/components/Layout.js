"use client";

import { usePathname } from "next/navigation";
import SideNav from "./SideNav";

export default function Layout({ children }) {
  const pathname = usePathname();

  // Don't show sidebar on login page
  if (pathname === "/login" || pathname === "/register") {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  return (
    <div className="h-screen overflow-hidden bg-gray-50 flex">
      <SideNav />
      <div className="flex-1 overflow-auto">
        <main className="py-8 px-4 sm:px-6 lg:px-8 md:px-10">{children}</main>
      </div>
    </div>
  );
}
