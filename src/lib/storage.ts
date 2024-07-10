import { UUID } from "crypto";

const KEY = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  ID_TOKEN: 'idToken',
  USER_EVENTS: 'userEvents',
};

// Map of user UUID to list of events
export const saveUserEvents = (userEventsMap: Map<UUID, string[]>): void => {
  if (typeof window === 'undefined') {
    console.error('window is undefined');
    return;
  }

  window.localStorage.setItem(KEY.USER_EVENTS, JSON.stringify([...userEventsMap]));
};

export const getSavedUserEvents = (): Map<UUID, string[]> => {
  if (typeof window === 'undefined') {
    console.error('window is undefined');
    return new Map<UUID, string[]>();
  }
  
  const mapAsString = window.localStorage.getItem(KEY.USER_EVENTS);
  return mapAsString ? new Map(JSON.parse(mapAsString)) : new Map<UUID, string[]>();
};

export const saveIdToken = (idToken): void => {
  if (typeof window === 'undefined') {
    console.error('window is undefined');
    return;
  }

  window.localStorage.setItem(KEY.ID_TOKEN, idToken);
};

export const getSavedIdToken = (): string | null => {
  if (typeof window === 'undefined') {
    console.error('window is undefined');
    return null;
  }

  return window.localStorage.getItem(KEY.ID_TOKEN);
};

export const saveAccessToken = (accessToken): void => {
  if (typeof window === 'undefined') {
    console.error('window is undefined');
    return;
  }

  window.localStorage.setItem(KEY.ACCESS_TOKEN, accessToken);
};

export const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') {
    console.error('window is undefined');
    return null;
  }

  const accessToken = window.localStorage.getItem(KEY.ACCESS_TOKEN);
  return accessToken;
};

export const saveRefreshToken = (refreshToken): void => {
  if (typeof window === 'undefined') {
    console.error('window is undefined');
    return;
  }

  window.localStorage.setItem(KEY.REFRESH_TOKEN, refreshToken);
};

export const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') {
    console.error('window is undefined');
    return null;
  }

  const refreshToken = window.localStorage.getItem(KEY.REFRESH_TOKEN);
  return refreshToken;
};

export const saveAuthentication = (accessToken: string, refreshToken: string, idToken: string): void => {
  if (typeof window === 'undefined') {
    console.error('window is undefined');
    return;
  }

  saveAccessToken(accessToken);
  saveRefreshToken(refreshToken);
  saveIdToken(idToken);
};

export const clearAuthentication = (): void => {
  if (typeof window === 'undefined') {
    console.error('window is undefined');
    return;
  }

  window.localStorage.removeItem(KEY.ACCESS_TOKEN);
  window.localStorage.removeItem(KEY.REFRESH_TOKEN);
  window.localStorage.removeItem(KEY.ID_TOKEN);
}

export const clearStorage = (): void => {
  if (typeof window === 'undefined') {
    console.error('window is undefined');
    return;
  }

  window.localStorage.clear();
};
