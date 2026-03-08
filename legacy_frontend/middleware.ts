import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { validateAccessToken } from "@/lib/auth";

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
    "/profile/edit",
    "/settings",
    "/jobs/saved",
    "/jobs/recommended",
    "/job/[id]/apply",
  ],
  recruiter: [
    "/dashboard",
    "/profile",
    "/profile/edit",
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

/**
 * Helper function to match dynamic routes
 */
function matchRoute(requestPath: string, routePattern: string): boolean {
  const dynamicRouteRegex = routePattern
    .replace(/\[\w+\]/g, "[^/]+")
    .replace(/\//g, "\\/");
  const regex = new RegExp(`^${dynamicRouteRegex}$`);
  return regex.test(requestPath);
}

/**
 * Prevent infinite redirect loops
 */
function isRedirectLoop(request: NextRequest): boolean {
  const redirectCount = parseInt(
    request.headers.get("x-redirect-count") || "0"
  );
  return redirectCount >= 3;
}

/**
 * Middleware function to handle authentication and route protection
 */
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Skip middleware for Next.js internals and static files
  if (
    path.startsWith("/_next") ||
    path.startsWith("/api") ||
    path.startsWith("/static") ||
    path.includes(".")
  ) {
    return NextResponse.next();
  }

  // Prevent redirect loops
  if (isRedirectLoop(request)) {
    console.error("Detected redirect loop for:", path);
    return NextResponse.next();
  }

  // Check if it's a public route - if so, allow access
  const isPublicRoute = routePermissions.public.some(
    (route) => route === path || matchRoute(path, route)
  );
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Avoid redirecting if already on login page
  if (path === "/login") {
    return NextResponse.next();
  }

  // Check authentication status by validating the access token
  const accessToken = request.headers.get("x-access-token");
  let isAuthenticated = false;

  if (accessToken) {
    try {
      await validateAccessToken(accessToken);
      isAuthenticated = true;
    } catch (error) {
      console.error("Token validation failed in middleware:", error);
      isAuthenticated = false;
    }
  }

  if (!isAuthenticated) {
    const from = encodeURIComponent(path);
    const loginUrl = new URL(`/login?from=${from}`, request.url);
    loginUrl.searchParams.append("_ts", Date.now().toString());
    const response = NextResponse.redirect(loginUrl);
    const currentRedirectCount = parseInt(
      request.headers.get("x-redirect-count") || "0"
    );
    response.headers.set(
      "x-redirect-count",
      (currentRedirectCount + 1).toString()
    );
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)"],
};
