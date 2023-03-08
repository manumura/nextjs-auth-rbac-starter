import axios from "axios";
import { headers } from "../../next.config";

// TODO env config + abort
const axiosInstance = axios.create({
  baseURL: "http://localhost:9002/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const login = async (email, password) => {
  return axiosInstance.post("/v1/login", { email, password });
};

export const welcome = async () => {
  return axiosInstance.get("/index");
};

export const getProfile = async (accessToken) => {
  return axiosInstance.get("/v1/profile", {
    headers: {
      ...headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
