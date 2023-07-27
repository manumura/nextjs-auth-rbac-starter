import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import appConfig from "../../../config/config";
import { clearCookies } from "../../../lib/cookies";

export async function POST(request: NextRequest) {
  const BASE_URL = appConfig.baseUrl;

  const res = await fetch(`${BASE_URL}/api/v1/logout`, {
    method: "POST",
    body: JSON.stringify({}),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookies() as any,
    },
  });

  const json = await res.json();
  const response = new NextResponse(JSON.stringify(json), {
    status: res.status,
    statusText: res.statusText,
    headers: res.headers,
  });

  clearCookies(response);
  return response;
}
