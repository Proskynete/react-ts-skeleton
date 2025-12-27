/**
 * HTTP Client (Axios instance)
 *
 * @layer Shared/Infrastructure
 */

import axios, { type AxiosInstance } from "axios";
import { env } from "../config/environment";
import { authInterceptor } from "./interceptors/authInterceptor";
import { errorInterceptor } from "./interceptors/errorInterceptor";
import { loggingInterceptor } from "./interceptors/loggingInterceptor";

export const httpClient: AxiosInstance = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  timeout: env.VITE_API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptors
httpClient.interceptors.request.use(
  authInterceptor.onFulfilled,
  authInterceptor.onRejected
);

httpClient.interceptors.request.use(
  loggingInterceptor.onRequest,
  loggingInterceptor.onRequestError
);

// Response interceptors
httpClient.interceptors.response.use(
  loggingInterceptor.onResponse,
  loggingInterceptor.onResponseError
);

httpClient.interceptors.response.use(
  (response) => response,
  errorInterceptor.onRejected
);
