// This file is used to pre-initialize the Prisma client during the build process
// to avoid the "PrismaClient did not initialize yet" error in Vercel's serverless environment

const { PrismaClient } = require('@prisma/client');

console.log('Initializing Prisma client for Vercel build...');

try {
  // Create a new PrismaClient instance
  const prisma = new PrismaClient({
    log: ['error'],
    errorFormat: 'minimal',
  });
  
  console.log('Prisma client initialized successfully.');
  
  // Test connection (optional)
  prisma.$connect()
    .then(() => {
      console.log('Connected to database successfully.');
      prisma.$disconnect()
        .then(() => {
          console.log('Disconnected from database successfully.');
        })
        .catch(error => {
          console.error('Error disconnecting from database:', error);
        });
    })
    .catch(error => {
      console.error('Error connecting to database:', error);
    });
  
  // Export the initialized client
  module.exports = prisma;
} catch (error) {
  console.error('Error initializing Prisma client:', error);
  // Export a dummy client to prevent build failures
  module.exports = {};
}
