/**
 * GreetingList Component
 *
 * @layer Infrastructure
 * @context Greetings
 */

import { useGreetingList } from "../../../application/hooks/useGreetingList";
import { GreetingCard } from "./GreetingCard";

export const GreetingList = () => {
  const { data: greetings, isLoading, error } = useGreetingList();

  if (isLoading) {
    return (
      <div role="status" aria-live="polite" className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
        <p className="mt-2 text-gray-600">Loading greetings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        aria-live="assertive"
        className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800"
      >
        <p className="font-semibold">Error loading greetings</p>
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }

  if (!greetings || greetings.length === 0) {
    return (
      <p className="text-center text-gray-500 py-8">
        No greetings found. Create your first greeting!
      </p>
    );
  }

  return (
    <div role="list" aria-label="Greetings list" className="space-y-4">
      {greetings.map((greeting, i) => (
        <GreetingCard key={i} greeting={greeting} />
      ))}
    </div>
  );
};
