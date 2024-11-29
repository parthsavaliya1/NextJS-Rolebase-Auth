import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const url = req.nextUrl.clone();

    // Bypass /signup, /api/auth, and /api/signup paths for session check
    if (url.pathname === "/signup" || url.pathname.startsWith("/api/auth") || url.pathname === "/api/signup") {
      return NextResponse.next();  // Skip middleware for signup and auth routes
    }

    const { token } = req.nextauth;

    // Protect /Admin routes (ensure user is authenticated and an admin)
    if (!token && req.nextUrl.pathname.startsWith("/Admin")) {
      return NextResponse.redirect(new URL("/Login", req.url));
    }

    // Check for admin role for /Admin routes
    if (req.nextUrl.pathname.startsWith("/Admin") && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/Denied", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Ensure user is authenticated
    },
    pages: {
      signIn: "/Login", // Redirect to login if not authenticated
    },
  }
);

export const config = {
  matcher: [
    "/Admin/:path*", // Protect admin routes
    "/((?!Login|Denied|_next|api/auth|signup|api/signup).*)" // Exclude /signup, /api/auth, and /api/signup from middleware
  ],
};
