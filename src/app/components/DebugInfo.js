'use client';

import { useState, useEffect } from 'react';

export default function DebugInfo() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch('/api/debug/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  if (!showDebug) {
    return (
      <div className="mt-4 text-center">
        <button 
          onClick={() => setShowDebug(true)}
          className="text-xs text-gray-500 underline"
        >
          Show Debug Info
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4 p-4 bg-gray-100 rounded-md text-xs">
      <div className="flex justify-between mb-2">
        <h3 className="font-bold">Debug Information</h3>
        <button 
          onClick={() => setShowDebug(false)}
          className="text-gray-500"
        >
          Hide
        </button>
      </div>
      
      {loading ? (
        <p>Loading user data...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <div>
          <p className="font-semibold">Available Users:</p>
          <ul className="list-disc pl-5">
            {users.map(user => (
              <li key={user.id}>
                {user.username} (Password: admin123)
              </li>
            ))}
          </ul>
          <p className="mt-2 text-gray-600">
            Try logging in with the username and password shown above.
          </p>
        </div>
      )}
    </div>
  );
}
