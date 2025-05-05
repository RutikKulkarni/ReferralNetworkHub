import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const routePermissions = {
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
  user: [
    "/profile",
    "/settings",
    "/jobs/saved",
    "/jobs/recommended",
    "/job/[id]/apply",
  ],
  recruiter: [
    "/dashboard",
    "/profile",
    "/settings",
    "/jobs/create",
    "/jobs/edit/[id]",
    "/jobs/manage",
    "/analytics",
  ],
  admin: [
    "/admin",
    "/admin/dashboard",
    "/admin/users",
    "/admin/jobs",
    "/admin/reports",
    "/admin/settings",
  ],
};

// Helper function to match dynamic routes
function matchRoute(requestPath: string, routePattern: string): boolean {
  const dynamicRouteRegex = routePattern
    .replace(/\[\w+\]/g, "[^/]+")
    .replace(/\//g, "\\/");
  const regex = new RegExp(`^${dynamicRouteRegex}$`);
  return regex.test(requestPath);
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Skip middleware for static files, API routes, etc.
  if (
    path.startsWith("/_next") ||
    path.startsWith("/api") ||
    path.startsWith("/static") ||
    path.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check if it's a public route
  const isPublicRoute = routePermissions.public.some(
    (route) => route === path || matchRoute(path, route)
  );
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Check for authentication in two ways:
  // 1. Check for accessToken cookie
  // 2. Check for auth status in a special cookie we'll set client-side
  const accessToken = request.cookies.get("accessToken");
  const authStatus = request.cookies.get("auth_status");

  if (accessToken || (authStatus && authStatus.value === "authenticated")) {
    return NextResponse.next();
  }

  // If not authenticated, redirect to login
  const from = encodeURIComponent(path);
  const loginUrl = new URL(`/login?from=${from}`, request.url);

  // Add a cache-busting parameter to prevent caching issues
  loginUrl.searchParams.append("_ts", Date.now().toString());

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)"],
};
