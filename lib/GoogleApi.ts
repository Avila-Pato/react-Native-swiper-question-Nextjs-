import axios from "axios";

export const googleApi = axios.create({
  baseURL: "https://www.googleapis.com",
  timeout: 10000,
});

googleApi.interceptors.response.use(
  (res) => res,
  (err) => {
    console.log("[googleApi error]", err?.response?.status, err?.message);
    return Promise.reject(err);
  }
);
