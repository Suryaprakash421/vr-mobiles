import { PrismaClient } from "@prisma/client";

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = global;

// Create a robust Prisma client with error handling
let prismaClient;

// Function to create a new PrismaClient instance
function createPrismaClient() {
  try {
    return new PrismaClient({
      log: ["error"],
      errorFormat: "minimal",
    });
  } catch (e) {
    console.error("Failed to create Prisma Client", e);
    throw e;
  }
}

// Ensure Prisma Client is initialized properly
if (process.env.NODE_ENV === "production") {
  // In production, create a new instance every time
  // This ensures we don't have connection issues in serverless environments
  prismaClient = createPrismaClient();
} else {
  // In development, reuse the same instance
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  prismaClient = globalForPrisma.prisma;
}

// Error handling wrapper
try {
  // Test the connection to ensure it's working
  prismaClient.$connect();
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
