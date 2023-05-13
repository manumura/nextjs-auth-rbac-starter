import { headers } from "next/headers";
import { NextResponse } from "next/server";
import appConfig from "../../../config/config";

export async function GET(request: Request) {
  const BASE_URL = appConfig.baseUrl;
  const headersList = headers();
  const cookies = headersList.get("Cookie");

  let responseHeaders = {};
  let user = {};
  let status = 200;

  const res = await fetch(`${BASE_URL}/api/v1/profile`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookies as any,
    },
  });

  if (res.status === 200) {
    user = await res.json();
  } else if (res.status === 401) {
    status = 401;
    const refreshTokenRes = await refreshToken(cookies);

    if (refreshTokenRes.status === 200) {
      status = 200;
      const data = await refreshTokenRes.json();
      // TODO retry original request
      user = data.user;

      const setCookieHeader = refreshTokenRes.headers.get("set-cookie");
      if (setCookieHeader) {
        responseHeaders = {
          "Set-Cookie": setCookieHeader,
        };
      }
    }
  }

  return NextResponse.json(user, {
    status,
    headers: responseHeaders,
  });
}

async function refreshToken(cookies: string | null) {
  const BASE_URL = appConfig.baseUrl;
  const res = await fetch(`${BASE_URL}/api/v1/refresh-token`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookies as any,
    },
    body: JSON.stringify({}),
  });
  return res;
}
