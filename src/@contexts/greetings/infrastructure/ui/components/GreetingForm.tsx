/**
 * GreetingForm Component
 *
 * @layer Infrastructure
 * @context Greetings
 */

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createGreetingSchema,
  type CreateGreetingInput,
} from "../../../application/validators/greetingSchemas";
import { useCreateGreeting } from "../../../application/hooks/useCreateGreeting";

export const GreetingForm = () => {
  const { mutate: createGreeting, isPending } = useCreateGreeting();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateGreetingInput>({
    resolver: zodResolver(createGreetingSchema),
  });

  const onSubmit = (data: CreateGreetingInput) => {
    createGreeting(data, {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      aria-label="Create greeting form"
      className="space-y-4"
    >
      <div className="space-y-2">
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
          Message
          <span aria-label="required" className="text-red-500 ml-1">
            *
          </span>
        </label>

        <textarea
          id="message"
          {...register("message")}
          placeholder="Enter your greeting message..."
          rows={3}
          aria-invalid={errors.message ? "true" : "false"}
          aria-describedby={errors.message ? "message-error" : "message-help"}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />

        {errors.message && (
          <p id="message-error" role="alert" className="text-sm text-red-600">
            {errors.message.message}
          </p>
        )}

        <p id="message-help" className="text-sm text-gray-500">
          Enter a message between 1 and 200 characters
        </p>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? "Sending..." : "Send Greeting"}
      </button>
    </form>
  );
};
