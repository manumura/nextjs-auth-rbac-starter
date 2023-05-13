import axios from "axios";
import { cookies } from "next/headers";
import appConfig from "../../../config/config";

export async function POST(request: Request) {
  const BASE_URL = appConfig.baseUrl;
  const cookieStore = cookies();

  const res = await axios.post(
    "/v1/logout",
    {},
    {
      baseURL: `${BASE_URL}/api`,
      headers: {
        "Content-Type": "application/json",
        // Authorization: `bearer ${accessToken}`,
        Cookie: cookieStore as any,
      },
      withCredentials: true,
    },
  );

  const headers = res.headers;
  const setCookieHeader = headers["set-cookie"];
  let responseHeaders = {};
  if (setCookieHeader) {
    responseHeaders = {
      'Set-Cookie': setCookieHeader,
    };
  }

  return new Response(JSON.stringify(res.data), {
    status: res.status,
    headers: responseHeaders,
  });
}
