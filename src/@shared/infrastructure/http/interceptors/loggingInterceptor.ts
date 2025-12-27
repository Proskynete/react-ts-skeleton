/**
 * Logging Interceptor
 *
 * @layer Shared/Infrastructure
 */

import type { InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { logger } from "../../observability/logger/Logger";

export const loggingInterceptor = {
  onRequest: (config: InternalAxiosRequestConfig) => {
    logger.debug("HTTP Request", {
      method: config.method?.toUpperCase(),
      url: config.url,
      params: config.params,
    });
    return config;
  },

  onRequestError: (error: unknown) => {
    logger.error("HTTP Request Error", { error });
    return Promise.reject(error);
  },

  onResponse: (response: AxiosResponse) => {
    logger.debug("HTTP Response", {
      status: response.status,
      url: response.config.url,
    });
    return response;
  },

  onResponseError: (error: unknown) => {
    logger.error("HTTP Response Error", { error });
    return Promise.reject(error);
  },
};
