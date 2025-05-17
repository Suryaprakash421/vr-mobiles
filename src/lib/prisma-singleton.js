/**
 * This file creates a singleton instance of PrismaClient to be used throughout the application.
 * It ensures that only one instance of PrismaClient is created, even in development with hot reloading.
 */

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

// Add prisma to the globalThis type
const globalForPrisma = global;

let prisma;

// In production, it's best to not use a global variable
if (process.env.NODE_ENV === "production") {
  const { PrismaClient } = require("@prisma/client");
  prisma = new PrismaClient({
    log: ["error"],
    errorFormat: "minimal",
  });
} else {
  // In development, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!globalForPrisma.prisma) {
    const { PrismaClient } = require("@prisma/client");
    globalForPrisma.prisma = new PrismaClient({
      log: ["error"],
      errorFormat: "minimal",
    });
  }
  prisma = globalForPrisma.prisma;
}

module.exports = prisma;
