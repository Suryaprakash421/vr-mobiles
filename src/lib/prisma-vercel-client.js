/**
 * This file provides a Prisma client specifically configured for Vercel deployment.
 * It handles the different connection requirements for Vercel's serverless environment.
 */

import { PrismaClient } from '@prisma/client';

// Global is used here to maintain a cached connection across hot reloads in development
const globalForPrisma = global;

// Helper function to create a properly configured Prisma client
const createPrismaClient = () => {
  // Check if we're in a production environment
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Create a new PrismaClient instance with appropriate logging
  const client = new PrismaClient({
    log: isProduction ? ['error'] : ['query', 'error', 'warn'],
    errorFormat: isProduction ? 'minimal' : 'pretty',
  });
  
  return client;
};

// Create or reuse a Prisma client instance
const getPrismaClient = () => {
  // In production, always create a new client
  if (process.env.NODE_ENV === 'production') {
    return createPrismaClient();
  }
  
  // In development, reuse the client if it exists
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  
  return globalForPrisma.prisma;
};

// Export the Prisma client
export const prisma = getPrismaClient();

export default prisma;
