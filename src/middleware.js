import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  console.log(
    "Middleware - Processing request for path:",
    request.nextUrl.pathname
  );

  try {
    // Log all cookies for debugging
    const cookies = request.cookies.getAll();
    console.log(
      "Middleware - All cookies:",
      cookies.map((c) => c.name)
    );

    // Check for session token cookie
    const sessionCookie = cookies.find(
      (c) => c.name === "next-auth.session-token"
    );
    console.log("Middleware - Session cookie exists:", !!sessionCookie);

    // Get the token with the secret from .env
    const token = await getToken({
      req: request,
      secret:
        process.env.NEXTAUTH_SECRET ||
        "a-more-secure-secret-key-for-jwt-encryption-123456789",
      secureCookie: process.env.NODE_ENV === "production",
      cookieName: "next-auth.session-token",
    });

    const isAuthenticated = !!token;
    console.log("Middleware - Authentication status:", isAuthenticated);
    if (token) {
      console.log("Middleware - Token found:", {
        id: token.id,
        username: token.username,
        exp: token.exp,
        iat: token.iat,
      });
    }

    // Define public paths that don't require authentication
    const publicPaths = [
      "/login",
      "/register",
      "/api/auth",
      "/api/debug",
      "/api/auth/custom-signout",
    ];

    // Check if the requested path is a public path
    const isPublicPath = publicPaths.some((path) =>
      request.nextUrl.pathname.startsWith(path)
    );

    console.log("Middleware - Is public path:", isPublicPath);

    // If the user is not authenticated and trying to access a protected route
    if (!isAuthenticated && !isPublicPath) {
      console.log("Middleware - Redirecting unauthenticated user to login");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // If the user is authenticated and trying to access login/register
    if (
      isAuthenticated &&
      request.nextUrl.pathname.match(/^\/(login|register)$/)
    ) {
      console.log("Middleware - Redirecting authenticated user to dashboard");
      return NextResponse.redirect(new URL("/", request.url));
    }

    console.log("Middleware - Allowing request to proceed");
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware - Error processing request:", error);

    // In case of error, allow the request to proceed
    // This prevents authentication errors from blocking the application
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
