/**
 * Greeting Entity
 *
 * @layer Domain
 * @context Greetings
 */

import { Message } from "../value-objects/Message";
import { InvalidGreetingException } from "../exceptions/InvalidGreetingException";

export class Greeting {
  readonly id: string;
  readonly message: Message;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  private constructor(
    id: string,
    message: Message,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id;
    this.message = message;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create(id: string, message: string): Greeting {
    if (!id || id.trim().length === 0) {
      throw new InvalidGreetingException("Greeting ID cannot be empty");
    }

    const now = new Date();
    return new Greeting(id, Message.create(message), now, now);
  }

  static fromDto(dto: {
    id: string;
    message: string;
    timestamp: string;
  }): Greeting {
    const createdAt = new Date(dto.timestamp);
    return new Greeting(
      dto.id,
      Message.create(dto.message),
      createdAt,
      createdAt
    );
  }

  isRecent(): boolean {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    return this.createdAt.getTime() > oneHourAgo;
  }

  isLongMessage(): boolean {
    return this.message.value.length > 100;
  }

  getFormattedTimestamp(): string {
    return this.createdAt.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  updateMessage(newMessage: string): Greeting {
    return new Greeting(
      this.id,
      Message.create(newMessage),
      this.createdAt,
      new Date()
    );
  }

  equals(other: Greeting): boolean {
    return this.id === other.id;
  }
}
