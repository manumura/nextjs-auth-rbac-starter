import moment from 'moment';
import { NextRequest, NextResponse } from 'next/server';
// import setCookie from 'set-cookie-parser';
import { appConstant } from '../config/constant';
import { COOKIE_OPTIONS } from '../config/cookie.config';
import { LoginResponse } from '../types/LoginResponse';

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

export const setResponseAuthCookies = (response: NextResponse, login: LoginResponse): void => {
  response.cookies.set(appConstant.ACCESS_TOKEN, login.accessToken, COOKIE_OPTIONS);
  response.cookies.set(appConstant.ACCESS_TOKEN_EXPIRES_AT, moment(login.accessTokenExpiresAt).format(), COOKIE_OPTIONS);
  response.cookies.set(appConstant.REFRESH_TOKEN, login.refreshToken, COOKIE_OPTIONS);
  response.cookies.set(appConstant.ID_TOKEN, login.idToken, COOKIE_OPTIONS);
};

export const setRequestAuthCookies = (request: NextRequest, login: LoginResponse): void => {
  request.cookies.set(appConstant.ACCESS_TOKEN, login.accessToken);
  request.cookies.set(appConstant.ACCESS_TOKEN_EXPIRES_AT, moment(login.accessTokenExpiresAt).format());
  request.cookies.set(appConstant.REFRESH_TOKEN, login.refreshToken);
  request.cookies.set(appConstant.ID_TOKEN, login.idToken);
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
