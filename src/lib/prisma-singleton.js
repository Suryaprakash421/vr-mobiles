/**
 * This file creates a singleton instance of PrismaClient to be used throughout the application.
 * It ensures that only one instance of PrismaClient is created, even in development with hot reloading.
 *
 * For Vercel deployment, it includes special handling to ensure proper database connections.
 */

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

// Add prisma to the globalThis type
const globalForPrisma = global;

let prisma;

// Check if we're running on Vercel
const isVercel = process.env.VERCEL === "1";

// In production, it's best to not use a global variable
if (process.env.NODE_ENV === "production") {
  try {
    const { PrismaClient } = require("@prisma/client");
    prisma = new PrismaClient({
      log: ["error"],
      errorFormat: "minimal",
      // Add a longer connection timeout for Vercel
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });

    // Log successful connection
    console.log("Production Prisma client initialized successfully");
  } catch (error) {
    console.error("Error initializing Prisma client:", error);
    // Create a mock client that logs errors instead of crashing
    prisma = new Proxy(
      {},
      {
        get: function (target, prop) {
          if (typeof prop === "string") {
            return new Proxy(
              {},
              {
                get: function () {
                  return async () => {
                    throw new Error(
                      `Prisma client not initialized properly. Original error: ${error.message}`
                    );
                  };
                },
              }
            );
          }
          return undefined;
        },
      }
    );
  }
} else {
  // In development, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!globalForPrisma.prisma) {
    const { PrismaClient } = require("@prisma/client");
    globalForPrisma.prisma = new PrismaClient({
      log: ["error", "warn"],
      errorFormat: "pretty",
    });
  }
  prisma = globalForPrisma.prisma;
}

module.exports = prisma;
