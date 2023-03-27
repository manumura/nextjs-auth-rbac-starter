import axios from "axios";
import appConfig from "../config/config";

const BASE_URL = appConfig.baseUrl;
const REFRESH_TOKEN_ENDPOINT = "/v1/refresh-token";

// No interceptor for refresh token
const axiosPublicInstance = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // for cookies
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
      if (response && response.status === 200 && response.data) {
        const data = response?.data;
        config.headers = {
          ...config.headers,
          Cookie: `accessToken=${data.accessToken}; refreshToken=${data.refreshToken}`,
          "set-cookie": response.headers["set-cookie"],
        };
      }

      return axiosInstance(config);
    } catch (err) {
      console.error("Axios interceptor error: ", err?.response?.data);
      return Promise.reject(err);
    }
  },
);

export const welcome = async () => {
  return axiosPublicInstance.get("/index");
};

export const info = async () => {
  return axiosPublicInstance.get("/v1/info");
};

export const login = async (email, password) => {
  return axiosPublicInstance.post("/v1/login", { email, password });
};

export const register = async (email, password, name) => {
  return axiosPublicInstance.post("/v1/register", { email, password, name });
};

export const forgotPassword = async (email) => {
  return axiosPublicInstance.post("/v1/forgot-password", { email });
};

export const getUserByToken = async (token) => {
  return axiosPublicInstance.get(`/v1/token/${token}`);
};

export const resetPassword = async (password, token) => {
  return axiosPublicInstance.post("/v1/new-password", { password, token });
};

////////////////////////////////////////////////////////////////
// Authenticated-only APIs
export const logout = async () => {
  return axiosInstance.post("/v1/logout");
};

export const getProfile = async (signal?) => {
  return axiosInstance.get("/v1/profile", { signal });
};

export const updateProfile = async (name, password?) => {
  return axiosInstance.put("/v1/profile", {
    name,
    ...(password ? { password } : {}),
  });
};

export const getUsers = async (role, page, pageSize, signal) => {
  return axiosInstance.get("/v1/users", {
    params: { role, page, pageSize },
    signal,
  });
};

export const getUser = async (id, signal) => {
  return axiosInstance.get(`/v1/users/${id}`, {
    signal,
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
