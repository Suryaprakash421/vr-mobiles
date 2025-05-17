// Script to test database connection
const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  console.log('Testing database connection...');
  
  const prisma = new PrismaClient();
  
  try {
    // Test connection by querying users
    console.log('Attempting to query users...');
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        name: true,
      },
    });
    
    console.log('Connection successful!');
    console.log(`Found ${users.length} users in the database:`);
    
    if (users.length > 0) {
      users.forEach(user => {
        console.log(`- ID: ${user.id}, Username: ${user.username}, Name: ${user.name || 'N/A'}`);
      });
    } else {
      console.log('No users found in the database. You may need to create a user first.');
    }
    
  } catch (error) {
    console.error('Error connecting to the database:');
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
