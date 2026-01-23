import moment from 'moment';
import { NextResponse } from 'next/server';
// import setCookie from 'set-cookie-parser';
import { RequestCookies, ResponseCookies } from 'next/dist/compiled/@edge-runtime/cookies';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { appConstant } from '../config/constant';
import { COOKIE_OPTIONS } from '../config/cookie.config';
import { LoginResponse } from '../types/custom-types';

const COOKIE_NAMES = [
  appConstant.ACCESS_TOKEN, 
  appConstant.ACCESS_TOKEN_EXPIRES_AT, 
  appConstant.REFRESH_TOKEN, 
  appConstant.ID_TOKEN,
];

export const clearCookies = (response: NextResponse): void => {
  for (const n of COOKIE_NAMES) {
    response.cookies.set(n, '', {
      httpOnly: true,
      maxAge: -1,
    });
  }
};

export const setAuthCookies = (cookies: ResponseCookies | RequestCookies | ReadonlyRequestCookies, login: LoginResponse): void => {
  cookies.set(appConstant.ACCESS_TOKEN, login.accessToken, COOKIE_OPTIONS);
  cookies.set(appConstant.ACCESS_TOKEN_EXPIRES_AT, moment(login.accessTokenExpiresAt).format(), COOKIE_OPTIONS);
  cookies.set(appConstant.REFRESH_TOKEN, login.refreshToken, COOKIE_OPTIONS);
  cookies.set(appConstant.ID_TOKEN, login.idToken, COOKIE_OPTIONS);
};

// Helper to get cookie value by name
export const getCookie = (name: string): string | null => {
  const match = new RegExp(`(^| )${name}=([^;]+)`).exec(document.cookie);
  return match ? decodeURIComponent(match[2]) : null;
};

// export const getCookiesFromSetCookieHeader = () => {
//   const setCookieHeader = headers().get('set-cookie');
//   if (setCookieHeader) {
//     const splitCookieHeaders = setCookie.splitCookiesString(setCookieHeader);
//     const cookies = setCookie.parse(splitCookieHeaders, {
//       decodeValues: true,
//       map: true,
//     });
//   }
// };
