import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { compare } from "bcrypt";

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    console.log("Debug login attempt with username:", username);

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Missing username or password" },
        { status: 400 }
      );
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      console.log("Debug login: User not found");
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 401 }
      );
    }

    console.log("Debug login: Found user with ID:", user.id);

    // Compare passwords
    const isPasswordValid = await compare(password, user.password);
    console.log("Debug login: Password valid:", isPasswordValid);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: "Invalid password" },
        { status: 401 }
      );
    }

    // Return success
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Debug login error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
