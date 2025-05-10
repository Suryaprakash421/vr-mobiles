import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// PATCH /api/job-cards/[id]/status
export async function PATCH(request, { params }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the job card ID from the URL
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    // Get the status from the request body
    const { status } = await request.json();

    // Validate the status
    const validStatuses = ["pending", "in-progress", "completed"];
    if (!validStatuses.includes(status)) {
      console.error(
        `Invalid status: ${status}. Valid statuses are: ${validStatuses.join(
          ", "
        )}`
      );
      return NextResponse.json(
        {
          error: `Invalid status: ${status}. Valid statuses are: ${validStatuses.join(
            ", "
          )}`,
        },
        { status: 400 }
      );
    }

    console.log(`Updating job card ${id} status to ${status}`);

    // Update the job card status
    try {
      const updatedJobCard = await prisma.jobCard.update({
        where: { id },
        data: { status },
      });

      console.log(`Successfully updated job card ${id} status to ${status}`);
      return NextResponse.json(updatedJobCard);
    } catch (error) {
      console.error(`Error updating job card ${id} status:`, error);
      return NextResponse.json(
        {
          error: `Failed to update job card status: ${error.message}`,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error updating job card status:", error);
    return NextResponse.json(
      { error: "Failed to update job card status" },
      { status: 500 }
    );
  }
}
