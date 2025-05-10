const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  try {
    const jobCard = await prisma.jobCard.update({
      where: { id: 2 },
      data: { billNo: 2 },
    });

    console.log("Updated job card:", jobCard);
  } catch (error) {
    console.error("Error updating job card:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
