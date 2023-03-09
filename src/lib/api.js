import axios from "axios";

// TODO env config + abort + token
const axiosInstance = axios.create({
  baseURL: "http://localhost:9002/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const welcome = async () => {
  return axiosInstance.get("/index");
};

export const login = async (email, password) => {
  return axiosInstance.post("/v1/login", { email, password });
};

export const register = async (email, password, name) => {
  return axiosInstance.post("/v1/register", { email, password, name });
};

export const getProfile = async (accessToken) => {
  return axiosInstance.get("/v1/profile", {
    headers: {
      ...headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
