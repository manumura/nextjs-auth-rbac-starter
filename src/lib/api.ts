import axios, { AxiosResponse } from 'axios';
import appConfig from '../config/config';
import { IUser } from './user-store';
import { UUID } from 'node:crypto';

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
  },
  withCredentials: true, // for cookies
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    if (error.response.status !== 401) {
      return Promise.reject(error);
    }

    // Avoid infinite loop
    if (config.url.includes(`${REFRESH_TOKEN_ENDPOINT}`)) {
      return Promise.reject(error);
    }

    try {
      const response = await axios.post(
        REFRESH_TOKEN_ENDPOINT,
        {},
        {
          baseURL: `${BASE_URL}/api`,
          headers: {
            'Content-Type': 'application/json',
            Cookie: config.headers.Cookie,
          },
          withCredentials: true, // for cookies
        },
      );

      // Update cookies
      if (response?.status === 200 && response?.data) {
        // const data: LoginResponse = response.data;
        config.headers = {
          ...config.headers,
        //   Cookie: getCookiesAsString(data),
          'set-cookie': response.headers['set-cookie'],
        };
      }

      // retun config;
      return axiosInstance(config);
    } catch (err) {
      console.error('Axios interceptor error: ', err?.response?.data);
      return Promise.reject(err);
    }
  },
);

// const getCookiesAsString = (data: LoginResponse) => {
//   return `accessToken=${data.accessToken}; refreshToken=${data.refreshToken}; accessTokenExpiresAt=${data.accessTokenExpiresAt}; idToken=${data.idToken}`;
// };

////////////////////////////////////////////////////////////////
// Public APIs
type InfoResponse = {
  env: string;
  userAgent: string;
  ip: string;
};

type MessageResponse = {
  message: string;
};

export const info = async (): Promise<AxiosResponse<InfoResponse>> => {
  return axiosPublicInstance.get('/v1/info');
};

export const welcome = async (): Promise<AxiosResponse<MessageResponse>> => {
  return axiosPublicInstance.get('/v1/index');
};

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: number;
  idToken: string;
};

export const login = async (email: string, password: string): Promise<AxiosResponse<LoginResponse>> => {
  return axiosPublicInstance.post('/v1/login', { email, password });
};

export const register = async (email: string, password: string, name: string): Promise<AxiosResponse<IUser>> => {
  return axiosPublicInstance.post('/v1/register', { email, password, name });
};

export const forgotPassword = async (email: string): Promise<AxiosResponse<MessageResponse>> => {
  return axiosPublicInstance.post('/v1/forgot-password', { email });
};

export const resetPassword = async (password: string, token: string): Promise<AxiosResponse<IUser>> => {
  return axiosPublicInstance.post('/v1/new-password', { password, token });
};

export const getUserFromToken = async (token: string): Promise<AxiosResponse<IUser>> => {
  return axiosPublicInstance.get(`/v1/token/${token}`);
};

////////////////////////////////////////////////////////////////
// Authenticated-only APIs
export const logout = async (): Promise<AxiosResponse> => {
  return axiosInstance.post('/v1/logout');
};

export const getProfile = async (): Promise<AxiosResponse<IUser>> => {
  return axiosInstance.get('/v1/profile');
};

export const updateProfile = async (name: string): Promise<AxiosResponse<IUser>> => {
  return axiosInstance.put('/v1/profile', {
    name,
  });
};

export const updatePassword = async (oldPassword: string, newPassword: string): Promise<AxiosResponse<IUser>> => {
  return axiosInstance.put('/v1/profile/password', {
    oldPassword,
    newPassword,
  });
};

export const updateProfileImage = async (image: FormData, onUploadProgress): Promise<AxiosResponse<IUser>> => {
  return axiosInstance.put('/v1/profile/image', image, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });
};

export const getUserByUuid = async (uuid: UUID): Promise<AxiosResponse<IUser>> => {
  return axiosInstance.get(`/v1/users/${uuid}`);
};

export const createUser = async (email: string, name: string, role: string): Promise<AxiosResponse<IUser>> => {
  return axiosInstance.post('/v1/users', { email, name, role });
};

export const updateUser = async (uuid: UUID, name: string, email: string, role: string, password?: string): Promise<AxiosResponse<IUser>> => {
  return axiosInstance.put(`/v1/users/${uuid}`, {
    name,
    email,
    role,
    ...(password ? { password } : {}),
  });
};

export const deleteUser = async (userUuid: UUID): Promise<AxiosResponse<IUser>> => {
  return axiosInstance.delete(`/v1/users/${userUuid}`);
};
