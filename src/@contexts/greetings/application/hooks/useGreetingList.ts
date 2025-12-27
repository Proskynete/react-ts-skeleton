/**
 * useGreetingList Hook
 *
 * @layer Application
 * @context Greetings
 */

import { useQuery } from "@tanstack/react-query";
import { greetingQueries } from "../queries/greetingQueries";

export const useGreetingList = () => useQuery(greetingQueries.list());
