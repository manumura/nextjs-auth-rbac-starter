const KEY = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  ID_TOKEN: 'idToken',
};

export const saveIdToken = (idToken): void => {
  window.localStorage.setItem(KEY.ID_TOKEN, idToken);
};

export const getSavedIdToken = (): string | null => {
  return window.localStorage.getItem(KEY.ID_TOKEN);
};

export const saveAccessToken = (accessToken): void => {
  window.localStorage.setItem(KEY.ACCESS_TOKEN, accessToken);
};

export const getAccessToken = (): string | null => {
  const accessToken = window.localStorage.getItem(KEY.ACCESS_TOKEN);
  return accessToken;
};

export const saveRefreshToken = (refreshToken): void => {
  window.localStorage.setItem(KEY.REFRESH_TOKEN, refreshToken);
};

export const getRefreshToken = (): string | null => {
  const refreshToken = window.localStorage.getItem(KEY.REFRESH_TOKEN);
  return refreshToken;
};

export const clearStorage = (): void => window.localStorage.clear();
