import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request) {
  try {
    // Get the URL to redirect to after logout
    const searchParams = request.nextUrl.searchParams;
    const callbackUrl = searchParams.get("callbackUrl") || "/login";
    
    // Clear all auth-related cookies
    const cookieStore = cookies();
    const allCookies = await cookieStore.getAll();
    
    // Find and delete all NextAuth cookies
    const authCookies = allCookies.filter(cookie => 
      cookie.name.startsWith("next-auth")
    );
    
    // Log the cookies being deleted
    console.log("Custom signout - Deleting cookies:", 
      authCookies.map(c => c.name)
    );
    
    // Delete each auth cookie
    for (const cookie of authCookies) {
      // We need to use the response to set cookies with an expired date
      cookieStore.delete(cookie.name);
    }
    
    // Create a response that redirects to the login page
    const response = NextResponse.redirect(new URL(callbackUrl, request.url));
    
    // Set cookies with expired dates to ensure they're deleted
    for (const cookie of authCookies) {
      response.cookies.set({
        name: cookie.name,
        value: "",
        expires: new Date(0),
        path: "/",
      });
    }
    
    console.log("Custom signout - Redirecting to:", callbackUrl);
    return response;
  } catch (error) {
    console.error("Error in custom signout:", error);
    // If there's an error, still try to redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }
}
