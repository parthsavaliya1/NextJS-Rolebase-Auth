import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const { token } = req.nextauth;
    const url = req.nextUrl.clone();

    // Bypass certain routes (e.g., login, signup, public assets)
    if (["/Login", "/signup", "/Denied"].includes(url.pathname) || url.pathname.startsWith("/api")) {
      return NextResponse.next();
    }

    if (!token) {
      // Redirect unauthenticated users to the login page
      return NextResponse.redirect(new URL("/Login", req.url));
    }

    console.log(token)

    const routePath = req.nextUrl.pathname;

    // Role-based access checks
    if (routePath.startsWith("/Admin") && !token?.permissions?.admin.includes("write")) {
      return NextResponse.redirect(new URL("/Denied", req.url));
    }

    if (routePath.startsWith("/ClientMember") && !token?.permissions?.user.includes("read")) {
      return NextResponse.redirect(new URL("/Denied", req.url));
    }

    if (routePath.startsWith("/product") && !token?.permissions?.product.includes("write")) {
      return NextResponse.redirect(new URL("/Denied", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Check if the user is authenticated
    },
    pages: {
      signIn: "/Login", // Redirect to login if not authenticated
    },
  }
);

export const config = {
  matcher: [
    "/Admin/:path*",
    "/ClientMember/:path*",
    "/Member/:path*",
    "/((?!Login|Denied|_next|api/auth|signup|api/signup).*)",
  ],
};
