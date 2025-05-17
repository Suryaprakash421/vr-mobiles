/** @type {import('next').NextConfig} */
const nextConfig = {
  // Environment variables
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3001",
    NEXT_PUBLIC_API_BASE_URL:
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001",
  },
  // Force dynamic rendering for all pages
  experimental: {
    disableStaticGeneration: true,
  },
  // Add output: 'standalone' for better Vercel compatibility
  output: "standalone",
  // Disable static generation for specific paths
  excludeStaticRoutes: ["/test-job-card"],
  // Increase static generation timeout
  staticPageGenerationTimeout: 120,
};

export default nextConfig;
