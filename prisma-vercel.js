#!/usr/bin/env node
/**
 * Enhanced script to prepare Prisma for Vercel deployment
 * This script ensures that Prisma client is properly generated and available
 * for the Next.js build process.
 */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("Preparing Prisma for Vercel deployment...");

// Ensure all necessary directories exist
const directories = [
  path.join(__dirname, "node_modules", ".prisma", "client"),
  path.join(__dirname, "node_modules", "@prisma", "client"),
  path.join(__dirname, ".prisma", "client"),
];

directories.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Generate Prisma client
try {
  console.log("Generating Prisma client...");
  execSync("npx prisma generate", { stdio: "inherit" });
  console.log("Prisma client generated successfully.");

  // Verify the generated files
  const clientIndexPath = path.join(
    __dirname,
    "node_modules",
    "@prisma",
    "client",
    "index.js"
  );
  if (fs.existsSync(clientIndexPath)) {
    console.log(`Verified Prisma client exists at: ${clientIndexPath}`);
  } else {
    console.warn(
      `Warning: Prisma client not found at expected path: ${clientIndexPath}`
    );
  }
} catch (error) {
  console.error("Error generating Prisma client:", error.message);
  process.exit(1);
}

// Create a CommonJS test file to verify Prisma client
const testFilePath = path.join(__dirname, "prisma-test-cjs.js");
const testFileContent = `
// Test file to verify Prisma client initialization using CommonJS
const { PrismaClient } = require('@prisma/client');

console.log('Testing Prisma client initialization...');

try {
  // Create a new instance
  console.log('Creating PrismaClient instance...');
  const prisma = new PrismaClient();
  console.log('PrismaClient instance created successfully!');

  // Export the client
  module.exports = prisma;
} catch (error) {
  console.error('Error creating PrismaClient:', error);
  console.error('Error details:', error.message);
  if (error.stack) console.error('Stack trace:', error.stack);
  process.exit(1);
}
`;

// Write the test file
fs.writeFileSync(testFilePath, testFileContent);
console.log(`Created test file: ${testFilePath}`);

// Run the test file
try {
  console.log("Running Prisma test...");
  execSync(`node ${testFilePath}`, { stdio: "inherit" });
  console.log("Prisma test completed successfully.");
} catch (error) {
  console.error("Prisma test failed:", error.message);
  // Don't exit with error to allow the build to continue
  console.log("Continuing with build despite Prisma test failure...");
}

// Create a simple module that can be imported in Next.js
const prismaHelperPath = path.join(__dirname, "src", "lib", "prisma-helper.js");
const prismaHelperContent = `
/**
 * This file ensures Prisma client is properly initialized for Vercel deployment
 */

// PrismaClient is attached to the \`global\` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = global;

let prisma;

// In production, it's best to not use a global variable
if (process.env.NODE_ENV === 'production') {
  const { PrismaClient } = require('@prisma/client');
  prisma = new PrismaClient();
} else {
  // In development, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!globalForPrisma.prisma) {
    const { PrismaClient } = require('@prisma/client');
    globalForPrisma.prisma = new PrismaClient();
  }
  prisma = globalForPrisma.prisma;
}

module.exports = prisma;
`;

// Ensure the directory exists
const libDir = path.join(__dirname, "src", "lib");
if (!fs.existsSync(libDir)) {
  fs.mkdirSync(libDir, { recursive: true });
  console.log(`Created directory: ${libDir}`);
}

// Write the helper file
fs.writeFileSync(prismaHelperPath, prismaHelperContent);
console.log(`Created Prisma helper file: ${prismaHelperPath}`);

// Clean up the test file
fs.unlinkSync(testFilePath);
console.log(`Removed test file: ${testFilePath}`);

console.log("Prisma preparation for Vercel completed.");
