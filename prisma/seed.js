const { PrismaClient } = require("@prisma/client");
const { hash } = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  try {
    // Create admin user
    console.log("Creating admin user...");
    const adminPassword = await hash("admin123", 10);

    const admin = await prisma.user.upsert({
      where: { username: "admin" },
      update: {
        password: adminPassword, // Update password in case it changed
      },
      create: {
        username: "admin",
        password: adminPassword,
        name: "Administrator",
      },
    });

    console.log("Admin user created/updated:", admin);

    // Create sample job card
    console.log("Creating sample job card...");
    const jobCard = await prisma.jobCard.upsert({
      where: { billNo: 1 },
      update: {},
      create: {
        billNo: 1,
        customerName: "John Doe",
        mobileNumber: "9876543210",
        address: "123 Main St, City",
        complaint: "Screen not working",
        model: "Samsung Galaxy S21",
        isOn: false,
        isOff: true,
        hasBattery: true,
        hasDoor: true,
        hasSim: true,
        hasSlot: true,
        admissionFees: 100,
        estimate: 1500,
        advance: 500,
        status: "in-progress",
        userId: admin.id,
      },
    });

    console.log("Sample job card created:", jobCard);
    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
