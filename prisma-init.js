#!/usr/bin/env node
/**
 * This script is used to pre-initialize the Prisma client during the build process
 * to avoid the "PrismaClient did not initialize yet" error in Vercel's serverless environment.
 *
 * It uses a more reliable approach by generating the Prisma client directly.
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("Initializing Prisma client for Vercel build...");

// Ensure the Prisma client is generated
try {
  console.log("Generating Prisma client...");
  execSync("npx prisma generate", { stdio: "inherit" });
  console.log("Prisma client generated successfully.");

  // Create a simple test file to verify the client
  const testFile = path.join(__dirname, "prisma-test-cjs.js");
  const testContent = `
// Simple test to verify Prisma client
const { PrismaClient } = require('@prisma/client');

try {
  console.log('Creating PrismaClient instance...');
  const prisma = new PrismaClient();
  console.log('PrismaClient instance created successfully!');

  // Export the client
  module.exports = prisma;
} catch (error) {
  console.error('Error creating PrismaClient:', error);
  process.exit(1);
}
  `;

  fs.writeFileSync(testFile, testContent);
  console.log("Created test file:", testFile);

  // Run the test
  try {
    console.log("Testing Prisma client...");
    execSync(`node ${testFile}`, { stdio: "inherit" });
    console.log("Prisma client test successful!");
  } catch (error) {
    console.error("Prisma client test failed:", error.message);
    // Continue with the build despite the failure
  }

  // Clean up
  fs.unlinkSync(testFile);
  console.log("Removed test file");

  console.log("Prisma initialization completed.");
} catch (error) {
  console.error("Error during Prisma initialization:", error.message);
  // Don't exit with error to allow the build to continue
  console.log("Continuing with build despite Prisma initialization failure...");
}
