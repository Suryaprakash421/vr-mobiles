import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

// Create a new PrismaClient instance for this API route
// This ensures we have a fresh connection for each serverless function
const prisma = new PrismaClient();

// GET /api/customers-simple - Get all customers with minimal processing
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "You must be signed in to access this endpoint" },
        { status: 401 }
      );
    }

    // Get search parameter
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    console.log("Search parameter:", search);

    // Build where clause for search
    let whereClause = {};
    if (search) {
      whereClause = {
        OR: [
          { name: { contains: search } },
          { mobileNumber: { contains: search } },
          { address: { contains: search } },
        ],
      };
    }

    // Try to get customers from the database
    let customers = [];

    try {
      // For MySQL, we need to use a different query to check if the table exists
      const tableExists = await prisma.$queryRaw`
        SELECT COUNT(*) as count
        FROM information_schema.tables
        WHERE table_schema = DATABASE()
        AND table_name = 'Customer';
      `;

      const exists = tableExists[0]?.count > 0;

      if (exists) {
        // Get customers with minimal processing
        customers = await prisma.customer.findMany({
          where: whereClause,
          orderBy: {
            updatedAt: "desc",
          },
          take: 100, // Limit to 100 customers for performance
        });
        console.log(
          `Found ${customers.length} customers matching search criteria`
        );
      } else {
        // Table doesn't exist, return empty array
        console.log("Customer table doesn't exist in the database");
      }
    } catch (dbError) {
      console.error("Database error:", dbError);
      // Return empty array on database error
    } finally {
      // Disconnect from the database to prevent connection leaks
      await prisma.$disconnect();
    }

    return NextResponse.json({
      customers,
      totalCount: customers.length,
      success: true,
    });
  } catch (error) {
    console.error("Error in customers-simple API:", error);
    // Make sure to disconnect even if there's an error
    try {
      await prisma.$disconnect();
    } catch (disconnectError) {
      console.error("Error disconnecting from database:", disconnectError);
    }

    return NextResponse.json(
      {
        error: "Failed to fetch customers",
        details: error.message,
        stack: error.stack,
        customers: [],
        success: false,
      },
      { status: 500 }
    );
  }
}
