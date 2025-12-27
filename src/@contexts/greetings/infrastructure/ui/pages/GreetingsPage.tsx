/**
 * GreetingsPage
 *
 * @layer Infrastructure
 * @context Greetings
 */

import { GreetingForm } from "../components/GreetingForm";
import { GreetingList } from "../components/GreetingList";

export const GreetingsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Greetings</h1>
          <p className="mt-1 text-sm text-gray-600">
            Send and view greetings
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section aria-labelledby="create-heading">
            <h2
              id="create-heading"
              className="text-2xl font-semibold text-gray-900 mb-4"
            >
              Create Greeting
            </h2>
            <div className="bg-white rounded-lg shadow p-6">
              <GreetingForm />
            </div>
          </section>

          <section aria-labelledby="list-heading">
            <h2
              id="list-heading"
              className="text-2xl font-semibold text-gray-900 mb-4"
            >
              Recent Greetings
            </h2>
            <GreetingList />
          </section>
        </div>
      </main>
    </div>
  );
};
