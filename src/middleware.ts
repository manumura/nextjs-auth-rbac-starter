import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import setCookie from "set-cookie-parser";
import appConfig from "./config/config";
import { isAdmin } from "./lib/util";

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken");
  const nextResponse = NextResponse.next();
  const redirectHomeResponse = NextResponse.redirect(new URL("/", request.url));
  const redirectLoginResponse = NextResponse.redirect(
    new URL("/login?error=401", request.url),
  );

  // todo TEST
  // if (request.nextUrl.pathname.startsWith("/api")) {
  //   console.log("TEST middleware api", request.nextUrl.pathname);
  // }

  if (isAdminRoute(request)) {
    if (!accessToken) {
      console.error(
        `No access token found (navigating ${request.nextUrl.pathname})`,
      );
      return redirectLoginResponse;
    }

    const user = await fetchUser(request, nextResponse);
    if (!isAdmin(user)) {
      console.error(
        `User is not an admin: ${user?.email} (navigating ${request.nextUrl.pathname})`,
      );
      return redirectHomeResponse;
    }

    return nextResponse;
  }

  // Redirect if user is not authenticated
  if (isProtectedRoute(request) && !accessToken) {
    console.error(
      `No access token found (navigating ${request.nextUrl.pathname})`,
    );
    return redirectLoginResponse;
  }

  // Redirect if user is authenticated
  if (isPublicRoute(request) && accessToken) {
    console.error(`Already logged in (navigating ${request.nextUrl.pathname})`);
    return redirectHomeResponse;
  }

  return nextResponse;
}

async function fetchUser(request: NextRequest, response: NextResponse) {
  const getUserResponse = await doFetchUser(request.cookies.toString());

  if (getUserResponse.ok) {
    const user = await getUserResponse.json();
    return user;
  }

  if (getUserResponse.status === 401) {
    const user = await refreshToken(request, response);
    return user;
  }

  return null;
}

async function refreshToken(request: NextRequest, response: NextResponse) {
  const BASE_URL = appConfig.baseUrl;
  const refreshTokenResponse = await fetch(`${BASE_URL}/api/v1/refresh-token`, {
    method: "POST",
    body: JSON.stringify({}),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Cookie: request.cookies.toString(),
    },
  });

  if (refreshTokenResponse.ok) {
    const data = await refreshTokenResponse.json();
    const setCookieHeader = refreshTokenResponse.headers.get("set-cookie");
    if (setCookieHeader) {
      setAuthCookies(setCookieHeader, response);
    }
    return data.user;
  }

  return null;
}

function setAuthCookies(setCookieHeader: string, response: NextResponse) {
  const splitCookieHeaders = setCookie.splitCookiesString(setCookieHeader);
  const cookies = setCookie.parse(splitCookieHeaders, {
    decodeValues: true,
    map: true,
  });

  const accessTokenCookie = cookies.accessToken;
  setAuthCookie(response, "accessToken", accessTokenCookie);

  const refreshTokenCookie = cookies.refreshToken;
  setAuthCookie(response, "refreshToken", refreshTokenCookie);
}

function setAuthCookie(
  response: NextResponse,
  name: string,
  cookie: setCookie.Cookie,
) {
  response.cookies.set(name, cookie.value, {
    httpOnly: cookie.httpOnly,
    maxAge: cookie.maxAge,
    path: cookie.path,
    expires: cookie.expires,
    sameSite: cookie.sameSite as "lax" | "strict" | "none",
  });
}

async function doFetchUser(cookies: string) {
  const BASE_URL = appConfig.baseUrl;
  return fetch(`${BASE_URL}/api/v1/profile`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookies,
    },
    // cache: "force-cache",
  });
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
  // matcher: "/((?!api|static|.*\\..*|_next).*)",
  matcher: "/((?!static|.*\\..*|_next).*)",
};
