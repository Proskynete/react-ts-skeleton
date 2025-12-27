/**
 * useCreateGreeting Hook
 *
 * @layer Application
 * @context Greetings
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GreetingApiClient } from "../../infrastructure/api/GreetingApiClient";
import { GreetingMapper } from "../mappers/GreetingMapper";
import {
  type CreateGreetingInput,
  createGreetingSchema,
} from "../validators/greetingSchemas";
import { greetingQueries } from "../queries/greetingQueries";

export const useCreateGreeting = () => {
  const queryClient = useQueryClient();
  const repository = new GreetingApiClient();

  return useMutation({
    mutationFn: async (input: CreateGreetingInput) => {
      // Validate input
      const validated = createGreetingSchema.parse(input);

      // Map to request DTO
      const request = GreetingMapper.toCreateRequest(validated);

      // Call API
      const dto = await repository.createGreeting(request);

      // Map to domain entity
      return GreetingMapper.toDomain(dto);
    },
    onSuccess: () => {
      // Invalidate queries to refetch
      queryClient.invalidateQueries({ queryKey: greetingQueries.all() });
    },
  });
};
