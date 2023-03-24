const appConfig: {
  defaultRowsPerPage: number;
  baseUrl: string;
} = {
  defaultRowsPerPage: 5,
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL as string,
};

export default appConfig;
