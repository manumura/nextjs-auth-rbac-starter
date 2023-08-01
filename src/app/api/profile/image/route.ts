import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import appConfig from "../../../../config/config";

export async function PUT(request: NextRequest) {
  const BASE_URL = appConfig.baseUrl;
  const formData = await request.formData();

  const res = await fetch(`${BASE_URL}/api/v1/profile/image`, {
    method: "PUT",
    body: formData,
    credentials: "include",
    headers: {
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
