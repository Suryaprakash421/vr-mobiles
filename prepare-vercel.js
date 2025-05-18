#!/usr/bin/env node
/**
 * This script prepares the application for Vercel deployment.
 * It handles Prisma configuration and environment variables.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Preparing application for Vercel deployment...');

// Create a .env.production file with all necessary environment variables
const envProductionPath = path.join(__dirname, '.env.production');
const envProductionContent = `
# Database connection (will be overridden by Vercel environment variables)
DATABASE_URL=${process.env.DATABASE_URL || "mysql://root:password@localhost:3306/vr_mobiles"}

# NextAuth configuration
NEXTAUTH_SECRET=${process.env.NEXTAUTH_SECRET || "a-more-secure-secret-key-for-jwt-encryption-123456789"}
NEXTAUTH_URL=${process.env.NEXTAUTH_URL || "http://localhost:3001"}
NEXTAUTH_DEBUG=${process.env.NEXTAUTH_DEBUG || "false"}

# API base URL
NEXT_PUBLIC_API_BASE_URL=${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001"}

# Disable static generation for Vercel deployment
NEXT_DISABLE_STATIC_GENERATION=true
NEXT_STATIC_GENERATION_TIMEOUT=60
`;

console.log('Creating .env.production for Vercel deployment...');
fs.writeFileSync(envProductionPath, envProductionContent);

// Generate Prisma client
try {
  console.log('Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('Prisma client generated successfully.');
} catch (error) {
  console.error('Error generating Prisma client:', error.message);
  // Continue with the build process despite errors
  console.log('Continuing with build despite Prisma generation failure...');
}

console.log('Preparation for Vercel deployment completed.');
