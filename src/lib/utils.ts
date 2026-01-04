import appConfig from "../config/config";
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

export const getClientBaseUrl = (headers): string => {
  // const activePath = headersList.get('x-invoke-path');
  // const url = headersList.get('referer');
  const host = headers.get('host');
  const protocol = headers.get('x-forwarded-proto') ?? appConfig.defaultProto;
  return `${protocol}://${host}`;
};

export const passwordRules = {
  isLengthValid: {
    regex: /^.{8,70}$/,
    message: 'Password must be minimum 8 and maximum 70 characters long.',
  },
  hasNumber: {
    regex: /\d/,
    message: 'Password must contain at least 1 number.',
  },
  hasLowercaseCharacter: {
    regex: /[a-z]/,
    message: 'Password must contain 1 lowercase letter.',
  },
  hasUppercaseCharacter: {
    regex: /[A-Z]/,
    message: 'Password must contain 1 uppercase letter.',
  },
  hasSpecialCharacter: {
    regex: /[^A-Za-z0-9]/,
    message: 'Password must contain 1 special character.',
  },
};

export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  let isValid: boolean = true;
  for (const [name, rule] of Object.entries(passwordRules)) {
    const valid = rule.regex.test(password);
    if (!valid) {
      isValid = false;
      errors.push(rule.message);
    }
  }

  return { errors, isValid };
}
