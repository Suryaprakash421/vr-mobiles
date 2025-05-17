// Custom build script to disable static generation
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("Building with static generation disabled...");

// Set environment variables to disable static generation with a longer timeout
process.env.NEXT_DISABLE_STATIC_GENERATION = "true";
process.env.NEXT_STATIC_GENERATION_TIMEOUT = "120";

// Create a temporary .env.local file with build-time values
const envLocalPath = path.join(__dirname, ".env.local");
const envLocalContent = `
# Temporary environment variables for build time
NEXT_DISABLE_STATIC_GENERATION=true
NEXT_STATIC_GENERATION_TIMEOUT=120
NEXT_PUBLIC_API_BASE_URL=https://example.com
NEXTAUTH_URL=https://example.com
NEXTAUTH_SECRET=your-secret-key-for-jwt-encryption
`;

console.log("Creating temporary .env.local for build...");
fs.writeFileSync(envLocalPath, envLocalContent);

try {
  // Generate Prisma client
  console.log("Generating Prisma client...");
  execSync("npx prisma generate", { stdio: "inherit" });

  // Create a temporary next.config.js that excludes problematic routes
  const nextConfigPath = path.join(__dirname, "next.config.mjs");
  const originalConfig = fs.readFileSync(nextConfigPath, "utf8");

  // Create a backup of the original config
  const backupPath = path.join(__dirname, "next.config.backup.mjs");
  fs.writeFileSync(backupPath, originalConfig);

  // Create a modified config that excludes problematic routes
  const modifiedConfig = `/** @type {import('next').NextConfig} */
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
  // Disable static generation for specific paths
  excludeDefaultRoutes: ['/test-job-card'],
  // Increase static generation timeout
  staticPageGenerationTimeout: 120,
};

export default nextConfig;
`;

  // Write the modified config
  fs.writeFileSync(nextConfigPath, modifiedConfig);

  // Run the Next.js build command with the environment variables
  console.log("Building Next.js application...");
  execSync("npx next build", {
    stdio: "inherit",
    env: {
      ...process.env,
      NEXT_DISABLE_STATIC_GENERATION: "true",
      NEXT_STATIC_GENERATION_TIMEOUT: "120",
      NEXT_PUBLIC_API_BASE_URL: "https://example.com",
      NEXTAUTH_URL: "https://example.com",
    },
  });

  console.log("Build completed successfully!");
} catch (error) {
  console.error("Build failed:", error.message);
  process.exit(1);
} finally {
  // Clean up the temporary .env.local file
  if (fs.existsSync(envLocalPath)) {
    fs.unlinkSync(envLocalPath);
    console.log("Removed temporary .env.local file");
  }

  // Restore the original next.config.mjs
  const nextConfigPath = path.join(__dirname, "next.config.mjs");
  const backupPath = path.join(__dirname, "next.config.backup.mjs");
  if (fs.existsSync(backupPath)) {
    fs.copyFileSync(backupPath, nextConfigPath);
    fs.unlinkSync(backupPath);
    console.log("Restored original next.config.mjs");
  }
}
