/**
 * IGreetingRepository (Port)
 *
 * @layer Application
 * @context Greetings
 */

import type { GreetingResponseDto } from "../../dtos/GreetingResponseDto";
import type { CreateGreetingRequestDto } from "../../dtos/CreateGreetingRequestDto";

export interface IGreetingRepository {
  getGreeting(): Promise<GreetingResponseDto>;
  getGreetingById(id: string): Promise<GreetingResponseDto>;
  createGreeting(
    request: CreateGreetingRequestDto
  ): Promise<GreetingResponseDto>;
  listGreetings(): Promise<GreetingResponseDto[]>;
}
