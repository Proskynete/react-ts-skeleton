/**
 * useGetGreeting Hook
 *
 * @layer Application
 * @context Greetings
 */

import { useQuery } from "@tanstack/react-query";
import { greetingQueries } from "../queries/greetingQueries";

export const useGetGreeting = () => {
  return useQuery(greetingQueries.detail());
};
