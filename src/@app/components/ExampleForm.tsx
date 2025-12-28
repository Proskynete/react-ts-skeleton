/**
 * ExampleForm Component
 *
 * This is an example component demonstrating:
 * - React Hook Form for form management
 * - Zod for schema validation
 * - Tailwind CSS for styling
 * - Local state management with useState
 *
 * @layer App
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Schema validation with Zod
const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof formSchema>;

interface SubmittedData extends FormData {
  id: string;
  submittedAt: string;
}

export const ExampleForm = () => {
  const [submittedData, setSubmittedData] = useState<SubmittedData[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newEntry: SubmittedData = {
      ...data,
      id: Math.random().toString(36).slice(2),
      submittedAt: new Date().toISOString(),
    };

    setSubmittedData((prev) => [newEntry, ...prev]);
    reset();
  };

  const handleDelete = (id: string) => {
    setSubmittedData((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          React + TypeScript Template
        </h1>
        <p className="text-gray-600">
          Example form with React Hook Form, Zod validation, and Tailwind CSS
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Form Section */}
        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Submit Form
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Name
              </label>
              <input
                {...register("name")}
                id="name"
                type="text"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                {...register("email")}
                id="email"
                type="email"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Message Field */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Message
              </label>
              <textarea
                {...register("message")}
                id="message"
                rows={4}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.message ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Write your message here..."
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.message.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        </section>

        {/* Submitted Data Section */}
        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Submitted Data ({submittedData.length})
          </h2>

          {submittedData.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No submissions yet. Fill out the form to see data here.
            </p>
          ) : (
            <div className="space-y-3 overflow-auto max-h-96">
              {submittedData.map((item) => (
                <article
                  key={item.id}
                  className="p-4 bg-gray-50 rounded-md border border-gray-200"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                      aria-label="Delete entry"
                    >
                      Delete
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{item.email}</p>
                  <p className="text-sm text-gray-700">{item.message}</p>
                  <time className="text-xs text-gray-400 mt-2 block">
                    {new Date(item.submittedAt).toLocaleString()}
                  </time>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
