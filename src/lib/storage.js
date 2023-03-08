const KEY = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
};

export const saveAccessToken = (accessToken) => {
  window.localStorage.setItem(KEY.ACCESS_TOKEN, accessToken);
};

export const getAccessToken = () => {
  const accessToken = window.localStorage.getItem(KEY.ACCESS_TOKEN);
  return accessToken;
};

export const saveRefreshToken = (refreshToken) => {
  window.localStorage.setItem(KEY.REFRESH_TOKEN, refreshToken);
};

export const getRefreshToken = () => {
  const refreshToken = window.localStorage.getItem(KEY.REFRESH_TOKEN);
  return refreshToken;
};

export const clearToken = () => window.localStorage.clear();
