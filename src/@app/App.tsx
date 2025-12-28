/**
 * App Component
 *
 * @layer App
 */

import { AppProviders } from "./AppProviders";
import { ExampleForm } from "./components/ExampleForm";

export const App = () => {
  return (
    <AppProviders>
      <ExampleForm />
    </AppProviders>
  );
};
