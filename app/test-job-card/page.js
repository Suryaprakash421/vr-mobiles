'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TestJobCardPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  
  const createTestJobCard = async () => {
    setIsSubmitting(true);
    setError('');
    setResult(null);
    
    try {
      const response = await fetch('/api/test-job-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('API Error Response:', data);
        throw new Error(data.details || data.error || 'Failed to create test job card');
      }
      
      setResult(data);
    } catch (error) {
      console.error('Error creating test job card:', error);
      setError(error.message || 'Failed to create test job card');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Test Job Card Creation</h1>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}
      
      {result && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
          <p className="text-green-700 font-medium">Job card created successfully!</p>
          <pre className="mt-2 bg-gray-100 p-2 rounded overflow-auto text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
      
      <button
        onClick={createTestJobCard}
        disabled={isSubmitting}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Creating...' : 'Create Test Job Card'}
      </button>
      
      <button
        onClick={() => router.push('/job-cards')}
        className="ml-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
      >
        Back to Job Cards
      </button>
    </div>
  );
}
