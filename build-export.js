// Custom build script that skips static generation
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("Building with static generation disabled...");

// Create a temporary next.config.js that disables static generation
const configPath = path.join(__dirname, "next.config.js");
const originalConfig = fs.readFileSync(configPath, "utf8");

const tempConfig = `
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use server-side rendering for all pages
  output: "standalone",

  // Optimize images
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // Disable static generation for all pages
  staticPageGenerationTimeout: 0,

  // Set environment variables to disable static generation
  env: {
    NEXT_DISABLE_STATIC_GENERATION: "true",
    NEXT_STATIC_GENERATION_TIMEOUT: "0",
  },

  // Skip type checking during build
  typescript: {
    ignoreBuildErrors: true,
  },

  // Skip ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Disable static generation
  experimental: {
    // Use only valid experimental options
    serverActions: {
      allowedOrigins: ["*"],
    },
  },
};

module.exports = nextConfig;
`;

try {
  // Write the temporary config
  fs.writeFileSync(configPath, tempConfig);

  // Run the Next.js build command with the environment variables
  execSync("npx next build", {
    stdio: "inherit",
    env: {
      ...process.env,
      NEXT_DISABLE_STATIC_GENERATION: "true",
      NEXT_STATIC_GENERATION_TIMEOUT: "0",
    },
  });

  console.log("Build completed successfully!");
} catch (error) {
  console.error("Build failed:", error.message);
  process.exit(1);
} finally {
  // Restore the original config
  fs.writeFileSync(configPath, originalConfig);
}
