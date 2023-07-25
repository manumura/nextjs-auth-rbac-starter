import { NextRequest, NextResponse } from "next/server";
import appConfig from "../../../config/config";

export async function POST(request: NextRequest) {
  const BASE_URL = appConfig.baseUrl;
  const body = await request.text() ;

  const res = await fetch(`${BASE_URL}/api/v1/new-password`, {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    return new NextResponse(null, {
      status: res.status,
    });
  }

  const newPassword = await res.json();
  const response = new NextResponse(JSON.stringify(newPassword), {
    status: res.status,
  });
  
  return response;
}
