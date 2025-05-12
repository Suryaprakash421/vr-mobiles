import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// GET /api/customers - Get all customers
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
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "5");

    // Validate pagination parameters
    const validatedPage = page > 0 ? page : 1;
    const validatedPageSize = pageSize > 0 && pageSize <= 100 ? pageSize : 5;
    const skip = (validatedPage - 1) * validatedPageSize;

    // Build where clause for search
    let whereClause = {};
    if (search) {
      whereClause = {
        OR: [
          { name: { contains: search } },
          { mobileNumber: { contains: search } },
          { address: { contains: search } },
          { aadhaarNumber: { contains: search } },
        ].filter(Boolean),
      };
    }

    // Get total count for pagination
    const totalCount = await prisma.customer.count({
      where: whereClause,
    });

    // Get customers with pagination
    const customers = await prisma.customer.findMany({
      where: whereClause,
      orderBy: {
        updatedAt: "desc",
      },
      skip,
      take: validatedPageSize,
    });

    return NextResponse.json({
      customers,
      totalCount,
      page: validatedPage,
      pageSize: validatedPageSize,
      totalPages: Math.ceil(totalCount / validatedPageSize),
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch customers",
        details: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}

// POST /api/customers - Create a new customer
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "You must be signed in to access this endpoint" },
        { status: 401 }
      );
    }

    const data = await request.json();

    // Check if customer with this mobile number already exists
    const existingCustomer = await prisma.customer.findUnique({
      where: {
        mobileNumber: data.mobileNumber,
      },
    });

    if (existingCustomer) {
      return NextResponse.json(
        { error: "Customer with this mobile number already exists" },
        { status: 400 }
      );
    }

    // Create new customer
    const customer = await prisma.customer.create({
      data: {
        name: data.name,
        mobileNumber: data.mobileNumber,
        address: data.address,
        aadhaarNumber: data.aadhaarNumber,
      },
    });

    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    console.error("Error creating customer:", error);
    return NextResponse.json(
      {
        error: "Failed to create customer",
        details: error.message,
        code: error.code,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}
