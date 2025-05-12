// This script links existing job cards to customers based on mobile number
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function linkJobCardsToCustomers() {
  try {
    console.log('Starting to link job cards to customers...');
    
    // Get all job cards
    const jobCards = await prisma.jobCard.findMany({
      where: {
        customerId: null, // Only get job cards that don't have a customer ID
      },
    });
    
    console.log(`Found ${jobCards.length} job cards without customer IDs`);
    
    // Process each job card
    for (const jobCard of jobCards) {
      try {
        // Find customer with matching mobile number
        const customer = await prisma.customer.findUnique({
          where: {
            mobileNumber: jobCard.mobileNumber,
          },
        });
        
        if (customer) {
          console.log(`Found customer ${customer.id} for job card ${jobCard.id}`);
          
          // Update job card with customer ID
          await prisma.jobCard.update({
            where: {
              id: jobCard.id,
            },
            data: {
              customerId: customer.id,
            },
          });
          
          console.log(`Updated job card ${jobCard.id} with customer ID ${customer.id}`);
        } else {
          console.log(`No customer found for job card ${jobCard.id} with mobile ${jobCard.mobileNumber}`);
        }
      } catch (jobCardError) {
        console.error(`Error processing job card ${jobCard.id}:`, jobCardError);
      }
    }
    
    console.log('Finished linking job cards to customers');
  } catch (error) {
    console.error('Error linking job cards to customers:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
linkJobCardsToCustomers()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
