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
      Cookie: request.cookies.toString(),
    },
    cache: "no-cache",
  });

  const json = await res.json();
  const response = new NextResponse(JSON.stringify(json), {
    status: res.status,
    statusText: res.statusText,
    headers: {
      ...res.headers,
    },
  });
  return response;
}
