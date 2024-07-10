import { IUser } from "../types/custom-types";
import { getUserFromIdToken } from "./jwt.utils";
import { getSavedIdToken } from "./storage";

export const sleep = async (ms): Promise<any> => {
  return new Promise((resolve, reject) => setTimeout(resolve, ms));
};

export const isAdmin = (user: IUser): boolean => {
  return user && user.role === 'ADMIN';
};

export const getCurrentUserFromStorage = async (): Promise<IUser | null> => {
  const idToken = getSavedIdToken();
  const currentUser = idToken ? await getUserFromIdToken(idToken) : null;
  return currentUser;
};

const defaultProto = process.env.NODE_ENV === 'production' ? 'https' : 'http';

export const getClientBaseUrl = (headers): string => {
  // const activePath = headersList.get('x-invoke-path');
  // const url = headersList.get('referer');
  const host = headers.get('host');
  const protocol = headers.get('x-forwarded-proto') ?? defaultProto;
  return `${protocol}://${host}`;
};
