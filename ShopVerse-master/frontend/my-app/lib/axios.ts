"use client";
import axios, { InternalAxiosRequestConfig } from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  timeout: 10000,
});

// Token auto attach
API.interceptors.request.use(
  (req: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token && token !== "undefined" && token !== "null") {
        req.headers.Authorization = `Bearer ${token}`;
      }
    }
    return req;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;