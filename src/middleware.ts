import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import appConfig from "./config/config";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken");
  // Redirect if user is not authenticated
  if (isProtectedRoute(request) && !accessToken) {
    return NextResponse.redirect(new URL("/login?error=401", request.url));
  }

  // Redirect if user is authenticated
  if (isPublicRoute(request) && accessToken) {
    return NextResponse.redirect(new URL("/", request.url));
  } else {
    return NextResponse.next();
  }
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
