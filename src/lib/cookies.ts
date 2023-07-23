import moment from "moment";
import { NextResponse } from "next/server";
import { appConstant } from "../config/constant";
import { COOKIE_OPTIONS } from "../config/cookie.config";
import { LoginResponse } from "../types/LoginResponse";

const COOKIE_NAMES = [
  appConstant.ACCESS_TOKEN, 
  appConstant.ACCESS_TOKEN_EXPIRES_AT, 
  appConstant.REFRESH_TOKEN, 
  appConstant.ID_TOKEN,
];

export const clearCookies = (response: NextResponse) => {
  for (const n of COOKIE_NAMES) {
    response.cookies.set(n, "", {
      httpOnly: true,
      maxAge: -1,
    });
  }
};

export const setAuthCookies = (response: NextResponse, login: LoginResponse) => {
  response.cookies.set(appConstant.ACCESS_TOKEN, login.accessToken, COOKIE_OPTIONS);
  response.cookies.set(appConstant.ACCESS_TOKEN_EXPIRES_AT, moment(login.accessTokenExpiresAt).format(), COOKIE_OPTIONS);
  response.cookies.set(appConstant.REFRESH_TOKEN, login.refreshToken, COOKIE_OPTIONS);
  response.cookies.set(appConstant.ID_TOKEN, login.idToken, COOKIE_OPTIONS);
};
