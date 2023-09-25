import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';

const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours
const ENV = process.env.NODE_ENV;
const DOMAIN = process.env.DOMAIN;

export const COOKIE_OPTIONS: Partial<ResponseCookie> = {
  maxAge: COOKIE_MAX_AGE,
  expires: new Date(Date.now() + COOKIE_MAX_AGE * 1000),
  httpOnly: true,
  secure: ENV === 'production',
  domain: DOMAIN,
  path: '/',
  sameSite: 'lax',
};
