import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth;

    // Log the current path and role (for debugging purposes)
    console.log(req.nextUrl.pathname);
    console.log(token?.role);

    // If no token and not accessing login page, redirect to login
    if (!token && req.nextUrl.pathname !== "/Login") {
      // If the request is already on the Login page, don't add callbackUrl
      return NextResponse.redirect(new URL("/Login", req.url));
    }

    // Redirect non-admins away from admin pages
    if (req.nextUrl.pathname.startsWith("/Admin") && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/Denied", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/Login",
    },
  }
);

export const config = {
  matcher: ["/Admin", "/((?!Login|Denied|_next|api/auth).*)"],
};
