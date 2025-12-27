/**
 * Greeting Validation Schemas
 *
 * @layer Application
 * @context Greetings
 */

import { z } from "zod";

export const createGreetingSchema = z.object({
  message: z
    .string()
    .min(1, "Message cannot be empty")
    .max(200, "Message cannot exceed 200 characters")
    .trim(),
});

export type CreateGreetingInput = z.infer<typeof createGreetingSchema>;
