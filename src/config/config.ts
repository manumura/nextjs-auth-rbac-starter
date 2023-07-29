const idTokenPublicKeyAsBase64 = process.env.NEXT_PUBLIC_ID_TOKEN_PUBLIC_KEY_AS_BASE64 as string;

const appConfig: {
  defaultRowsPerPage: number;
  baseUrl: string;
  idTokenPublicKey: string;
  publicRoutes: string[];
  protectedRoutes: string[];
  adminRoutes: string[];
} = {
  defaultRowsPerPage: 5,
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL as string,
  idTokenPublicKey: Buffer.from(idTokenPublicKeyAsBase64, 'base64').toString('utf8'),
  publicRoutes: ['/login', '/register', '/forgot-password', '/reset-password'],
  protectedRoutes: ['/profile', '/edit-profile', '/users', '/create-user'],
  adminRoutes: ['/users', '/create-user'],
};

export default appConfig;
