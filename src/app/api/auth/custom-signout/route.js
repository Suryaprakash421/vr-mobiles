import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request) {
  try {
    // Get the URL to redirect to after logout
    const searchParams = request.nextUrl.searchParams;
    const callbackUrl = searchParams.get("callbackUrl") || "/login";

    // Create a response that redirects to the login page
    const response = NextResponse.redirect(new URL(callbackUrl, request.url));

    // Set cookies with expired dates to ensure they're deleted
    // This approach doesn't use the cookies() API which is causing issues
    response.cookies.set({
      name: "next-auth.session-token",
      value: "",
      expires: new Date(0),
      path: "/",
    });

    response.cookies.set({
      name: "next-auth.csrf-token",
      value: "",
      expires: new Date(0),
      path: "/",
    });

    response.cookies.set({
      name: "next-auth.callback-url",
      value: "",
      expires: new Date(0),
      path: "/",
    });

    console.log("Custom signout - Redirecting to:", callbackUrl);
    return response;
  } catch (error) {
    console.error("Error in custom signout:", error);
    // If there's an error, still try to redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }
}
