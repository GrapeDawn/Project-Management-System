import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export function middleware(req) {
  const token = req.cookies.get('authToken');

  if (!token) {
    // If no token is found, redirect to login
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    // Verify the JWT token
    verify(token, JWT_SECRET);

    // Allow request to continue if token is valid
    return NextResponse.next();
  } catch (err) {
    // If token verification fails, redirect to login
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

// Specify the paths that should be protected
export const config = {
  matcher: ['/admin/:path*'], // Adjust as needed to protect routes under /admin
};
