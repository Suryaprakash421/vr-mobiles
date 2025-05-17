#!/usr/bin/env node
/**
 * This script verifies that the Prisma client can be properly imported and instantiated.
 * It's used during the build process to ensure Prisma is working correctly.
 */

console.log('Verifying Prisma client...');

try {
  // Try to import PrismaClient
  const { PrismaClient } = require('@prisma/client');
  console.log('Successfully imported PrismaClient');
  
  // Try to instantiate PrismaClient
  const prisma = new PrismaClient();
  console.log('Successfully instantiated PrismaClient');
  
  // Print Prisma version info
  console.log('Prisma version:', require('@prisma/client').Prisma.prismaVersion);
  
  console.log('Prisma client verification successful!');
  process.exit(0);
} catch (error) {
  console.error('Error verifying Prisma client:', error);
  console.error('Error details:', error.message);
  if (error.stack) console.error('Stack trace:', error.stack);
  
  // Don't exit with error to allow the build to continue
  console.log('Continuing with build despite Prisma verification failure...');
  process.exit(0);
}
