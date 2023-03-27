import { IncomingMessage, ServerResponse } from "http";
import setCookie from "set-cookie-parser";

export const getAuthCookies = (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
) => {
  let cookieString: string;
  
  // Try to get cookies set from the middleware
  const setCookieMiddlewareHeader = res.getHeaders()["set-cookie"] as string[];
  if (setCookieMiddlewareHeader) {
    const cookies = setCookie.parse(setCookieMiddlewareHeader, {
      decodeValues: true,
      map: true,
    });
    const accessTokenCookie = cookies.accessToken;
    const refreshTokenCookie = cookies.refreshToken;
    cookieString = `accessToken=${accessTokenCookie.value}; refreshToken=${refreshTokenCookie.value}`;
  }

  // Default to the cookies from the request
  return cookieString ? cookieString : req.headers.cookie;
};
