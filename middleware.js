import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Check if the user has the required permissions for the route
const checkPermissions = (routePath, permissions) => {
  // Extract the first part of the route path (e.g., "admin", "product")
  const routeName = routePath.split("/")[1].toLowerCase();

  // Check if the routeName exists in permissions and if the user has read/write permissions
  if (permissions[routeName]) {
    return (
      permissions[routeName].includes("read") || permissions[routeName].includes("write")
    );
  }

  return false; // Default to false if no matching permissions found
};

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

    const publicPages = ["/", "/Client", "/Member"];
    if (publicPages.includes(url.pathname) || url.pathname.startsWith("/api") || ["Login", "signup", "Denied"].includes(url.pathname)) {
      return NextResponse.next();
    }

    console.log("Token Permissions:", token?.permissions); // Log permissions for debugging

    const routePath = req.nextUrl.pathname;

    // Perform role-based access checks dynamically
    if (!checkPermissions(routePath, token.permissions)) {
      console.log(`Access denied for route: ${routePath}`); // Log denied routes
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
    "/product/:path*",
    "/category/:path*",
    "/view/:path*",
    "/((?!Login|Denied|_next|api/auth|signup|api/signup).*)",
  ],
};
