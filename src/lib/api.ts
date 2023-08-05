import axios from "axios";
import appConfig from "../config/config";
import { LoginResponse } from "../types/LoginResponse";

const BASE_URL = appConfig.baseUrl;
const REFRESH_TOKEN_ENDPOINT = "/v1/refresh-token";

// No interceptor for refresh token
const axiosPublicInstance = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const axiosInstance = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
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
            "Content-Type": "application/json",
            Cookie: config.headers.Cookie,
          },
          withCredentials: true, // for cookies
        },
      );

      // Update cookies
      if (response?.status === 200 && response?.data) {
        const data: LoginResponse = response.data;
        config.headers = {
          ...config.headers,
          Cookie: getCookiesAsString(data),
          "set-cookie": response.headers["set-cookie"],
        };
      }

      // retun config;
      return axiosInstance(config);
    } catch (err) {
      console.error("Axios interceptor error: ", err?.response?.data);
      return Promise.reject(err);
    }
  },
);

const getCookiesAsString = (data: LoginResponse) => {
  return `accessToken=${data.accessToken}; refreshToken=${data.refreshToken}; accessTokenExpiresAt=${data.accessTokenExpiresAt}; idToken=${data.idToken}`;
};

////////////////////////////////////////////////////////////////
// Public APIs
export const login = async (email, password) => {
  return axiosPublicInstance.post("/v1/login", { email, password });
};

export const register = async (email, password, name) => {
  return axiosPublicInstance.post("/v1/register", { email, password, name });
};

export const forgotPassword = async (email) => {
  return axiosPublicInstance.post("/v1/forgot-password", { email });
};

export const resetPassword = async (password, token) => {
  return axiosPublicInstance.post("/v1/new-password", { password, token });
};

////////////////////////////////////////////////////////////////
// Authenticated-only APIs
export const logout = async () => {
  return axiosInstance.post("/v1/logout");
};

export const updateProfile = async (name, password?) => {
  return axiosInstance.put("/v1/profile", {
    name,
    ...(password ? { password } : {}),
  });
};

export const updateProfileImage = async (image) => {
  return axiosInstance.put("/v1/profile/image", image, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const createUser = async (email, name, role) => {
  return axiosInstance.post("/v1/users", { email, name, role });
};

export const updateUser = async (id, name, email, role, password?) => {
  return axiosInstance.put(`/v1/users/${id}`, {
    name,
    email,
    role,
    ...(password ? { password } : {}),
  });
};

export const deleteUser = async (userId) => {
  return axiosInstance.delete(`/v1/users/${userId}`);
};
