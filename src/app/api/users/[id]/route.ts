import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import appConfig from "../../../../config/config";

export async function GET(request: NextRequest, { params }) {
  const BASE_URL = appConfig.baseUrl;
  const id = params.id;

  const res = await fetch(`${BASE_URL}/api/v1/users/${id}`, {
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

export async function PUT(request: NextRequest, { params }) {
  const BASE_URL = appConfig.baseUrl;
  const id = params.id;
  const body = await request.text();

  const res = await fetch(`${BASE_URL}/api/v1/users/${id}`, {
    method: "PUT",
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

export async function DELETE(request: NextRequest, { params }) {
  const BASE_URL = appConfig.baseUrl;
  const id = params.id;

  const res = await fetch(`${BASE_URL}/api/v1/users/${id}`, {
    method: "DELETE",
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
