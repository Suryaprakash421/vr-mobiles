import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

// Set cache control headers for GET requests
export const revalidate = 60; // Revalidate every 60 seconds

// GET all job cards
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get search query and pagination from URL
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const limit = parseInt(searchParams.get("limit") || pageSize);

    // Check if we should return all records (for client-side filtering)
    const returnAll = limit > pageSize;

    // Calculate pagination offsets (only if not returning all)
    const skip = returnAll ? 0 : (page - 1) * pageSize;
    const take = returnAll ? limit : pageSize;

    let whereClause = {};

    // If search parameter exists, add it to the where clause
    if (search) {
      whereClause = {
        OR: [
          { billNo: isNaN(parseInt(search)) ? undefined : parseInt(search) },
          { customerName: { contains: search } },
          { mobileNumber: { contains: search } },
          { model: { contains: search } },
          { complaint: { contains: search } },
        ].filter(Boolean),
      };
    }

    // Get total count for pagination
    const totalCount = await prisma.jobCard.count({
      where: whereClause,
    });

    // Optimize the query based on whether we need all fields
    try {
      const jobCards = await prisma.jobCard.findMany({
        where: whereClause,
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take,
        include: {
          createdBy: {
            select: {
              name: true,
              username: true,
            },
          },
          customer: {
            select: {
              id: true,
              name: true,
              mobileNumber: true,
              visitCount: true,
            },
          },
        },
      });

      // Process job cards to handle any null createdBy relations
      const processedJobCards = jobCards.map((card) => {
        if (!card.createdBy) {
          // If createdBy is null, provide a default value
          return {
            ...card,
            createdBy: {
              name: "Unknown User",
              username: "unknown",
            },
          };
        }
        return card;
      });

      // Set cache headers
      const response = NextResponse.json({
        jobCards: processedJobCards,
        totalCount,
        page: returnAll ? 1 : page,
        pageSize: returnAll ? totalCount : pageSize,
        totalPages: returnAll ? 1 : Math.ceil(totalCount / pageSize),
      });

      // Add cache control headers
      response.headers.set(
        "Cache-Control",
        "public, s-maxage=60, stale-while-revalidate=300"
      );

      return response;
    } catch (findManyError) {
      console.error("Error in findMany query:", findManyError);

      // Try a simpler query without the include
      try {
        const simpleJobCards = await prisma.jobCard.findMany({
          where: whereClause,
          orderBy: {
            createdAt: "desc",
          },
          skip,
          take,
          // No include to avoid relation issues
        });

        // Return the simplified job cards
        const fallbackResponse = NextResponse.json({
          jobCards: simpleJobCards,
          totalCount,
          page: returnAll ? 1 : page,
          pageSize: returnAll ? totalCount : pageSize,
          totalPages: returnAll ? 1 : Math.ceil(totalCount / pageSize),
          warning: "Simplified data returned due to relation issues",
        });

        fallbackResponse.headers.set(
          "Cache-Control",
          "public, s-maxage=60, stale-while-revalidate=300"
        );

        return fallbackResponse;
      } catch (fallbackError) {
        console.error("Error in fallback query:", fallbackError);
        throw fallbackError; // Let the outer catch handle it
      }
    }
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

    // Parse request data
    const data = await request.json();

    // Get the user ID from the session
    const userId = parseInt(session.user.id);

    if (isNaN(userId)) {
      console.error("Invalid user ID:", session.user.id);
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    // Verify that the user exists in the database
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        console.error("User not found in database:", userId);
        return NextResponse.json({ error: "User not found" }, { status: 400 });
      }
    } catch (userError) {
      console.error("Error verifying user:", userError);
      return NextResponse.json(
        { error: "Failed to verify user", details: userError.message },
        { status: 500 }
      );
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
          // Update the customer's visit count
          try {
            // Count existing job cards for this customer
            const existingJobCount = await prisma.jobCard.count({
              where: {
                OR: [
                  { customerId: existingCustomer.id },
                  { mobileNumber: existingCustomer.mobileNumber },
                ],
              },
            });

            // Add 1 for the new job card being created
            const newVisitCount = existingJobCount + 1;

            await prisma.customer.update({
              where: { id: existingCustomer.id },
              data: {
                visitCount: newVisitCount,
              },
            });
          } catch (updateError) {
            console.error("Error updating customer visit count:", updateError);
            // Continue even if visit count update fails
          }
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
      customerId: customerId, // Link to customer if exists
    };

    try {
      // Create the job card without billNo first
      const jobCard = await prisma.jobCard.create({
        data: {
          ...jobCardData,
          // Make sure customerId is properly set
          customerId: customerId,
        },
      });

      try {
        // Update the billNo to match the id in a separate step
        const updatedJobCard = await prisma.jobCard.update({
          where: { id: jobCard.id },
          data: { billNo: jobCard.id },
        });

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
