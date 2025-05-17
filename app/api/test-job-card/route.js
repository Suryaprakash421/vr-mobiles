import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

// POST create a test job card with minimal data
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      console.log("Unauthorized: No session found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Session user:", session.user);

    // Get the user ID from the session
    const userId = parseInt(session.user.id);

    if (isNaN(userId)) {
      console.error("Invalid user ID:", session.user.id);
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    // Create a minimal job card
    const minimalJobCardData = {
      customerName: "Test Customer",
      mobileNumber: "1234567890",
      complaint: "Test Complaint",
      model: "Test Model",
      status: "pending",
      userId: userId,
    };

    console.log("Creating minimal job card with data:", minimalJobCardData);

    // Create the job card without billNo first
    const jobCard = await prisma.jobCard.create({
      data: minimalJobCardData,
    });

    console.log("Minimal job card created:", jobCard);

    // Update the billNo to match the id in a separate step
    const updatedJobCard = await prisma.jobCard.update({
      where: { id: jobCard.id },
      data: { billNo: jobCard.id },
    });

    console.log("Updated minimal job card with billNo:", updatedJobCard);

    return NextResponse.json(updatedJobCard, { status: 201 });
  } catch (error) {
    console.error("Error creating test job card:", error);
    console.error("Error stack:", error.stack);

    return NextResponse.json(
      {
        error: "Failed to create test job card",
        details: error.message,
        stack: error.stack,
        name: error.name,
        code: error.code,
      },
      { status: 500 }
    );
  }
}
