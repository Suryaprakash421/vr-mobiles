"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function SessionDebugPanel() {
  const { data: session, status } = useSession();
  const [serverSession, setServerSession] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkServerSession = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/debug/session");
      const data = await response.json();
      setServerSession(data);
    } catch (error) {
      console.error("Error fetching server session:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check server session on mount and when client session changes
    checkServerSession();
  }, [status]);

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg hover:bg-gray-700"
      >
        {isOpen ? "Hide" : "Show"} Session Debug
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-3xl w-full max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Session Debug Panel</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-bold mb-2">Client Session Status</h3>
                <div className="bg-gray-100 p-3 rounded">
                  <p>Status: <span className={`font-bold ${status === 'authenticated' ? 'text-green-600' : 'text-red-600'}`}>{status}</span></p>
                  {session ? (
                    <pre className="mt-2 text-xs overflow-auto max-h-60">
                      {JSON.stringify(session, null, 2)}
                    </pre>
                  ) : (
                    <p className="text-red-500 mt-2">No session data</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-bold mb-2">Server Session Status</h3>
                <div className="bg-gray-100 p-3 rounded">
                  {loading ? (
                    <p>Loading...</p>
                  ) : serverSession ? (
                    <>
                      <p>Authenticated: <span className={`font-bold ${serverSession.authenticated ? 'text-green-600' : 'text-red-600'}`}>
                        {serverSession.authenticated ? 'Yes' : 'No'}
                      </span></p>
                      <p>Session Cookie: <span className={`font-bold ${serverSession.cookies?.sessionExists ? 'text-green-600' : 'text-red-600'}`}>
                        {serverSession.cookies?.sessionExists ? 'Exists' : 'Missing'}
                      </span></p>
                      <pre className="mt-2 text-xs overflow-auto max-h-60">
                        {JSON.stringify(serverSession, null, 2)}
                      </pre>
                    </>
                  ) : (
                    <p className="text-red-500">No server session data</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-center">
              <button
                onClick={checkServerSession}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Checking..." : "Refresh Session Data"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
