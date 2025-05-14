/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure NextAuth.js works correctly with port changes
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3001",
  },
};

export default nextConfig;
