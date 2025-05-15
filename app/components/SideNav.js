"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaHome,
  FaClipboardList,
  FaPlus,
  FaSearch,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUsers,
} from "react-icons/fa";

export default function SideNav() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  if (status !== "authenticated") {
    return null;
  }

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-gradient-to-r from-blue-700 to-violet-600 text-white shadow-lg md:hidden"
        aria-label="Toggle menu"
      >
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen bg-gradient-to-b from-blue-800 via-violet-700 to-blue-600 text-white w-64 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } md:static md:z-0 md:h-screen flex-shrink-0 overflow-y-auto`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-5 border-b border-blue-700">
            <Link
              href="/"
              className="flex items-center space-x-2"
              onClick={closeSidebar}
            >
              <span className="text-2xl font-extrabold tracking-tight">
                VR Mobiles
              </span>
            </Link>
          </div>

          {/* User info */}
          <div className="p-5 border-b border-blue-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-xl font-bold">
                  {session.user.name
                    ? session.user.name.charAt(0).toUpperCase()
                    : session.user.username
                    ? session.user.username.charAt(0).toUpperCase()
                    : "U"}
                </span>
              </div>
              <div>
                <p className="font-medium">Hello,</p>
                <p className="font-bold truncate max-w-[180px]">
                  {session.user.name || session.user.username}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="flex-1 p-5 space-y-2 overflow-y-auto">
            <Link
              href="/"
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                pathname === "/"
                  ? "bg-blue-700 text-white"
                  : "text-blue-100 hover:bg-blue-700"
              }`}
              onClick={closeSidebar}
            >
              <FaHome size={20} />
              <span className="font-medium">Dashboard</span>
            </Link>

            <Link
              href="/job-cards"
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                pathname === "/job-cards"
                  ? "bg-blue-700 text-white"
                  : "text-blue-100 hover:bg-blue-700"
              }`}
              onClick={closeSidebar}
            >
              <FaClipboardList size={20} />
              <span className="font-medium">All Job Cards</span>
            </Link>

            <Link
              href="/job-cards/new"
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                pathname === "/job-cards/new"
                  ? "bg-blue-700 text-white"
                  : "text-blue-100 hover:bg-blue-700"
              }`}
              onClick={closeSidebar}
            >
              <FaPlus size={20} />
              <span className="font-medium">New Job Card</span>
            </Link>

            <Link
              href="/job-cards?search="
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                pathname === "/job-cards" && pathname.includes("search")
                  ? "bg-blue-700 text-white"
                  : "text-blue-100 hover:bg-blue-700"
              }`}
              onClick={closeSidebar}
            >
              <FaSearch size={20} />
              <span className="font-medium">Search</span>
            </Link>

            <Link
              href="/job-cards-filtered"
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                pathname === "/job-cards-filtered"
                  ? "bg-blue-700 text-white"
                  : "text-blue-100 hover:bg-blue-700"
              }`}
              onClick={closeSidebar}
            >
              <FaClipboardList size={20} />
              <span className="font-medium">Filtered Job Cards</span>
            </Link>

            <Link
              href="/customers"
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                pathname.startsWith("/customers")
                  ? "bg-blue-700 text-white"
                  : "text-blue-100 hover:bg-blue-700"
              }`}
              onClick={closeSidebar}
            >
              <FaUsers size={20} />
              <span className="font-medium">Customer Details</span>
            </Link>
          </nav>

          {/* Logout button */}
          <div className="p-5 border-t border-blue-700">
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center space-x-3 p-3 rounded-lg text-blue-100 hover:bg-blue-700 w-full transition-colors"
            >
              <FaSignOutAlt size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
