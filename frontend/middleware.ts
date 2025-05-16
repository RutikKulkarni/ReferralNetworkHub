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
 * Check if route is allowed for the current user state
 */
function isRouteAllowed(path: string, isAuthenticated: boolean): boolean {
  const isPublicRoute = routePermissions.public.some(
    (route) => route === path || matchRoute(path, route)
  );

  if (isPublicRoute) {
    return true;
  }

  return isAuthenticated;
}

/**
 * Middleware function to handle authentication and route protection
 */
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (
    path.startsWith("/_next") ||
    path.startsWith("/api") ||
    path.startsWith("/static") ||
    path.includes(".")
  ) {
    return NextResponse.next();
  }

  if (isRedirectLoop(request)) {
    console.error("Detected redirect loop for:", path);
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("accessToken");
  const refreshToken = request.cookies.get("refreshToken");
  const isLoggedInCookie = request.cookies.get("isLoggedIn");
  const authStatusCookie = request.cookies.get("auth_status");

  const isAuthenticated = Boolean(
    accessToken?.value ||
      (refreshToken?.value &&
        (isLoggedInCookie?.value === "true" ||
          authStatusCookie?.value === "authenticated"))
  );

  if (isRouteAllowed(path, isAuthenticated)) {
    return NextResponse.next();
  }

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

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)"],
};
