import axios from "axios";

// TODO env config
export const axiosInstance = axios.create({
  baseURL: "http://localhost:9002/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // for cookies
});

export const welcome = async () => {
  return axiosInstance.get("/index");
};

export const login = async (email, password) => {
  return axiosInstance.post("/v1/login", { email, password });
};

export const logout = async () => {
  return axiosInstance.post("/v1/logout");
};

export const register = async (email, password, name) => {
  return axiosInstance.post("/v1/register", { email, password, name });
};

// export const getProfile = async (accessToken) => {
//   return axiosInstance.get("/v1/profile", {
//     headers: {
//       ...headers,
//       Authorization: `Bearer ${accessToken}`,
//     },
//   });
// };

export const getProfile = async () => {
  return axiosInstance.get("/v1/profile");
};

export const getUsers = async (role, page, pageSize, signal) => {
  return axiosInstance.get("/v1/users", { params: { role, page, pageSize }, signal });
};
