import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import appConfig from "./config/config";
import { getProfile } from "./lib/api";

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken");

  if (isAdminRoute(request)) {
    if (!accessToken) {
      console.error("No access token found");
      return NextResponse.redirect(new URL("/", request.url));
    }

    const user = await getUser(request);
    if (!user || !isAdmin(user)) {
      console.error(`User is not an admin: ${user.email}`);
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }

  // Redirect if user is not authenticated
  if (isProtectedRoute(request) && !accessToken) {
    console.error("No access token found");
    return NextResponse.redirect(new URL("/login?error=401", request.url));
  }

  // Redirect if user is authenticated
  if (isPublicRoute(request) && accessToken) {
    console.error("Already logged in");
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

async function getUser(request: NextRequest) {
  const BASE_URL = appConfig.baseUrl;
  const res = await fetch(`${BASE_URL}/api/v1/profile`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Cookie: request.cookies.toString(),
    },
    // cache: "force-cache",
  });

  if (res.ok) {
    const user = await res.json();
    return user;
  }

  return null;
}

function isAdmin(user) {
  return user.role === "ADMIN";
}

function isAdminRoute(request: NextRequest) {
  for (const adminRoute of appConfig.adminRoutes) {
    if (request.nextUrl.pathname.startsWith(adminRoute)) {
      return true;
    }
  }
  return false;
}

function isProtectedRoute(request: NextRequest) {
  for (const protectedRoute of appConfig.protectedRoutes) {
    if (request.nextUrl.pathname.startsWith(protectedRoute)) {
      return true;
    }
  }
  return false;
}

function isPublicRoute(request: NextRequest) {
  for (const publicRoute of appConfig.publicRoutes) {
    if (request.nextUrl.pathname.startsWith(publicRoute)) {
      return true;
    }
  }
  return false;
}

// See "Matching Paths" below to learn more
export const config = {
  // matcher solution for public, api, assets and _next exclusion
  matcher: "/((?!api|static|.*\\..*|_next).*)",
};
