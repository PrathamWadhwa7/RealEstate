// import axios from "axios";

// const instance = axios.create({
//   baseURL: "http://localhost:5000/api", // Change as needed
// });

// instance.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) config.headers.Authorization = `${token}`;
//   return config;
// });
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // match your backend
});

axiosInstance.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = token; // no Bearer
  }
  return req;
});

export default axiosInstance;
