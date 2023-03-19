import axios from "axios";

const REFRESH_TOKEN_ENDPOINT = "/v1/refresh-token";

// TODO env config
export const axiosInstance = axios.create({
  baseURL: "http://localhost:9002/api",
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
      const url = `${REFRESH_TOKEN_ENDPOINT}`;
      const response = await axios.post(
        url,
        {},
        {
          // TODO env config
          baseURL: "http://localhost:9002/api",
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
  return axiosInstance.get("/index");
};

export const login = async (email, password) => {
  return axiosInstance.post("/v1/login", { email, password });
};

export const register = async (email, password, name) => {
  return axiosInstance.post("/v1/register", { email, password, name });
};

////////////////////////////////////////////////////////////////
// Authenticated-only APIs
export const logout = async () => {
  return axiosInstance.post("/v1/logout");
};

export const getProfile = async () => {
  return axiosInstance.get("/v1/profile");
};

export const updateProfile = async (password?, name?) => {
  return axiosInstance.put("/v1/profile", {
    ...(password ? { password } : {}),
    ...(name ? { name } : {}),
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

export const deleteUser = async (userId) => {
  return axiosInstance.delete(`/v1/users/${userId}`);
};
