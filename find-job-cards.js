const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const jobCards = await prisma.jobCard.findMany();
    console.log('Job cards:', jobCards);
  } catch (error) {
    console.error('Error finding job cards:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
