const KEY = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
};

export const saveUser = (user) => {
  window.localStorage.setItem(KEY.USER, JSON.stringify(user));
};

export const getSavedUser = () => {
  const user = JSON.parse(window.localStorage.getItem(KEY.USER));
  return user;
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
