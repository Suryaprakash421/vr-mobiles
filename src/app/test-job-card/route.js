// This file ensures the route is properly handled during build time

// Disable static generation for this route
export const dynamic = "force-dynamic";

// Skip static generation during build
export const generateStaticParams = () => [];

// Force server-side rendering
export const revalidate = 0;

// Handle GET requests to this route
export async function GET() {
  return new Response(JSON.stringify({ message: "Test job card route" }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
