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

  if (
    path.startsWith("/_next") ||
    path.startsWith("/api") ||
    path.startsWith("/static") ||
    path.includes(".")
  ) {
    return NextResponse.next();
  }

  const isPublicRoute = routePermissions.public.some(
    (route) => route === path || matchRoute(path, route)
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("accessToken");

  if (!accessToken) {
    return NextResponse.redirect(
      new URL(`/login?from=${encodeURIComponent(path)}`, request.url)
    );
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)"],
};
