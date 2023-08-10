import { NextResponse } from 'next/server';
import appConfig from '../../../config/config';

export async function GET(request: Request): Promise<Response> {
  try {
    const BASE_URL = appConfig.baseUrl;
    const res = await fetch(`${BASE_URL}/api/v1/index`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const json = await res.json();
    const response = new NextResponse(JSON.stringify(json), {
      status: res.status,
      statusText: res.statusText,
      headers: res.headers,
    });
    return response;
  } catch (error) {
    console.error(error);
    const response = new NextResponse(undefined, {
      status: 500,
      statusText: 'Internal Server Error - GET /welcome',
      
    });
    return response;
  }
}
