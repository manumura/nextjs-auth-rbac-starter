import axios from "axios";

const axiosInstance = axios.create({
  baseURL: 'http://localhost:9002/api',
  headers: {
    "Content-Type": "application/json",
  },
});

export const login = async (email, password) => {
  return axiosInstance.post(`/v1/login`, { email, password });
};
