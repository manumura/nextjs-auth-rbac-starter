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

  const response = await res.json();
  return NextResponse.json(response);
}
