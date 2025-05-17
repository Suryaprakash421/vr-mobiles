// Custom build script for Vercel deployment
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("Starting Vercel build with static generation disabled...");

// Create a temporary next.config.js that forces dynamic mode
const nextConfigPath = path.join(__dirname, "next.config.mjs");
const nextConfigContent = `/** @type {import('next').NextConfig} */
const nextConfig = {
  // Environment variables
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3001",
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001",
    NEXT_DISABLE_STATIC_GENERATION: "true",
    NEXT_STATIC_GENERATION_TIMEOUT: "60",
  },
  // Force dynamic rendering for all pages
  experimental: {
    disableStaticGeneration: true,
  },
  // Add output: 'standalone' for better Vercel compatibility
  output: 'standalone',
  // Set a longer timeout for static generation
  staticPageGenerationTimeout: 60,
};

export default nextConfig;
`;

console.log("Creating dynamic-only next.config.mjs...");
fs.writeFileSync(nextConfigPath, nextConfigContent);

// Create a .env.production file with all necessary environment variables
const envProductionPath = path.join(__dirname, ".env.production");
const envProductionContent = `
# Disable static generation for Vercel deployment
NEXT_DISABLE_STATIC_GENERATION=true
NEXT_STATIC_GENERATION_TIMEOUT=60

# API base URL (will be replaced by Vercel deployment URL)
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001

# Auth settings
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_DEBUG=true
`;

console.log("Creating .env.production for dynamic build...");
fs.writeFileSync(envProductionPath, envProductionContent);

// Set environment variables to disable static generation
process.env.NEXT_DISABLE_STATIC_GENERATION = "true";
process.env.NEXT_STATIC_GENERATION_TIMEOUT = "60";

try {
  // Install required dependencies
  console.log("Installing required dependencies...");
  execSync("npm install autoprefixer postcss tailwindcss@3.4.0 --no-save", {
    stdio: "inherit",
  });

  // Generate Prisma client
  console.log("Generating Prisma client...");
  execSync("npx prisma generate", { stdio: "inherit" });

  // Push schema to database
  console.log("Pushing schema to database...");
  execSync("npx prisma db push", { stdio: "inherit" });

  // Run the Next.js build command with the environment variables
  console.log("Building Next.js application...");
  execSync("npx next build", {
    stdio: "inherit",
    env: {
      ...process.env,
      NEXT_DISABLE_STATIC_GENERATION: "true",
      NEXT_STATIC_GENERATION_TIMEOUT: "60",
    },
  });

  console.log("Build completed successfully!");
} catch (error) {
  console.error("Build failed:", error.message);
  process.exit(1);
}
