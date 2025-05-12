// This script updates the visit count for all customers based on their job cards
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateCustomerVisitCounts() {
  try {
    console.log('Starting to update customer visit counts...');
    
    // Get all customers
    const customers = await prisma.customer.findMany();
    
    console.log(`Found ${customers.length} customers to process`);
    
    // Process each customer
    for (const customer of customers) {
      try {
        // Count job cards with this customer's mobile number
        const jobCardCount = await prisma.jobCard.count({
          where: {
            OR: [
              { customerId: customer.id },
              { mobileNumber: customer.mobileNumber }
            ]
          },
        });
        
        console.log(`Customer ${customer.id} (${customer.name}): Found ${jobCardCount} job cards, current visit count: ${customer.visitCount}`);
        
        // Update customer's visit count if it doesn't match
        if (jobCardCount !== customer.visitCount) {
          await prisma.customer.update({
            where: {
              id: customer.id,
            },
            data: {
              visitCount: jobCardCount,
            },
          });
          
          console.log(`Updated customer ${customer.id} visit count from ${customer.visitCount} to ${jobCardCount}`);
        } else {
          console.log(`Customer ${customer.id} visit count is already correct (${customer.visitCount})`);
        }
      } catch (customerError) {
        console.error(`Error processing customer ${customer.id}:`, customerError);
      }
    }
    
    console.log('Finished updating customer visit counts');
  } catch (error) {
    console.error('Error updating customer visit counts:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
updateCustomerVisitCounts()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
