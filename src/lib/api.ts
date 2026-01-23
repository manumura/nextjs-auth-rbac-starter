import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { UUID } from 'node:crypto';
import appConfig from '../config/config';
import { appConstant } from '../config/constant';
import {
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
const REFRESH_TOKEN_ENDPOINT = '/v1/refresh-token';

// No interceptor for refresh token
const axiosPublicInstance = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const axiosInstance = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    Expires: '0',
  },
  withCredentials: true, // for cookies
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (!error?.config) {
      throw new Error('Unknown error');
    }

    if (error.response?.status !== 401) {
      console.error('Axios interceptor error: ', error?.response?.data);
      throw error;
    }

    const config = error.config;
    // Avoid infinite loop
    if (config.url?.includes(`${REFRESH_TOKEN_ENDPOINT}`)) {
      throw error;
    }

    try {
      const response = await postRefreshToken();

      // Update cookies
      if (response?.status === 200 && response?.data) {
        config.headers.set('set-cookie', response.headers['set-cookie']);
        console.log('Token refreshed succesfully');
      }

      // Update the CSRF token in the retry request headers
      const newCsrfToken = getCookie(appConstant.CSRF_COOKIE_NAME);
      if (newCsrfToken && config.headers) {
        config.headers['X-CSRF-Token'] = newCsrfToken;
      }

      // retun config;
      return axiosInstance(config);
    } catch (error) {
      const err = error as AxiosError;
      console.error(
        'Axios interceptor unexpected error: ',
        err?.response?.data,
      );
      if (err?.status === 401) {
        useUserStore.getState().setUser(null);
        clearStorage();
      }
      throw err;
    }
  },
);

// Add CSRF token interceptor
axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // Only add for non-GET requests
  if (
    config.method &&
    !['GET', 'HEAD', 'OPTIONS'].includes(config.method.toUpperCase())
  ) {
    const csrfToken = getCookie(appConstant.CSRF_COOKIE_NAME);
    if (csrfToken && config.headers) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }
  }
  return config;
});

////////////////////////////////////////////////////////////////
// Refresh token API
const postRefreshToken = async (): Promise<AxiosResponse<LoginResponse>> => {
  const csrfToken = getCookie(appConstant.CSRF_COOKIE_NAME);
  return await axiosPublicInstance.post(
    REFRESH_TOKEN_ENDPOINT,
    {},
    {
      headers: {
        'X-CSRF-Token': csrfToken,
      },
    },
  );
};

////////////////////////////////////////////////////////////////
// Public APIs
export const info = async (): Promise<AxiosResponse<InfoResponse>> => {
  return axiosPublicInstance.get('/v1/info');
};

export const welcome = async (): Promise<AxiosResponse<MessageResponse>> => {
  return axiosPublicInstance.get('/v1/index');
};

export const login = async (
  email: string,
  password: string,
): Promise<AxiosResponse<LoginResponse>> => {
  return axiosPublicInstance.post('/v1/login', { email, password });
};

export const googleLogin = async (
  token: string,
): Promise<AxiosResponse<LoginResponse>> => {
  return axiosPublicInstance.post('/v1/oauth2/google', { token });
};

export const register = async (
  email: string,
  password: string,
  name: string,
): Promise<AxiosResponse<IUser>> => {
  return axiosPublicInstance.post('/v1/register', { email, password, name });
};

export const forgotPassword = async (
  email: string,
): Promise<AxiosResponse<MessageResponse>> => {
  return axiosPublicInstance.post('/v1/forgot-password', { email });
};

export const resetPassword = async (
  password: string,
  token: string,
): Promise<AxiosResponse<IUser>> => {
  return axiosPublicInstance.post('/v1/new-password', { password, token });
};

export const verifyEmail = async (token: string): Promise<IUser> => {
  return axiosPublicInstance
    .post('/v1/verify-email', { token })
    .then((response) => response.data);
};

export const getUserFromToken = async (
  token: string,
): Promise<AxiosResponse<IUser>> => {
  return axiosPublicInstance.get(`/v1/token/${token}`);
};

export const validateRecaptcha = async (
  token: string,
): Promise<AxiosResponse<boolean>> => {
  return axiosPublicInstance.post('/v1/recaptcha', { token });
};

////////////////////////////////////////////////////////////////
// Authenticated-only APIs
export const logout = async (): Promise<AxiosResponse> => {
  return axiosInstance.post('/v1/logout', {});
};

export const getProfile = async (): Promise<AxiosResponse<IUser>> => {
  return axiosInstance.get('/v1/profile');
};

export const updateProfile = async (
  name: string,
): Promise<AxiosResponse<IUser>> => {
  return axiosInstance.put('/v1/profile', {
    name,
  });
};

export const deleteProfile = async (): Promise<AxiosResponse<IUser>> => {
  return axiosInstance.delete('/v1/profile');
};

export const updatePassword = async (
  oldPassword: string,
  newPassword: string,
): Promise<AxiosResponse<IUser>> => {
  return axiosInstance.put('/v1/profile/password', {
    oldPassword,
    newPassword,
  });
};

export const updateProfileImage = async (
  image: FormData,
  onUploadProgress,
): Promise<AxiosResponse<IUser>> => {
  return axiosInstance.put('/v1/profile/image', image, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });
};

export const getUsers = async (
  page: number | undefined,
  pageSize: number | undefined,
  role: string | undefined,
): Promise<AxiosResponse<IGetUsersResponse>> => {
  const p: string[][] = [];
  if (page) {
    p.push(['page', page.toString()]);
  }
  if (pageSize) {
    p.push(['pageSize', pageSize.toString()]);
  }
  if (role) {
    p.push(['role', role]);
  }

  const params = new URLSearchParams(p);
  return axiosInstance.get(`/v1/users?${params}`);
};

export const getUserByUuid = async (
  uuid: UUID,
): Promise<AxiosResponse<IUser>> => {
  return axiosInstance.get(`/v1/users/${uuid}`);
};

export const createUser = async (
  email: string,
  name: string,
  role: string,
): Promise<AxiosResponse<IUser>> => {
  return axiosInstance.post('/v1/users', { email, name, role });
};

export const updateUser = async (
  uuid: UUID,
  name: string,
  email: string,
  role: string,
  password?: string,
): Promise<AxiosResponse<IUser>> => {
  return axiosInstance.put(`/v1/users/${uuid}`, {
    name,
    email,
    role,
    ...(password ? { password } : {}),
  });
};

export const deleteUser = async (
  userUuid: UUID,
): Promise<AxiosResponse<IUser>> => {
  return axiosInstance.delete(`/v1/users/${userUuid}`);
};
