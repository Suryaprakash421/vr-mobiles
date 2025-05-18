import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // Return a sanitized version of the environment variables
    return NextResponse.json({
      status: "success",
      environment: process.env.NODE_ENV,
      vercel: process.env.VERCEL === "1" ? true : false,
      nextAuthUrl: process.env.NEXTAUTH_URL ? "Set" : "Not set",
      databaseUrl: process.env.DATABASE_URL ? "Set" : "Not set",
      apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ? "Set" : "Not set",
      staticGeneration: process.env.NEXT_DISABLE_STATIC_GENERATION === "true" ? "Disabled" : "Enabled",
      time: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in debug env endpoint:", error);
    return NextResponse.json({
      status: "error",
      message: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    }, { status: 500 });
  }
}
