import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
  const token = await getToken({ req: request });
  const isAuthenticated = !!token;
  
  // Define public paths that don't require authentication
  const publicPaths = ['/login', '/register'];
  
  // Check if the requested path is a public path
  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );
  
  // If the user is not authenticated and trying to access a protected route
  if (!isAuthenticated && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // If the user is authenticated and trying to access login/register
  if (isAuthenticated && isPublicPath) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
