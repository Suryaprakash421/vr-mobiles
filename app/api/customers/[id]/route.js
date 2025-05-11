import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// GET /api/customers/[id] - Get a specific customer
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "You must be signed in to access this endpoint" },
        { status: 401 }
      );
    }

    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid customer ID" },
        { status: 400 }
      );
    }

    // Get customer with job cards
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        jobCards: {
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
        },
      },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(customer);
  } catch (error) {
    console.error("Error fetching customer:", error);
    return NextResponse.json(
      { error: "Failed to fetch customer" },
      { status: 500 }
    );
  }
}

// PUT /api/customers/[id] - Update a customer
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "You must be signed in to access this endpoint" },
        { status: 401 }
      );
    }

    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid customer ID" },
        { status: 400 }
      );
    }

    const data = await request.json();

    // Check if customer exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { id },
    });

    if (!existingCustomer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    // Check if mobile number is being changed and if it's already in use
    if (
      data.mobileNumber &&
      data.mobileNumber !== existingCustomer.mobileNumber
    ) {
      const mobileInUse = await prisma.customer.findUnique({
        where: {
          mobileNumber: data.mobileNumber,
        },
      });

      if (mobileInUse) {
        return NextResponse.json(
          { error: "Mobile number already in use by another customer" },
          { status: 400 }
        );
      }
    }

    // Update customer
    const updatedCustomer = await prisma.customer.update({
      where: { id },
      data: {
        name: data.name,
        mobileNumber: data.mobileNumber,
        address: data.address,
        aadhaarNumber: data.aadhaarNumber,
      },
    });

    return NextResponse.json(updatedCustomer);
  } catch (error) {
    console.error("Error updating customer:", error);
    return NextResponse.json(
      { error: "Failed to update customer" },
      { status: 500 }
    );
  }
}

// DELETE /api/customers/[id] - Delete a customer
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "You must be signed in to access this endpoint" },
        { status: 401 }
      );
    }

    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid customer ID" },
        { status: 400 }
      );
    }

    // Check if customer exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { id },
      include: {
        jobCards: true,
      },
    });

    if (!existingCustomer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    // Check if customer has job cards
    if (existingCustomer.jobCards.length > 0) {
      // Update job cards to remove customer association
      await prisma.jobCard.updateMany({
        where: {
          customerId: id,
        },
        data: {
          customerId: null,
        },
      });
    }

    // Delete customer
    await prisma.customer.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting customer:", error);
    return NextResponse.json(
      { error: "Failed to delete customer" },
      { status: 500 }
    );
  }
}
