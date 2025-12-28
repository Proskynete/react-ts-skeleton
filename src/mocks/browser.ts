/**
 * MSW Browser Worker
 *
 * This file configures Mock Service Worker for browser environments.
 * Use this during local development to mock API calls without a real backend.
 *
 * To enable MSW in development:
 * 1. Set VITE_USE_MSW=true in your .env file
 * 2. Import and start the worker in your main.tsx
 */

import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

const worker = setupWorker(...handlers);

export const mockWorker = {
  start: () =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  reset: () => worker.resetHandlers(),
  stop: () => worker.stop(),
};
