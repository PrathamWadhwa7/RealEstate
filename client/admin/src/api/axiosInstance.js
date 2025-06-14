import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api", // Change as needed
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `${token}`;
  return config;
});

export default instance;
