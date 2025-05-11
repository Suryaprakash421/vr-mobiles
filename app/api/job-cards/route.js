import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

// GET all job cards
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get search query from URL
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    let whereClause = {};

    // If search parameter exists, add it to the where clause
    if (search) {
      whereClause = {
        OR: [
          { billNo: isNaN(parseInt(search)) ? undefined : parseInt(search) },
          { customerName: { contains: search } },
          { mobileNumber: { contains: search } },
          { model: { contains: search } },
        ].filter(Boolean),
      };
    }

    const jobCards = await prisma.jobCard.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        createdBy: {
          select: {
            name: true,
            username: true,
          },
        },
      },
    });

    return NextResponse.json(jobCards);
  } catch (error) {
    console.error("Error fetching job cards:", error);
    return NextResponse.json(
      { error: "Failed to fetch job cards" },
      { status: 500 }
    );
  }
}

// POST create a new job card
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      console.log("Unauthorized: No session found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Session user:", session.user);

    const data = await request.json();
    console.log("Received data:", data);
    console.log("Data type:", typeof data);
    console.log("Data keys:", Object.keys(data));
    console.log("Status value:", data.status);
    console.log("Status type:", typeof data.status);

    // Get the user ID from the session
    const userId = parseInt(session.user.id);

    if (isNaN(userId)) {
      console.error("Invalid user ID:", session.user.id);
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    // Check if a customer with this mobile number exists
    let customerId = null;
    if (data.mobileNumber) {
      try {
        const existingCustomer = await prisma.customer.findUnique({
          where: {
            mobileNumber: data.mobileNumber,
          },
        });

        if (existingCustomer) {
          customerId = existingCustomer.id;
          console.log("Found existing customer:", existingCustomer.id);
        }
      } catch (customerError) {
        console.error("Error finding customer:", customerError);
        // Continue without customer ID if there's an error
      }
    }

    // Prepare the data for creation
    const jobCardData = {
      customerName: data.customerName,
      mobileNumber: data.mobileNumber,
      address: data.address || null,
      complaint: data.complaint,
      model: data.model,
      isOn: data.isOn || false,
      isOff: data.isOff || false,
      hasBattery: data.hasBattery || false,
      hasDoor: data.hasDoor || false,
      hasSim: data.hasSim || false,
      hasSlot: data.hasSlot || false,
      admissionFees: data.admissionFees || null,
      aadhaarNumber: data.aadhaarNumber || null,
      estimate: data.estimate || null,
      advance: data.advance || null,
      finalAmount: data.finalAmount || null,
      status: data.status || "pending", // Add the status field with a default value
      userId: userId,
      // Removed customerId field to avoid Prisma errors
    };

    console.log("Creating job card with data:", jobCardData);

    try {
      // Create the job card without billNo first
      const jobCard = await prisma.jobCard.create({
        data: jobCardData,
      });

      console.log("Job card created:", jobCard);

      try {
        // Update the billNo to match the id in a separate step
        const updatedJobCard = await prisma.jobCard.update({
          where: { id: jobCard.id },
          data: { billNo: jobCard.id },
        });

        console.log("Updated job card with billNo:", updatedJobCard);
        return NextResponse.json(updatedJobCard, { status: 201 });
      } catch (updateError) {
        console.error("Error updating job card with billNo:", updateError);
        // Return the original job card if update fails
        return NextResponse.json(
          {
            ...jobCard,
            warning: "Job card created but billNo could not be updated",
          },
          { status: 201 }
        );
      }
    } catch (createError) {
      console.error("Error creating job card:", createError);
      return NextResponse.json(
        {
          error: "Failed to create job card",
          details: createError.message,
          code: createError.code,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error creating job card:", error);
    console.error("Error stack:", error.stack);

    // Provide more detailed error information
    return NextResponse.json(
      {
        error: "Failed to create job card",
        details: error.message,
        stack: error.stack,
        name: error.name,
        code: error.code,
      },
      { status: 500 }
    );
  }
}
