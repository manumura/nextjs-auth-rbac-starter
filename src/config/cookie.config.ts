import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

const COOKIE_MAX_AGE = 60 * 60 * 8; // 8 hours

export const COOKIE_OPTIONS: Partial<ResponseCookie> = {
  maxAge: COOKIE_MAX_AGE,
  expires: new Date(Date.now() + COOKIE_MAX_AGE * 1000),
  httpOnly: true,
  // TODO: enable secure cookie when https is enabled
  // secure: true,
  path: '/',
  sameSite: 'lax',
};
