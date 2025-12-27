/**
 * Greeting Entity
 *
 * @layer Domain
 * @context Greetings
 */

import { Message } from "../value-objects/Message";

export class Greeting {
  readonly message: Message;
  readonly timestamp: Date;

  private constructor(message: Message, timestamp: Date) {
    this.message = message;
    this.timestamp = timestamp;
  }

  static create(message: string): Greeting {
    return new Greeting(Message.create(message), new Date());
  }

  static fromDto(dto: { message: string; timestamp: string }): Greeting {
    const timestamp = new Date(dto.timestamp);
    return new Greeting(Message.create(dto.message), timestamp);
  }

  isRecent(): boolean {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    return this.timestamp.getTime() > oneHourAgo;
  }

  isLongMessage(): boolean {
    return this.message.value.length > 100;
  }

  getFormattedTimestamp(): string {
    return this.timestamp.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  updateMessage(newMessage: string): Greeting {
    return new Greeting(Message.create(newMessage), new Date());
  }

  equals(other: Greeting): boolean {
    return (
      this.message.value === other.message.value &&
      this.timestamp.getTime() === other.timestamp.getTime()
    );
  }
}
