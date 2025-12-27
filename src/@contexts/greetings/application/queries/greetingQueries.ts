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
  all: () => ["greetings"] as const,

  lists: () => [...greetingQueries.all(), "list"] as const,
  list: () =>
    queryOptions({
      queryKey: greetingQueries.lists(),
      queryFn: async () => {
        const repository = new GreetingApiClient();
        const dto = await repository.listGreetings();
        return [GreetingMapper.toDomain(dto)];
      },
    }),

  details: () => [...greetingQueries.all(), "detail"] as const,
  detail: (id?: string) =>
    queryOptions({
      queryKey: [...greetingQueries.details(), id] as const,
      queryFn: async () => {
        const repository = new GreetingApiClient();
        const dto = id
          ? await repository.getGreetingById(id)
          : await repository.getGreeting();
        return GreetingMapper.toDomain(dto);
      },
      enabled: !!id || id === undefined,
    }),
};
