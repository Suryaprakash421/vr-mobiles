"use client";

import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";

export default function AuthProvider({ children }) {
  // Log when the AuthProvider is mounted/unmounted
  useEffect(() => {
    console.log("AuthProvider mounted");

    // Check for existing session cookie
    const cookies = document.cookie.split(";");
    const sessionCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("next-auth.session-token=")
    );
    console.log("Session cookie exists:", !!sessionCookie);

    // Force a session refresh on mount
    const refreshSession = async () => {
      try {
        const response = await fetch("/api/auth/session");
        const session = await response.json();
        console.log("Session refresh result:", session);
      } catch (error) {
        console.error("Error refreshing session:", error);
      }
    };

    refreshSession();

    return () => {
      console.log("AuthProvider unmounted");
    };
  }, []);

  return (
    <SessionProvider
      refetchInterval={30} // Refetch session every 30 seconds for better reliability
      refetchOnWindowFocus={true} // Refetch when window gets focus
      refetchWhenOffline={false} // Don't refetch when offline
    >
      {children}
    </SessionProvider>
  );
}
