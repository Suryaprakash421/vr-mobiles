// Script to create a dynamic-only build for Vercel
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Create a temporary next.config.js that forces dynamic mode
const nextConfigPath = path.join(__dirname, 'next.config.mjs');
const nextConfigContent = `/** @type {import('next').NextConfig} */
const nextConfig = {
  // Environment variables
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3001",
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001",
  },
  // Force dynamic rendering for all pages
  experimental: {
    disableStaticGeneration: true,
  },
  // Add output: 'standalone' for better Vercel compatibility
  output: 'standalone',
};

export default nextConfig;
`;

console.log('Creating dynamic-only next.config.mjs...');
fs.writeFileSync(nextConfigPath, nextConfigContent);

// Create a .env.production file with all necessary environment variables
const envProductionPath = path.join(__dirname, '.env.production');
const envProductionContent = `
# Disable static generation for Vercel deployment
NEXT_DISABLE_STATIC_GENERATION=true
NEXT_STATIC_GENERATION_TIMEOUT=0

# API base URL (will be replaced by Vercel deployment URL)
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001

# Auth settings
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_DEBUG=true
`;

console.log('Creating .env.production for dynamic build...');
fs.writeFileSync(envProductionPath, envProductionContent);

// Run the Next.js build with dynamic mode
console.log('Running Next.js build in dynamic-only mode...');
try {
  execSync('next build', { stdio: 'inherit' });
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
