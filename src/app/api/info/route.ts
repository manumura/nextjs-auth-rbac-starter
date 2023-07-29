import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import appConfig from "../../../config/config";

export async function GET(request: Request) {
  const BASE_URL = appConfig.baseUrl;
  const res = await fetch(`${BASE_URL}/api/v1/info`, {
    method: "GET",
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
  return response;
}
