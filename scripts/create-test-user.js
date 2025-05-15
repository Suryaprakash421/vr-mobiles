const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  try {
    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        username: 'admin',
      },
    });

    if (existingUser) {
      console.log('User "admin" already exists. Updating password...');
      
      // Hash the password
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      // Update the user
      const updatedUser = await prisma.user.update({
        where: {
          username: 'admin',
        },
        data: {
          password: hashedPassword,
        },
      });
      
      console.log('User password updated successfully:', updatedUser.username);
    } else {
      // Hash the password
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      // Create a new user
      const newUser = await prisma.user.create({
        data: {
          username: 'admin',
          password: hashedPassword,
          name: 'Administrator',
        },
      });
      
      console.log('User created successfully:', newUser.username);
    }
  } catch (error) {
    console.error('Error creating/updating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
