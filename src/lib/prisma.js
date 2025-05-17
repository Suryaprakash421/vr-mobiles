// Improved Prisma client initialization for Next.js 15 and Vercel serverless environment

import { PrismaClient } from "@prisma/client";

// Global variable to store the Prisma client instance
let prismaClient;

// Function to get or create the Prisma client
function getPrismaClient() {
  // If we already have a client instance, return it
  if (prismaClient) {
    return prismaClient;
  }

  // Create a new PrismaClient instance
  prismaClient = new PrismaClient({
    log: ["error"],
    errorFormat: "minimal",
  });

  // Add shutdown hooks if needed
  if (process.env.NODE_ENV !== "production") {
    // Add any development-specific behavior here
  }

  return prismaClient;
}

// Get the client
const prisma = getPrismaClient();

// Export the client as both default and named export
export { prisma };
export default prisma;
