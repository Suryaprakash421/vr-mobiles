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

  // Set a longer timeout for static generation
  staticPageGenerationTimeout: 60,

  // Set environment variables to disable static generation
  env: {
    NEXT_DISABLE_STATIC_GENERATION: "true",
    NEXT_STATIC_GENERATION_TIMEOUT: "60",
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
