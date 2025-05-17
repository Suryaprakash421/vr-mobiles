import { NextResponse } from "next/server";

// This route can be called manually instead of using Vercel's cron jobs
// which are limited on the free tier
export async function GET(request) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get("authorization");
    
    // Check if the request is authorized
    // You can use a secret token or other authentication method
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const token = authHeader.split(" ")[1];
    
    // Check if the token is valid (use a secure comparison method in production)
    if (token !== process.env.CRON_SECRET) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }
    
    // Perform your cron job tasks here
    console.log("Running cron job manually at", new Date().toISOString());
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: "Cron job executed successfully",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error in cron job:", error);
    return NextResponse.json(
      {
        error: "Failed to execute cron job",
        details: error.message
      },
      { status: 500 }
    );
  }
}
