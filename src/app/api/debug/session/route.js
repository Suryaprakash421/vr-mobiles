import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { cookies } from "next/headers";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // Get all cookies for debugging
    const cookieStore = cookies();
    const allCookies = await cookieStore.getAll();
    const cookieNames = allCookies.map((cookie) => cookie.name);

    // Check for session token
    const sessionCookie = await cookieStore.get("next-auth.session-token");

    // Get the session using getServerSession
    const session = await getServerSession(authOptions);

    // Get the token directly
    const token = await getToken({
      req: request,
      secret:
        process.env.NEXTAUTH_SECRET ||
        "a-more-secure-secret-key-for-jwt-encryption-123456789",
    });

    return NextResponse.json({
      status: "success",
      cookies: {
        all: cookieNames,
        sessionExists: !!sessionCookie,
        sessionValue: sessionCookie ? "exists (not shown)" : null,
      },
      session: session,
      token: token
        ? {
            ...token,
            // Don't expose the full token for security
            tokenExists: true,
            exp: token.exp,
            iat: token.iat,
          }
        : null,
      authenticated: !!session,
    });
  } catch (error) {
    console.error("Session debug error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
