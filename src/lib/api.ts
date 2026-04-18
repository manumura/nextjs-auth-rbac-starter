import ky, { HTTPError, type KyInstance } from 'ky';
import { UUID } from 'node:crypto';
import appConfig from '../config/config';
import { appConstant, errorMessages } from '../config/constant';
import {
  ErrorResponse,
  IGetUsersResponse,
  InfoResponse,
  IUser,
  LoginResponse,
  MessageResponse,
} from '../types/custom-types';
import { getCookie } from './cookies.utils.';
import { clearStorage } from './storage';
import useUserStore from './user-store';

const BASE_URL = appConfig.baseUrl;
const REFRESH_TOKEN_ENDPOINT = 'v1/refresh-token';

// No interceptor for refresh token
const httpClientPublicInstance: KyInstance = ky.create({
  prefix: `${BASE_URL}/api/`,
  credentials: 'include',
  retry: 0,
});

export const httpClientInstance: KyInstance = ky.create({
  prefix: `${BASE_URL}/api/`,
  credentials: 'include',
  headers: {
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    Expires: '0',
  },
  retry: {
    limit: 1,
    statusCodes: [401],
    methods: ['get', 'post', 'put', 'delete', 'patch', 'head'],
  },
  hooks: {
    beforeRequest: [
      ({ request }) => {
        if (
          !['GET', 'HEAD', 'OPTIONS'].includes(request.method.toUpperCase())
        ) {
          const csrfToken = getCookie(appConstant.CSRF_COOKIE_NAME);
          if (csrfToken) {
            request.headers.set('X-CSRF-Token', csrfToken);
          }
        }
      },
    ],
    beforeRetry: [
      async ({ request, retryCount }) => {
        console.log(`Request failed with 401, retry attempt ${retryCount}`);
        if (retryCount !== 1) {
          console.error(
            `Unexpected retry count ${retryCount}, expected 1. Not retrying request.`,
          );
          return;
        }

        // Avoid infinite loop on refresh token endpoint
        if (request.url.includes(REFRESH_TOKEN_ENDPOINT)) {
          console.error(
            'Refresh token request failed with 401, logging out user',
          );
          useUserStore.getState().setUser(null);
          clearStorage();
          return;
        }

        try {
          await postRefreshToken();
          console.log(
            'Token successfully refreshed. Retrying original request...',
          );
          const newCsrfToken = getCookie(appConstant.CSRF_COOKIE_NAME);
          // Retry original request with updated CSRF token
          if (newCsrfToken) {
            request.headers.set('X-CSRF-Token', newCsrfToken);
          }
          console.log(
            'Retrying original request after token refresh:',
            request.method,
            request.url,
          );
        } catch (error) {
          const err = error as HTTPError;
          console.error('beforeRetry hook error:', err);
          if (err?.response?.status === 401) {
            useUserStore.getState().setUser(null);
            clearStorage();
          }
          const data = err?.data as ErrorResponse | undefined;
          const message =
            data?.message === errorMessages.INVALID_REFRESH_TOKEN.code
              ? errorMessages.INVALID_REFRESH_TOKEN.text
              : data?.message;
          throw new Error(message, { cause: err });
        }
      },
    ],
  },
});

////////////////////////////////////////////////////////////////
// Refresh token API
const postRefreshToken = (): Promise<LoginResponse> => {
  const csrfToken = getCookie(appConstant.CSRF_COOKIE_NAME);
  return httpClientPublicInstance
    .post(REFRESH_TOKEN_ENDPOINT, {
      json: {},
      headers: { 'X-CSRF-Token': csrfToken ?? '' },
    })
    .json<LoginResponse>();
};

////////////////////////////////////////////////////////////////
// Public APIs
export const info = async (): Promise<InfoResponse> => {
  return httpClientPublicInstance.get('v1/info').json<InfoResponse>();
};

export const welcome = async (): Promise<MessageResponse> => {
  return httpClientPublicInstance.get('v1/index').json<MessageResponse>();
};

export const login = async (
  email: string,
  password: string,
): Promise<LoginResponse> => {
  return httpClientPublicInstance
    .post('v1/login', { json: { email, password } })
    .json<LoginResponse>();
};

export const googleLogin = async (token: string): Promise<LoginResponse> => {
  return httpClientPublicInstance
    .post('v1/oauth2/google', { json: { token } })
    .json<LoginResponse>();
};

export const register = async (
  email: string,
  password: string,
  name: string,
): Promise<IUser> => {
  return httpClientPublicInstance
    .post('v1/register', { json: { email, password, name } })
    .json<IUser>();
};

export const forgotPassword = async (
  email: string,
): Promise<MessageResponse> => {
  return httpClientPublicInstance
    .post('v1/forgot-password', { json: { email } })
    .json<MessageResponse>();
};

export const resetPassword = async (
  password: string,
  token: string,
): Promise<IUser> => {
  return httpClientPublicInstance
    .post('v1/new-password', { json: { password, token } })
    .json<IUser>();
};

export const verifyEmail = async (token: string): Promise<IUser> => {
  return httpClientPublicInstance
    .post('v1/verify-email', { json: { token } })
    .json<IUser>();
};

export const getUserFromToken = async (token: string): Promise<IUser> => {
  return httpClientPublicInstance.get(`v1/token/${token}`).json<IUser>();
};

export const validateRecaptcha = async (token: string): Promise<boolean> => {
  return httpClientPublicInstance
    .post('v1/recaptcha', { json: { token } })
    .json<boolean>();
};

////////////////////////////////////////////////////////////////
// Authenticated-only APIs
export const logout = async (): Promise<void> => {
  await httpClientInstance.post('v1/logout', { json: {} });
};

export const getProfile = async (): Promise<IUser> => {
  return httpClientInstance.get('v1/profile').json<IUser>();
};

export const updateProfile = async (name: string): Promise<IUser> => {
  return httpClientInstance.put('v1/profile', { json: { name } }).json<IUser>();
};

export const deleteProfile = async (): Promise<IUser> => {
  return httpClientInstance.delete('v1/profile').json<IUser>();
};

export const updatePassword = async (
  oldPassword: string,
  newPassword: string,
): Promise<IUser> => {
  return httpClientInstance
    .put('v1/profile/password', { json: { oldPassword, newPassword } })
    .json<IUser>();
};

export const updateProfileImage = async (image: FormData): Promise<IUser> => {
  return httpClientInstance
    .put('v1/profile/image', { body: image })
    .json<IUser>();
};

export const getUsers = async (
  page: number | undefined,
  pageSize: number | undefined,
  role: string | undefined,
): Promise<IGetUsersResponse> => {
  const p: string[][] = [];
  if (page) p.push(['page', page.toString()]);
  if (pageSize) p.push(['pageSize', pageSize.toString()]);
  if (role) p.push(['role', role]);
  const params = new URLSearchParams(p);
  return httpClientInstance.get(`v1/users?${params}`).json<IGetUsersResponse>();
};

export const getUserByUuid = async (uuid: UUID): Promise<IUser> => {
  return httpClientInstance.get(`v1/users/${uuid}`).json<IUser>();
};

export const createUser = async (
  email: string,
  name: string,
  role: string,
): Promise<IUser> => {
  return httpClientInstance
    .post('v1/users', { json: { email, name, role } })
    .json<IUser>();
};

export const updateUser = async (
  uuid: UUID,
  name: string,
  email: string,
  role: string,
  password?: string,
): Promise<IUser> => {
  return httpClientInstance
    .put(`v1/users/${uuid}`, {
      json: { name, email, role, ...(password ? { password } : {}) },
    })
    .json<IUser>();
};

export const deleteUser = async (userUuid: UUID): Promise<IUser> => {
  return httpClientInstance.delete(`v1/users/${userUuid}`).json<IUser>();
};
