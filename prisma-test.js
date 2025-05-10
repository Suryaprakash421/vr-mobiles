const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Testing Prisma client...");

    // Print the Prisma client version
    console.log("Prisma client version:", prisma._engineConfig.version);

    // Try to get all job cards to see the schema
    const jobCards = await prisma.jobCard.findMany();
    console.log("Job cards:", jobCards);

    // Use a transaction to ensure all operations succeed or fail together
    const result = await prisma.$transaction(async (tx) => {
      // Find or create a user
      let user = await tx.user.findUnique({
        where: { username: "testuser" },
      });

      if (!user) {
        user = await tx.user.create({
          data: {
            username: "testuser",
            password: "password123",
            name: "Test User",
          },
        });
        console.log("User created:", user);
      } else {
        console.log("User found:", user);
      }

      // Try to create a job card with status field
      const jobCard = await tx.jobCard.create({
        data: {
          customerName: "Test Customer",
          mobileNumber: "1234567890",
          complaint: "Test Complaint",
          model: "Test Model",
          status: "pending",
          userId: user.id,
        },
      });

      console.log("Job card created:", jobCard);

      // Update the job card with billNo
      const updatedJobCard = await tx.jobCard.update({
        where: { id: jobCard.id },
        data: { billNo: jobCard.id },
      });

      console.log("Updated job card:", updatedJobCard);

      return { user, jobCard: updatedJobCard };
    });

    console.log("Transaction result:", result);

    // No need to clean up for now
    // We want to keep the data for testing

    console.log("Test completed successfully!");
  } catch (error) {
    console.error("Error testing Prisma client:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
