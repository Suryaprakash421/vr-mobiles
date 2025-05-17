const { PrismaClient } = require('@prisma/client');
const { compare, hash } = require('bcrypt');

const prisma = new PrismaClient();

async function testBcrypt() {
  try {
    // Get the admin user
    const user = await prisma.user.findUnique({
      where: {
        username: 'admin',
      },
    });

    if (!user) {
      console.log('User not found');
      return;
    }

    console.log('Found user:', user.username, 'with ID:', user.id);
    console.log('Stored password hash:', user.password);

    // Test with correct password
    const correctPassword = 'admin123';
    const isCorrectPasswordValid = await compare(correctPassword, user.password);
    console.log('Correct password valid:', isCorrectPasswordValid);

    // Test with incorrect password
    const incorrectPassword = 'wrongpassword';
    const isIncorrectPasswordValid = await compare(incorrectPassword, user.password);
    console.log('Incorrect password valid:', isIncorrectPasswordValid);

    // Generate a new hash for the same password
    const newHash = await hash(correctPassword, 10);
    console.log('New hash for same password:', newHash);
    
    // Compare the new hash with the correct password
    const isNewHashValid = await compare(correctPassword, newHash);
    console.log('New hash valid with correct password:', isNewHashValid);
  } catch (error) {
    console.error('Error testing bcrypt:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testBcrypt();
