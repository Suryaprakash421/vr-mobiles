"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ForceLogin({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [redirectAttempted, setRedirectAttempted] = useState(false);

  // Set isClient to true when component mounts (client-side only)
  useEffect(() => {
    setIsClient(true);
    console.log("ForceLogin - Component mounted");
    console.log("ForceLogin - Session status:", status);
  }, []);

  // Handle authentication status changes
  useEffect(() => {
    console.log("ForceLogin - Session status changed:", status);

    if (isClient && status === "unauthenticated" && !redirectAttempted) {
      console.log(
        "ForceLogin - User is not authenticated, redirecting to login..."
      );
      setRedirectAttempted(true);

      // Use a direct window.location for more reliable navigation
      console.log(
        "ForceLogin - Using direct window.location navigation to login"
      );
      window.location.href = "/login";
    }
  }, [status, isClient, redirectAttempted]);

  // Show loading state while checking authentication
  if (status === "loading" || !isClient) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
        <p className="text-lg font-medium text-gray-700">
          Verifying authentication...
        </p>
      </div>
    );
  }

  // If authenticated, render children
  if (status === "authenticated") {
    return children;
  }

  // If unauthenticated and we've already attempted to redirect, show a manual login button
  if (status === "unauthenticated" && redirectAttempted) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="text-lg font-medium text-gray-700 mb-4">
          Authentication required
        </p>
        <button
          onClick={() => (window.location.href = "/login")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go to Login
        </button>
      </div>
    );
  }

  // Default loading state
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
      <p className="text-lg font-medium text-gray-700">
        Preparing application...
      </p>
    </div>
  );
}
