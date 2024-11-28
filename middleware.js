import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth;

    // Log the current path and role (for debugging purposes)
    console.log(req.nextUrl.pathname);
    console.log(token?.role);

    // Protect routes under /Admin/ (match any path under Admin)
    if (!token && req.nextUrl.pathname.startsWith("/Admin")) {
      return NextResponse.redirect(new URL("/Login", req.url));
    }

    if (req.nextUrl.pathname.startsWith("/Admin") && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/Denied", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Ensure the user is authenticated
    },
    pages: {
      signIn: "/Login", // Redirect to the login page if not authenticated
    },
  }
);

export const config = {
  matcher: ["/Admin/:path*", "/((?!Login|Denied|_next|api/auth).*)"],
};
