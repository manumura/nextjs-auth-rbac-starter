import { NextRequest, NextResponse } from "next/server";
import appConfig from "../../../../config/config";

export async function GET(request: NextRequest, { params }) {
  const BASE_URL = appConfig.baseUrl;
  const token = params.token;

  const res = await fetch(`${BASE_URL}/api/v1/token/${token}`, {
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
