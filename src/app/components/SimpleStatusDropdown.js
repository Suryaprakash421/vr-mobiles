'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Status options with their display properties
const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', bgColor: 'bg-yellow-100', textColor: 'text-yellow-900', dotColor: 'bg-yellow-500' },
  { value: 'in-progress', label: 'In Progress', bgColor: 'bg-blue-100', textColor: 'text-blue-900', dotColor: 'bg-blue-500' },
  { value: 'completed', label: 'Completed', bgColor: 'bg-green-100', textColor: 'text-green-900', dotColor: 'bg-green-500' }
];

export default function SimpleStatusDropdown({ jobId, currentStatus }) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus || 'pending');
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');
  
  // Find the current status option
  const currentOption = STATUS_OPTIONS.find(option => option.value === status) || STATUS_OPTIONS[0];
  
  // Handle status change
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    
    if (newStatus === status) return;
    
    setIsUpdating(true);
    setError('');
    
    try {
      console.log(`Updating job ${jobId} status from ${status} to ${newStatus}`);
      
      const response = await fetch(`/api/job-cards/${jobId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update status');
      }
      
      console.log('Status updated successfully:', data);
      setStatus(newStatus);
      router.refresh();
    } catch (err) {
      console.error('Error updating status:', err);
      setError(err.message);
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <div className="relative">
      {error && (
        <div className="absolute bottom-full left-0 mb-1 w-48 bg-red-100 text-red-800 text-xs p-1 rounded">
          {error}
        </div>
      )}
      
      <div className={`inline-flex items-center px-3 py-1 rounded-full border ${currentOption.bgColor} ${currentOption.textColor} text-sm font-medium`}>
        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${currentOption.dotColor}`}></span>
        
        <select
          value={status}
          onChange={handleStatusChange}
          disabled={isUpdating}
          className={`bg-transparent border-none focus:ring-0 focus:outline-none font-medium ${currentOption.textColor} pr-8 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
          style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
        >
          {STATUS_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <svg 
          className="ml-1 h-4 w-4" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 20 20" 
          fill="currentColor"
          style={{ pointerEvents: 'none' }}
        >
          <path 
            fillRule="evenodd" 
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
            clipRule="evenodd" 
          />
        </svg>
      </div>
    </div>
  );
}
