import { NextRequest, NextResponse } from "next/server";
import appConfig from "../../../config/config";
import { setResponseAuthCookies } from "../../../lib/cookies.utils.";

export async function POST(request: NextRequest) {
  const BASE_URL = appConfig.baseUrl;
  const body = await request.text() ;

  const res = await fetch(`${BASE_URL}/api/v1/login`, {
    method: "POST",
    body,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json = await res.json();
  const response = new NextResponse(JSON.stringify(json), {
    status: res.status,
    statusText: res.statusText,
    headers: res.headers,
  });

  setResponseAuthCookies(response, json);
  return response;
}
