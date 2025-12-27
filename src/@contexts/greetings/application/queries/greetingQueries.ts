/**
 * TanStack Query Definitions
 *
 * @layer Application
 * @context Greetings
 */

import { queryOptions } from "@tanstack/react-query";
import { GreetingApiClient } from "../../infrastructure/api/GreetingApiClient";
import { GreetingMapper } from "../mappers/GreetingMapper";

export const greetingQueries = {
  list: () =>
    queryOptions({
      queryKey: ["greetings", "list"] as const,
      queryFn: async () => {
        const repository = new GreetingApiClient();
        const dto = await repository.listGreetings();
        return [GreetingMapper.toDomain(dto)];
      },
    }),

  detail: () =>
    queryOptions({
      queryKey: ["greetings", "detail"] as const,
      queryFn: async () => {
        const repository = new GreetingApiClient();
        const dto = await repository.getGreeting();
        return GreetingMapper.toDomain(dto);
      },
    }),
};
