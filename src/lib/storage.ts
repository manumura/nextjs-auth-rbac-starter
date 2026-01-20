import { UUID } from "crypto";

const KEY = {
  ACCESS_TOKEN: 'accessToken',
  ACCESS_TOKEN_EXPIRES_AT: 'accessTokenExpiresAt',
  REFRESH_TOKEN: 'refreshToken',
  ID_TOKEN: 'idToken',
  USER_EVENTS: 'userEvents',
};

// Map of user UUID to list of events
export const saveUserEvents = (userEventsMap: Map<UUID, string[]>): void => {
  if (typeof globalThis.window === 'undefined') {
    console.error('window is undefined');
    return;
  }

  globalThis.localStorage.setItem(KEY.USER_EVENTS, JSON.stringify([...userEventsMap]));
};

export const getSavedUserEvents = (): Map<UUID, string[]> => {
  if (typeof globalThis.window === 'undefined') {
    console.error('window is undefined');
    return new Map<UUID, string[]>();
  }
  
  const mapAsString = globalThis.localStorage.getItem(KEY.USER_EVENTS);
  return mapAsString ? new Map(JSON.parse(mapAsString)) : new Map<UUID, string[]>();
};

export const saveIdToken = (idToken): void => {
  if (typeof globalThis.window === 'undefined') {
    console.error('window is undefined');
    return;
  }

  globalThis.localStorage.setItem(KEY.ID_TOKEN, idToken);
};

export const getSavedIdToken = (): string | null => {
  if (typeof globalThis.window === 'undefined') {
    console.error('window is undefined');
    return null;
  }

  return globalThis.localStorage.getItem(KEY.ID_TOKEN);
};

export const saveAccessToken = (accessToken): void => {
  if (typeof globalThis.window === 'undefined') {
    console.error('window is undefined');
    return;
  }

  globalThis.localStorage.setItem(KEY.ACCESS_TOKEN, accessToken);
};

export const getAccessToken = (): string | null => {
  if (typeof globalThis.window === 'undefined') {
    console.error('window is undefined');
    return null;
  }

  const accessToken = globalThis.localStorage.getItem(KEY.ACCESS_TOKEN);
  return accessToken;
};

export const saveAccessTokenExpiresAt = (accessTokenExpiresAt: Date): void => {
  if (typeof globalThis.window === 'undefined') {
    console.error('window is undefined');
    return;
  }

  if (!accessTokenExpiresAt) {
    console.error('accessTokenExpiresAt is undefined');
    return;
  }

  globalThis.localStorage.setItem(
    KEY.ACCESS_TOKEN_EXPIRES_AT,
    accessTokenExpiresAt.toString()
  );
};

export const getAccessTokenExpiresAt = (): Date | null => {
  if (typeof globalThis.window === 'undefined') {
    console.error('window is undefined');
    return null;
  }

  const accessTokenExpiresAt = globalThis.localStorage.getItem(
    KEY.ACCESS_TOKEN_EXPIRES_AT
  );
  return accessTokenExpiresAt ? new Date(accessTokenExpiresAt) : null;
};

export const saveRefreshToken = (refreshToken): void => {
  if (typeof globalThis.window === 'undefined') {
    console.error('window is undefined');
    return;
  }

  globalThis.localStorage.setItem(KEY.REFRESH_TOKEN, refreshToken);
};

export const getRefreshToken = (): string | null => {
  if (typeof globalThis.window === 'undefined') {
    console.error('window is undefined');
    return null;
  }

  const refreshToken = globalThis.localStorage.getItem(KEY.REFRESH_TOKEN);
  return refreshToken;
};

export const saveAuthentication = (
  accessToken: string,
  accessTokenExpiresAt: Date,
  refreshToken: string,
  idToken: string
): void => {
  if (typeof globalThis.window === 'undefined') {
    console.error('window is undefined');
    return;
  }

  saveAccessToken(accessToken);
  saveAccessTokenExpiresAt(accessTokenExpiresAt);
  saveRefreshToken(refreshToken);
  saveIdToken(idToken);
};

export const clearAuthentication = (): void => {
  if (typeof globalThis.window === 'undefined') {
    console.error('window is undefined');
    return;
  }

  globalThis.localStorage.removeItem(KEY.ACCESS_TOKEN);
  globalThis.localStorage.removeItem(KEY.REFRESH_TOKEN);
  globalThis.localStorage.removeItem(KEY.ID_TOKEN);
}

export const clearStorage = (): void => {
  if (typeof globalThis.window === 'undefined') {
    console.error('window is undefined');
    return;
  }

  globalThis.localStorage.clear();
};
