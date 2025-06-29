// Script to prepare the app for Vercel deployment
const fs = require("fs");
const path = require("path");

// Create a .env.production file with all necessary environment variables
const envProductionPath = path.join(__dirname, ".env.production");
const envProductionContent = `
# Disable static generation for Vercel deployment
NEXT_DISABLE_STATIC_GENERATION=true
NEXT_STATIC_GENERATION_TIMEOUT=0

# API base URL (will be replaced by Vercel deployment URL)
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000

# Auth settings
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_DEBUG=true
`;

console.log("Creating .env.production for Vercel deployment...");
fs.writeFileSync(envProductionPath, envProductionContent);

// Update next.config.mjs to disable static generation
const nextConfigPath = path.join(__dirname, "next.config.mjs");
const nextConfigContent = `/** @type {import('next').NextConfig} */
const nextConfig = {
  // Environment variables
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3000",
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000",
  },
  // Disable static generation
  experimental: {
    disableStaticGeneration: true,
  },
  // Add output: 'standalone' for better Vercel compatibility
  output: 'standalone',
};

export default nextConfig;
`;

console.log("Updating next.config.mjs to disable static generation...");
fs.writeFileSync(nextConfigPath, nextConfigContent);

console.log(
  'Setup complete! You can now run "npm run build:vercel" to build your app for Vercel deployment.'
);
console.log(
  "After deployment, make sure to set these environment variables in your Vercel project:"
);
console.log("NEXT_DISABLE_STATIC_GENERATION=true");
console.log("NEXT_STATIC_GENERATION_TIMEOUT=0");
console.log("NEXT_PUBLIC_API_BASE_URL={your-vercel-deployment-url}");
console.log("NEXTAUTH_URL={your-vercel-deployment-url}");
