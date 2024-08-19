import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import appConfig from './config';

const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours

export const COOKIE_OPTIONS: Partial<ResponseCookie> = {
  maxAge: COOKIE_MAX_AGE,
  expires: new Date(Date.now() + COOKIE_MAX_AGE * 1000),
  httpOnly: true,
  secure: appConfig.nodeEnv === 'production',
  domain: appConfig.domain,
  path: '/',
  sameSite: 'lax',
};
