/**
 * App Component
 *
 * @layer App
 */

import React from "react";
import { AppProviders } from "./AppProviders";
import { GreetingsPage } from "@contexts/greetings/infrastructure/ui/pages/GreetingsPage";

export const App: React.FC = () => {
  return (
    <AppProviders>
      <GreetingsPage />
    </AppProviders>
  );
};
