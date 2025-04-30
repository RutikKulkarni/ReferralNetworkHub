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

function matchRoute(requestPath: string, routePattern: string): boolean {
  const dynamicRouteRegex = routePattern
    .replace(/\[\w+\]/g, "[^/]+")
    .replace(/\//g, "\\/");
  const regex = new RegExp(`^${dynamicRouteRegex}$`);
  return regex.test(requestPath);
}

function isRouteAccessibleToRole(path: string, role: string | null): boolean {
  if (routePermissions.public.some((route) => matchRoute(path, route))) {
    return true;
  }
  if (!role) {
    return false;
  }
  switch (role) {
    case "admin":
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
  const path = request.nextUrl.pathname;

  if (
    path.startsWith("/_next") ||
    path.startsWith("/api") ||
    path.startsWith("/static") ||
    path.includes(".")
  ) {
    return NextResponse.next();
  }

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

  if (!isRouteAccessibleToRole(path, role)) {
    if (
      !role &&
      !routePermissions.public.some((route) => matchRoute(path, route))
    ) {
      const url = new URL("/login", request.url);
      url.searchParams.set("from", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.rewrite(new URL("/404", request.url));
  }

  if (path === "/login" && role) {
    const from = request.nextUrl.searchParams.get("from") || "/profile";
    return NextResponse.redirect(
      new URL(decodeURIComponent(from), request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)"],
};
