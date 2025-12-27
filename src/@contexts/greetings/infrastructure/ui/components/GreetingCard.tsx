/**
 * GreetingCard Component
 *
 * @layer Infrastructure
 * @context Greetings
 */

import type { Greeting } from "../../../domain/entities/Greeting";

interface GreetingCardProps {
  greeting: Greeting;
  onUpdate?: (greeting: Greeting) => void;
  onDelete?: (id: string) => void;
}

export const GreetingCard = ({
  greeting,
  onUpdate,
  onDelete,
}: GreetingCardProps) => {
  return (
    <article
      className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
      data-testid="greeting-card"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900">
          {greeting.message.value}
        </h3>
        {greeting.isRecent() && (
          <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
            🆕 New
          </span>
        )}
      </div>

      <footer className="flex justify-between items-center gap-2">
        <time
          className="text-sm text-gray-600"
          dateTime={greeting.createdAt.toISOString()}
        >
          {greeting.getFormattedTimestamp()}
        </time>

        {greeting.isLongMessage() && (
          <span className="text-xs text-gray-400">Long message</span>
        )}

        <div className="flex gap-2">
          {onUpdate && (
            <button
              onClick={() => onUpdate(greeting)}
              className="px-3 py-1.5 border border-gray-300 rounded bg-white text-gray-700 text-sm hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              aria-label="Update greeting"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(greeting.id)}
              className="px-3 py-1.5 border border-gray-300 rounded bg-white text-gray-700 text-sm hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              aria-label="Delete greeting"
            >
              Delete
            </button>
          )}
        </div>
      </footer>
    </article>
  );
};
