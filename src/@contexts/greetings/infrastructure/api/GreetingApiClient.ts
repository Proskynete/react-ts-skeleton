/**
 * GreetingApiClient (Repository Implementation)
 *
 * @layer Infrastructure
 * @context Greetings
 */

import type { IGreetingRepository } from "../../application/ports/outbound/IGreetingRepository";
import type { GreetingResponseDto } from "../../application/dtos/GreetingResponseDto";
import type { CreateGreetingRequestDto } from "../../application/dtos/CreateGreetingRequestDto";
import { httpClient } from "@shared/infrastructure/http/httpClient";

export class GreetingApiClient implements IGreetingRepository {
  private readonly baseUrl = "/api/v2/greetings";

  async getGreeting(): Promise<GreetingResponseDto> {
    const response = await httpClient.get<GreetingResponseDto>(this.baseUrl);
    return response.data;
  }

  async createGreeting(
    request: CreateGreetingRequestDto
  ): Promise<GreetingResponseDto> {
    const response = await httpClient.post<GreetingResponseDto>(
      this.baseUrl,
      request
    );
    return response.data;
  }

  async listGreetings(): Promise<GreetingResponseDto> {
    const response = await httpClient.get<GreetingResponseDto>(this.baseUrl);
    return response.data;
  }
}
