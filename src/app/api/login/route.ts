import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import appConfig from "../../../config/config";
import { setAuthCookies } from "../../../lib/cookies";

export async function POST(request: NextRequest) {
  const BASE_URL = appConfig.baseUrl;
  const body = await request.text() ;

  const res = await fetch(`${BASE_URL}/api/v1/login`, {
    method: "POST",
    body,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookies() as any,
    },
  });

  if (!res.ok) {
    return new NextResponse(null, {
      status: res.status,
    });
  }

  const login = await res.json();
  const response = new NextResponse(JSON.stringify(login), {
    status: res.status,
  });
  
  setAuthCookies(response, login);
  return response;
}
