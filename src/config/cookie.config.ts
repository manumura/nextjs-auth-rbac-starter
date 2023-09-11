import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';

const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours

export const COOKIE_OPTIONS: Partial<ResponseCookie> = {
  maxAge: COOKIE_MAX_AGE,
  expires: new Date(Date.now() + COOKIE_MAX_AGE * 1000),
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  domain: process.env.NODE_ENV === 'production' ? 'manumura.com' : undefined,
  path: '/',
  sameSite: 'lax',
};
