/**
 * Error Interceptor
 *
 * @layer Shared/Infrastructure
 */

import { AxiosError } from "axios";
import { logger } from "../../observability/logger/Logger";

export const errorInterceptor = {
  onRejected: (error: AxiosError) => {
    if (error.response) {
      // Server responded with error status
      logger.error("API Error Response", {
        status: error.response.status,
        url: error.config?.url,
        data: error.response.data,
      });

      // Handle specific status codes
      switch (error.response.status) {
        case 401:
          // Redirect to login
          window.location.href = "/login";
          break;
        case 403:
          // Show forbidden message
          break;
        case 404:
          // Show not found message
          break;
        case 500:
          // Show server error message
          break;
      }
    } else if (error.request) {
      // Request made but no response
      logger.error("API No Response", {
        url: error.config?.url,
        message: "No response received from server",
      });
    } else {
      // Request setup error
      logger.error("API Request Error", {
        message: error.message,
      });
    }

    return Promise.reject(error);
  },
};
