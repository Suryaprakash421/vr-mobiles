import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

// GET a single job card by ID
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    try {
      const jobCard = await prisma.jobCard.findUnique({
        where: { id },
        include: {
          createdBy: {
            select: {
              name: true,
              username: true,
            },
          },
        },
      });

      if (!jobCard) {
        return NextResponse.json(
          { error: "Job card not found" },
          { status: 404 }
        );
      }

      // Handle null createdBy relation
      if (!jobCard.createdBy) {
        jobCard.createdBy = {
          name: "Unknown User",
          username: "unknown"
        };
      }

      return NextResponse.json(jobCard);
    } catch (findError) {
      console.error("Error in findUnique with include:", findError);

      // Fallback to a simpler query without the include
      const simpleJobCard = await prisma.jobCard.findUnique({
        where: { id },
      });

      if (!simpleJobCard) {
        return NextResponse.json(
          { error: "Job card not found" },
          { status: 404 }
        );
      }

      // Add a default createdBy
      simpleJobCard.createdBy = {
        name: "Unknown User",
        username: "unknown"
      };

      return NextResponse.json({
        ...simpleJobCard,
        warning: "Simplified data returned due to relation issues"
      });
  } catch (error) {
    console.error("Error fetching job card:", error);
    return NextResponse.json(
      { error: "Failed to fetch job card" },
      { status: 500 }
    );
  }
}

// PUT update a job card
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const data = await request.json();

    // Check if the job card exists
    const existingJobCard = await prisma.jobCard.findUnique({
      where: { id },
    });

    if (!existingJobCard) {
      return NextResponse.json(
        { error: "Job card not found" },
        { status: 404 }
      );
    }

    // Check if a customer with this mobile number exists
    let customerId = existingJobCard.customerId;
    if (
      data.mobileNumber &&
      data.mobileNumber !== existingJobCard.mobileNumber
    ) {
      try {
        const existingCustomer = await prisma.customer.findUnique({
          where: {
            mobileNumber: data.mobileNumber,
          },
        });

        if (existingCustomer) {
          customerId = existingCustomer.id;
          console.log(
            "Found existing customer for updated job card:",
            existingCustomer.id
          );
        }
      } catch (customerError) {
        console.error(
          "Error finding customer for job card update:",
          customerError
        );
      }
    }

    // Update the job card
    const updatedJobCard = await prisma.jobCard.update({
      where: { id },
      data: {
        ...data,
        customerId: customerId,
      },
    });

    return NextResponse.json(updatedJobCard);
  } catch (error) {
    console.error("Error updating job card:", error);
    return NextResponse.json(
      { error: "Failed to update job card" },
      { status: 500 }
    );
  }
}

// DELETE a job card
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    // Check if the job card exists
    const existingJobCard = await prisma.jobCard.findUnique({
      where: { id },
    });

    if (!existingJobCard) {
      return NextResponse.json(
        { error: "Job card not found" },
        { status: 404 }
      );
    }

    // Store customer information before deleting the job card
    const customerId = existingJobCard.customerId;
    const mobileNumber = existingJobCard.mobileNumber;

    console.log(
      `Deleting job card ${id} with customerId ${customerId} and mobileNumber ${mobileNumber}`
    );

    // Delete the job card
    await prisma.jobCard.delete({
      where: { id },
    });

    // Update the customer's visit count if the job card was associated with a customer
    if (customerId || mobileNumber) {
      try {
        // Find the customer
        let customer = null;

        if (customerId) {
          customer = await prisma.customer.findUnique({
            where: { id: customerId },
          });
        }

        if (!customer && mobileNumber) {
          customer = await prisma.customer.findUnique({
            where: { mobileNumber },
          });
        }

        if (customer) {
          // Count remaining job cards for this customer
          const remainingJobCount = await prisma.jobCard.count({
            where: {
              OR: [
                { customerId: customer.id },
                { mobileNumber: customer.mobileNumber },
              ],
            },
          });

          console.log(
            `Updating customer ${customer.id} visit count from ${customer.visitCount} to ${remainingJobCount}`
          );

          // Update the customer's visit count
          const updatedCustomer = await prisma.customer.update({
            where: { id: customer.id },
            data: {
              visitCount: remainingJobCount,
            },
          });

          console.log(
            `Customer ${customer.id} visit count updated successfully to ${updatedCustomer.visitCount}`
          );

          console.log(
            `Updated customer ${customer.id} visit count to ${remainingJobCount} after job card deletion`
          );
        }
      } catch (updateError) {
        console.error(
          "Error updating customer visit count after job card deletion:",
          updateError
        );
        // Continue even if visit count update fails
      }
    }

    return NextResponse.json({ message: "Job card deleted successfully" });
  } catch (error) {
    console.error("Error deleting job card:", error);
    return NextResponse.json(
      { error: "Failed to delete job card" },
      { status: 500 }
    );
  }
}
