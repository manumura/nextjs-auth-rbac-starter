const appConfig: {
  defaultRowsPerPage: number;
  baseUrl: string;
  homeRoute: string;
  publicRoutes: string[];
  protectedRoutes: string[];
  adminRoutes: string[];
  defaultProto: string;
  reCaptchaKey: string;
  idTokenPublicKeyAsBase64: string;
  domain: string;
  nodeEnv: string;
} = {
  defaultRowsPerPage: 5,
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL as string,
  homeRoute : '/',
  publicRoutes: ['/login', '/register', '/forgot-password', '/reset-password'],
  protectedRoutes: ['/profile', '/edit-profile', '/users', '/create-user'],
  adminRoutes: ['/users', '/create-user'],
  defaultProto: process.env.NODE_ENV === 'production' ? 'https' : 'http',
  reCaptchaKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? '',
  idTokenPublicKeyAsBase64: process.env.NEXT_PUBLIC_ID_TOKEN_PUBLIC_KEY_AS_BASE64 as string,
  domain: process.env.DOMAIN ?? '',
  nodeEnv: process.env.NODE_ENV ?? '',
};

export default appConfig;
