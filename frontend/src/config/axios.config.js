import Axios from "axios";
import { test, url } from "./config";

const axios = Axios.create({
  baseURL: process.env.NODE_ENV === "production" ? test : test,
});

axios.interceptors.request.use(
  (config) => {
    config.headers["Content-Type"] = "application/json";

    return config;
  },
  (error) => Promise.reject(error)
);

export default axios;
