/**
 * GreetingMapper
 *
 * @layer Application
 * @context Greetings
 */

import { Greeting } from "../../domain/entities/Greeting";
import type { GreetingResponseDto } from "../dtos/GreetingResponseDto";
import type { CreateGreetingRequestDto } from "../dtos/CreateGreetingRequestDto";
import type { CreateGreetingInput } from "../validators/greetingSchemas";

export const GreetingMapper = {
  /**
   * Convert DTO from API to Domain Entity
   */
  toDomain(dto: GreetingResponseDto): Greeting {
    return Greeting.fromDto(dto);
  },

  /**
   * Convert Domain Entity to Response DTO
   */
  toResponseDto(entity: Greeting): GreetingResponseDto {
    return {
      id: entity.id,
      message: entity.message.value,
      timestamp: entity.createdAt.toISOString(),
    };
  },

  /**
   * Convert user input to Request DTO
   */
  toCreateRequest(input: CreateGreetingInput): CreateGreetingRequestDto {
    return {
      message: input.message,
    };
  },
};
