import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const checkPermissions = (routePath, permissions) => {
  // Ensure that we remove the leading "/" and split by "/"
  const routeName = routePath.replace(/^\/+/, '').split("/")[0]?.trim(); // Remove any leading '/' and get the first part
  console.log('routepath', routePath,routeName, permissions);

  if (!routeName) {
    console.log('Invalid route path');
    return false;
  }

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
    if (["/Login", "/signup", "/denied"].includes(url.pathname) || url.pathname.startsWith("/api")) {
      return NextResponse.next();
    }

    if (!token) {
      // Redirect unauthenticated users to the login page
      return NextResponse.redirect(new URL("/Login", req.url));
    }

    const publicPages = ["/", "/Client", "/member"];
    if (publicPages.includes(url.pathname) || url.pathname.startsWith("/api") || ["Login", "signup", "denied"].includes(url.pathname)) {
      return NextResponse.next();
    }

    console.log("Token Permissions:", token?.permissions); // Log permissions for debugging

    const routePath = req.nextUrl.pathname;

    // Perform role-based access checks dynamically
    if (!checkPermissions(routePath, token.permissions)) {
      console.log(`Access denied for route: ${routePath}`); // Log denied routes
      return NextResponse.redirect(new URL("/denied", req.url));
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
    "/admin/:path*",
    "/clientmember/:path*",
    "/member/:path*",
    "/product/:path*",
    "/category/:path*",
    "/view/:path*",
    "/((?!Login|denied|_next|api/auth|signup|api/signup).*)",
  ],
};
