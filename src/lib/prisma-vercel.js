/**
 * This file provides a helper function to ensure Prisma client is properly initialized
 * in Vercel's serverless environment.
 * 
 * It's used to pre-initialize the Prisma client during the build process
 * to avoid the "PrismaClient did not initialize yet" error.
 */

import { PrismaClient } from '@prisma/client';

// Create a global variable to cache the Prisma client
let prismaGlobal;

export function ensurePrismaInitialized() {
  if (prismaGlobal) {
    return prismaGlobal;
  }
  
  // Create a new PrismaClient instance
  const prisma = new PrismaClient({
    log: ['error'],
    errorFormat: 'minimal',
  });
  
  // Cache the client
  prismaGlobal = prisma;
  
  return prisma;
}

// Initialize Prisma client immediately when this module is imported
ensurePrismaInitialized();

// Export the initialized client
export default ensurePrismaInitialized();
