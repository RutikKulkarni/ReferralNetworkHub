import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define route access patterns by role
const routePermissions = {
  // Routes accessible to everyone (public routes)
  public: [
    "/",
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/jobs",
    "/job/[id]",
    "/explore",
    "/about",
    "/contact",
    "/terms-of-service",
    "/privacy-policy",
    "/faq",
  ],

  // Routes accessible to logged-in users
  user: [
    "/profile",
    "/settings",
    "/jobs/saved",
    "/jobs/recommended",
    "/job/[id]/apply",
  ],

  // Routes accessible to recruiters
  recruiter: [
    "/dashboard",
    "/profile",
    "/settings",
    "/jobs/create",
    "/jobs/edit/[id]",
    "/jobs/manage",
    "/analytics",
  ],

  // Routes accessible to admins
  admin: [
    "/admin",
    "/admin/dashboard",
    "/admin/users",
    "/admin/jobs",
    "/admin/reports",
    "/admin/settings",
  ],
};

// Helper to determine if a route matches, including dynamic routes
function matchRoute(requestPath: string, routePattern: string): boolean {
  // Convert Next.js dynamic route pattern to regex
  const dynamicRouteRegex = routePattern
    .replace(/\[\w+\]/g, "[^/]+") // Replace [param] with regex for any characters except /
    .replace(/\//g, "\\/"); // Escape forward slashes

  const regex = new RegExp(`^${dynamicRouteRegex}$`);
  return regex.test(requestPath);
}

// Helper to check if a path is accessible to a role
function isRouteAccessibleToRole(path: string, role: string | null): boolean {
  // Public routes are accessible to everyone
  if (routePermissions.public.some((route) => matchRoute(path, route))) {
    return true;
  }

  // If no role (not authenticated), only public routes are accessible
  if (!role) {
    return false;
  }

  // Check role-specific permissions
  switch (role) {
    case "admin":
      // Admins can access all routes
      return true;
    case "recruiter":
      return (
        routePermissions.recruiter.some((route) => matchRoute(path, route)) ||
        routePermissions.user.some((route) => matchRoute(path, route))
      );
    case "user":
      return routePermissions.user.some((route) => matchRoute(path, route));
    default:
      return false;
  }
}

export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Static assets, api routes, and Next.js internals should be excluded
  if (
    path.startsWith("/_next") ||
    path.startsWith("/api") ||
    path.startsWith("/static") ||
    path.includes(".") // Files with extensions (images, etc.)
  ) {
    return NextResponse.next();
  }

  // Get the user's role from the JWT token in cookies
  // This assumes your access token is stored in cookies and contains role information
  const accessToken = request.cookies.get("accessToken")?.value;
  let role: string | null = null;

  if (accessToken) {
    try {
      const payload = JSON.parse(atob(accessToken.split(".")[1]));
      role = payload.role;
    } catch (error) {
      console.error("Error parsing token:", error);
    }
  }

  // Check if the route is accessible to the user's role
  if (!isRouteAccessibleToRole(path, role)) {
    // If user is trying to access protected route without auth, redirect to login
    if (
      !role &&
      !routePermissions.public.some((route) => matchRoute(path, route))
    ) {
      const url = new URL("/login", request.url);
      url.searchParams.set("from", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    // If user is trying to access a route they don't have permission for, show 404
    return NextResponse.rewrite(new URL("/404", request.url));
  }

  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. _next/static (static files)
     * 2. _next/image (image optimization files)
     * 3. favicon.ico (favicon file)
     * 4. public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)",
  ],
};
