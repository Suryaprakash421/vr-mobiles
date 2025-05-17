'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

export default function SessionDebug() {
  const { data: session, status } = useSession();
  const [isVisible, setIsVisible] = useState(false);
  const [sessionHistory, setSessionHistory] = useState([]);

  // Record session changes
  useEffect(() => {
    const timestamp = new Date().toISOString();
    setSessionHistory(prev => [
      ...prev, 
      { 
        timestamp, 
        status, 
        session: session ? JSON.stringify(session, null, 2) : 'null' 
      }
    ].slice(-5)); // Keep only the last 5 entries
  }, [session, status]);

  if (!isVisible) {
    return (
      <button 
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white px-3 py-1 rounded-md text-xs z-50"
      >
        Debug Session
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 shadow-lg rounded-md p-4 max-w-md w-full z-50 text-xs">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">Session Debug</h3>
        <button 
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          Close
        </button>
      </div>
      
      <div className="mb-4">
        <p className="font-semibold">Current Status: <span className={`${status === 'authenticated' ? 'text-green-600' : status === 'loading' ? 'text-yellow-600' : 'text-red-600'}`}>{status}</span></p>
        {session && (
          <div className="mt-1">
            <p className="font-semibold">Session Data:</p>
            <pre className="bg-gray-100 p-2 rounded mt-1 overflow-auto max-h-32">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>
        )}
      </div>
      
      <div>
        <p className="font-semibold">Session History:</p>
        <div className="mt-1 space-y-2 max-h-40 overflow-auto">
          {sessionHistory.map((entry, index) => (
            <div key={index} className="border-t pt-1">
              <p className="text-gray-500">{entry.timestamp}</p>
              <p>Status: <span className={`${entry.status === 'authenticated' ? 'text-green-600' : entry.status === 'loading' ? 'text-yellow-600' : 'text-red-600'}`}>{entry.status}</span></p>
              <pre className="bg-gray-100 p-1 rounded mt-1 overflow-auto max-h-20 text-xs">
                {entry.session}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
