import { NextRequest, NextResponse } from 'next/server';
import appConfig from '../../../../../config/config';

export async function GET(request: NextRequest, { params }): Promise<Response> {
  try {
    const BASE_URL = appConfig.baseUrl;
    const token = params.token;

    const res = await fetch(`${BASE_URL}/api/v1/token/${token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-cache',
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
  } catch (error) {
    console.error(error);
    const response = new NextResponse(undefined, {
      status: 500,
      statusText: 'Internal Server Error - GET /token/{token}',
    });
    return response;
  }
}
