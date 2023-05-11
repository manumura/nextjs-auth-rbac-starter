import { headers } from "next/headers";
import { axiosInstance } from "../../../lib/api";
import { NextResponse } from "next/server";
import setCookie from "set-cookie-parser";

export async function GET(request: Request) {
  const headersList = headers();
  const cookies = headersList.get("Cookie");

  try {
    const res = await axiosInstance.get("/v1/profile", {
      headers: {
        // Authorization: `bearer ${accessToken}`,
        Cookie: cookies,
      },
      withCredentials: true,
    });

    const h = res.headers;
    const setCookieHeader = h["set-cookie"];
    let responseHeaders = {};
    if (setCookieHeader) {
      responseHeaders = {
        "Set-Cookie": setCookieHeader,
      };
    }
    console.log("TEST2 route Profile", setCookieHeader);

    return new Response(JSON.stringify(res.data), {
      status: res.status,
      headers: responseHeaders,
    });
    // const response = NextResponse.json(
    //   res.data,
    //   { status: res.status }
    // );
    // if (setCookieHeader) {
    //   setAuthCookies(setCookieHeader, response);
    // }
    // return response;
  } catch (err) {
    // console.error(err.response.headers);
    const res = err.response;
    const h = res.headers;
    const setCookieHeader = h["set-cookie"];
    let responseHeaders = {};
    if (setCookieHeader) {
      // console.log("setCookieHeader", setCookieHeader);
      responseHeaders = {
        "Set-Cookie": setCookieHeader,
      };
    }
    return new Response(JSON.stringify({}), {
      status: err.response.status,
      headers: responseHeaders,
    });
    // const response = NextResponse.json(
    //   res.data,
    //   { status: res.status }
    // );
    // if (setCookieHeader) {
    //   setAuthCookies(setCookieHeader, response);
    // }
    // return response;
  }
}

function setAuthCookies(setCookieHeader: string | string[], response: NextResponse) {
  const splitCookieHeaders = setCookie.splitCookiesString(setCookieHeader);
  const cookies = setCookie.parse(splitCookieHeaders, {
    decodeValues: true,
    map: true,
  });

  const accessTokenCookie = cookies.accessToken;
  setAuthCookie(response, "accessToken", accessTokenCookie);

  const refreshTokenCookie = cookies.refreshToken;
  setAuthCookie(response, "refreshToken", refreshTokenCookie);
}

function setAuthCookie(response: NextResponse, name: string, cookie: setCookie.Cookie) {
  response.cookies.set(name, cookie.value, {
    httpOnly: cookie.httpOnly,
    maxAge: cookie.maxAge,
    path: cookie.path,
    expires: cookie.expires,
    sameSite: cookie.sameSite as "lax" | "strict" | "none",
  });
}
