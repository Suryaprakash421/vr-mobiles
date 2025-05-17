import { PrismaClient } from "@prisma/client";

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = global;

// Create a robust Prisma client with error handling
let prismaClient;

try {
  // Check if we already have a Prisma client instance
  if (globalForPrisma.prisma) {
    prismaClient = globalForPrisma.prisma;
  } else {
    // Create a new Prisma client instance with simplified configuration
    // to avoid potential issues with the PrismaClient constructor
    prismaClient = new PrismaClient({
      log: ["error"],
    });

    // Save to global in development
    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.prisma = prismaClient;
    }
  }
} catch (error) {
  console.error("Failed to initialize Prisma client:", error);
  // Create a fallback client that logs errors
  prismaClient = new Proxy(
    {},
    {
      get: function (target, prop) {
        // Return a function that logs the error and returns a rejected promise
        return function () {
          const error = new Error(
            `Prisma client not initialized. Cannot call ${prop}`
          );
          console.error(error);
          return Promise.reject(error);
        };
      },
    }
  );
}

export const prisma = prismaClient;

export default prisma;
