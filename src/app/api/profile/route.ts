import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import appConfig from '../../../config/config';

export async function GET(request: NextRequest): Promise<Response> {
  const BASE_URL = appConfig.baseUrl;

  const res = await fetch(`${BASE_URL}/api/v1/profile`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
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
