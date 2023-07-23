import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import appConfig from "../../../config/config";

export async function GET(request: Request) {
  const BASE_URL = appConfig.baseUrl;
  // const headersList = headers();
  // const cookies = headersList.get("Cookie");

  const res = await fetch(`${BASE_URL}/api/v1/profile`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookies() as any,
    },
  });

  const user = await res.json();
  return NextResponse.json(user);
}
