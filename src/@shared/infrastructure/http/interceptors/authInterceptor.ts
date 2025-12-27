/**
 * Auth Interceptor
 *
 * @layer Shared/Infrastructure
 */

import type { InternalAxiosRequestConfig } from "axios";

export const authInterceptor = {
  onFulfilled: (config: InternalAxiosRequestConfig) => {
    // Add authentication token if available
    const token = localStorage.getItem("authToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },

  onRejected: (error: unknown) => {
    return Promise.reject(error);
  },
};
