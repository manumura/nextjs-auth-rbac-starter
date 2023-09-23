const appConfig: {
  defaultRowsPerPage: number;
  baseUrl: string;
  homeRoute: string;
  publicRoutes: string[];
  protectedRoutes: string[];
  adminRoutes: string[];
} = {
  defaultRowsPerPage: 5,
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL as string,
  homeRoute : '/',
  publicRoutes: ['/login', '/register', '/forgot-password', '/reset-password'],
  protectedRoutes: ['/profile', '/edit-profile', '/users', '/create-user'],
  adminRoutes: ['/users', '/create-user'],
};

export default appConfig;
