/**
 * AppProviders
 *
 * @layer App
 */

import { type PropsWithChildren } from "react";
import { QueryProvider } from "@shared/infrastructure/ui/providers/QueryProvider";
import { ErrorBoundary } from "@shared/infrastructure/ui/components/ErrorBoundary";

export const AppProviders = ({ children }: PropsWithChildren) => {
  return (
    <ErrorBoundary>
      <QueryProvider>{children}</QueryProvider>
    </ErrorBoundary>
  );
};
