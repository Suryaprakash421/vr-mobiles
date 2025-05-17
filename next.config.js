/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static optimization where possible
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
    minimumCacheTTL: 60,
  },

  // Reduce build size by excluding development-only code in production
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },

  // Optimize bundle size
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["lodash", "react-icons"],
  },

  // Reduce serverless function size
  poweredByHeader: false,

  // Optimize for Vercel deployment
  reactStrictMode: true,
};

module.exports = nextConfig;
