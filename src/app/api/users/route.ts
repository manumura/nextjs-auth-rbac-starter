import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import appConfig from "../../../config/config";

export async function GET(request: NextRequest) {
  const BASE_URL = appConfig.baseUrl;
  const params = request.nextUrl.searchParams;

  const res = await fetch(`${BASE_URL}/api/v1/users?` + params, {
    method: "GET",
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
  return response;
}

export async function POST(request: NextRequest) {
  const BASE_URL = appConfig.baseUrl;
  const body = await request.text();

  const res = await fetch(`${BASE_URL}/api/v1/users`, {
    method: "POST",
    body,
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
  return response;
}
