// Script to prepare Prisma for Vercel deployment
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Preparing Prisma for Vercel deployment...');

// Ensure the output directory exists
const outputDir = path.join(__dirname, 'node_modules', '.prisma', 'client');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`Created directory: ${outputDir}`);
}

// Generate Prisma client
try {
  console.log('Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('Prisma client generated successfully.');
} catch (error) {
  console.error('Error generating Prisma client:', error.message);
  process.exit(1);
}

// Create a test file to verify Prisma client
const testFilePath = path.join(__dirname, 'prisma-test.js');
const testFileContent = `
// Test file to verify Prisma client initialization
const { PrismaClient } = require('@prisma/client');

async function testPrisma() {
  console.log('Testing Prisma client initialization...');
  
  try {
    const prisma = new PrismaClient();
    console.log('Prisma client initialized successfully.');
    
    // Test connection
    await prisma.$connect();
    console.log('Connected to database successfully.');
    
    // Disconnect
    await prisma.$disconnect();
    console.log('Disconnected from database successfully.');
    
    return true;
  } catch (error) {
    console.error('Error testing Prisma client:', error);
    return false;
  }
}

testPrisma()
  .then(success => {
    console.log('Prisma test completed with result:', success);
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Unexpected error during Prisma test:', error);
    process.exit(1);
  });
`;

// Write the test file
fs.writeFileSync(testFilePath, testFileContent);
console.log(`Created test file: ${testFilePath}`);

// Run the test file
try {
  console.log('Running Prisma test...');
  execSync('node prisma-test.js', { stdio: 'inherit' });
  console.log('Prisma test completed successfully.');
} catch (error) {
  console.error('Prisma test failed:', error.message);
  // Don't exit with error to allow the build to continue
}

// Clean up the test file
fs.unlinkSync(testFilePath);
console.log(`Removed test file: ${testFilePath}`);

console.log('Prisma preparation for Vercel completed.');
