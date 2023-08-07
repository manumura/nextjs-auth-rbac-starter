export const sleep = async (ms): Promise<any> => {
  return new Promise((resolve, reject) => setTimeout(resolve, ms));
};

export const isAdmin = (user): boolean => {
  return user && user.role === 'ADMIN';
};

export const getClientBaseUrl = (headers: Headers): string => {
  // const activePath = headersList.get('x-invoke-path');
  // const url = headersList.get('referer');
  const host = headers.get('host');
  const protocol = headers.get('x-forwarded-proto') || 'https';
  return `${protocol}://${host}`;
};
