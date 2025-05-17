// Server Component
import { Suspense } from 'react';

// Disable static generation for this page
export const dynamic = "force-dynamic";
// Skip static generation during build
export const generateStaticParams = () => [];
// Force server-side rendering
export const revalidate = 0;

export default function TestJobCardLayout({ children }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {children}
    </Suspense>
  );
}
