import moment from "moment";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import appConfig from "./config/config";
import {
  clearCookies,
  setRequestAuthCookies,
  setResponseAuthCookies,
} from "./lib/cookies.utils.";
import { getUserFromIdToken } from "./lib/jwt.utils";
import { isAdmin } from "./lib/utils";

export async function middleware(request: NextRequest) {
  const accessTokenCookie = request.cookies.get("accessToken");
  const idTokenCookie = request.cookies.get("idToken");
  const accessTokenExpiresAtCookie = request.cookies.get(
    "accessTokenExpiresAt",
  );
  const nextResponse = NextResponse.next();
  const redirectHomeResponse = NextResponse.redirect(new URL("/", request.url));
  const redirectLoginResponse = NextResponse.redirect(
    new URL("/login?error=401", request.url),
  );

  // Refresh token if expired
  if (!isPublicRoute(request)) {
    const accessTokenExpiresAt = moment(
      accessTokenExpiresAtCookie?.value,
    ).utc();
    const now = moment().utc();

    // Check validity of token
    if (accessTokenExpiresAt.isBefore(now)) {
      console.log("Middleware: access token is expired");
      const response = await refreshToken(request);
      return response;
    }
  }

  if (isAdminRoute(request)) {
    if (!accessTokenCookie || !accessTokenCookie.value) {
      console.error(
        `No access token found (navigating ${request.nextUrl.pathname})`,
      );
      return redirectLoginResponse;
    }

    if (!idTokenCookie || !idTokenCookie.value) {
      console.error(
        `No idToken found (navigating ${request.nextUrl.pathname})`,
      );
      return redirectLoginResponse;
    }

    const user = await getUserFromIdToken(idTokenCookie?.value as string);
    // const user = await fetchUser(request, nextResponse);
    if (!isAdmin(user)) {
      console.error(
        `User is not an admin: ${user?.email} (navigating ${request.nextUrl.pathname})`,
      );
      return redirectHomeResponse;
    }

    return nextResponse;
  }

  // Redirect if user is not authenticated
  if (isProtectedRoute(request) && !accessTokenCookie) {
    console.error(
      `No access token found (navigating ${request.nextUrl.pathname})`,
    );
    return redirectLoginResponse;
  }

  // Redirect if user is authenticated
  if (isPublicRoute(request) && accessTokenCookie) {
    console.error(`Already logged in (navigating ${request.nextUrl.pathname})`);
    return redirectHomeResponse;
  }

  return nextResponse;
}

async function refreshToken(request: NextRequest): Promise<NextResponse> {
  try {
    const BASE_URL = appConfig.baseUrl;
    const res = await fetch(`${BASE_URL}/api/v1/refresh-token`, {
      method: "POST",
      body: JSON.stringify({}),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: request.cookies.toString(),
      },
    });

    const json = await res.json();
    const nextResponse = NextResponse.next();

    if (res.ok) {
      // const requestHeaders = new Headers(request.headers);
      // requestHeaders.set('x-new-access-token', json.accessToken);
      // const nextResponse = NextResponse.next({
      //   request: {
      //       headers: requestHeaders,
      //   },
      // });
      setResponseAuthCookies(nextResponse, json);
      setRequestAuthCookies(request, json);
    } else {
      clearCookies(nextResponse);
    }
    
    return nextResponse;
  } catch (err) {
    console.error("Error refreshing token: ", err);
    const nextResponse = NextResponse.next();
    clearCookies(nextResponse);
    return nextResponse;
  }
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

function isAPIRoute(request: NextRequest) {
  return request.nextUrl.pathname.startsWith("/api");
}

// See "Matching Paths" below to learn more
export const config = {
  // matcher solution for public, api, assets and _next exclusion
  matcher: "/((?!api|static|.*\\..*|_next).*)",
  // matcher: "/((?!static|.*\\..*|_next).*)",
};
