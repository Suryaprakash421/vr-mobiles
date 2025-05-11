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

    // Create sample job cards
    console.log("Creating sample job cards...");

    const sampleJobCards = [
      {
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
      {
        billNo: 2,
        customerName: "Jane Smith",
        mobileNumber: "8765432109",
        address: "456 Oak St, Town",
        complaint: "Battery draining quickly",
        model: "iPhone 12",
        isOn: true,
        isOff: false,
        hasBattery: true,
        hasDoor: true,
        hasSim: true,
        hasSlot: true,
        admissionFees: 200,
        estimate: 2000,
        advance: 1000,
        status: "pending",
        userId: admin.id,
      },
      {
        billNo: 3,
        customerName: "Robert Johnson",
        mobileNumber: "7654321098",
        address: "789 Pine St, Village",
        complaint: "Phone not charging",
        model: "OnePlus 9",
        isOn: false,
        isOff: true,
        hasBattery: true,
        hasDoor: true,
        hasSim: false,
        hasSlot: true,
        admissionFees: 150,
        estimate: 1200,
        advance: 600,
        status: "completed",
        userId: admin.id,
      },
    ];

    for (const jobCardData of sampleJobCards) {
      const jobCard = await prisma.jobCard.upsert({
        where: { billNo: jobCardData.billNo },
        update: {},
        create: jobCardData,
      });

      console.log(
        `Job card #${jobCard.billNo} created/updated for ${jobCard.customerName}`
      );

      // Create or update customer record
      let customer = await prisma.customer.findUnique({
        where: { mobileNumber: jobCardData.mobileNumber },
      });

      if (customer) {
        customer = await prisma.customer.update({
          where: { id: customer.id },
          data: {
            visitCount: { increment: 1 },
          },
        });
        console.log(`Updated customer: ${customer.name}`);
      } else {
        customer = await prisma.customer.create({
          data: {
            name: jobCardData.customerName,
            mobileNumber: jobCardData.mobileNumber,
            address: jobCardData.address || null,
            aadhaarNumber: null,
            visitCount: 1,
          },
        });
        console.log(`Created customer: ${customer.name}`);
      }

      // Link job card to customer
      await prisma.jobCard.update({
        where: { id: jobCard.id },
        data: { customerId: customer.id },
      });
    }
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
