// Simplified and more reliable Prisma client initialization
// that works better in serverless environments like Vercel

// Use dynamic import to ensure Prisma is only loaded when needed
// This helps prevent issues with Vercel's serverless environment
let prismaClient;

// This function will be called to get the Prisma client
// It uses a lazy-loading pattern that works better in serverless environments
async function getPrismaClient() {
  if (prismaClient) {
    return prismaClient;
  }

  try {
    // Dynamically import PrismaClient only when needed
    const { PrismaClient } = await import("@prisma/client");

    // Create a new instance with minimal logging
    const client = new PrismaClient({
      log: ["error"],
      errorFormat: "minimal",
    });

    // Cache the client for future use
    prismaClient = client;
    return client;
  } catch (error) {
    console.error("Failed to initialize Prisma client:", error);
    throw new Error(`Prisma client initialization failed: ${error.message}`);
  }
}

// Create a proxy that will lazily initialize the Prisma client
// This ensures we don't try to create the client until it's actually used
const prisma = new Proxy(
  {},
  {
    get: function (target, prop) {
      // Return a function that initializes Prisma when called
      return async function (...args) {
        const client = await getPrismaClient();
        return client[prop](...args);
      };
    },
  }
);

// Export the proxy as both default and named export
export { prisma };
export default prisma;
