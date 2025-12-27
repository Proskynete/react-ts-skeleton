/**
 * Message Value Object
 *
 * @layer Domain
 * @context Greetings
 */

import { InvalidGreetingException } from "../exceptions/InvalidGreetingException";

export class Message {
  readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): Message {
    const trimmed = value.trim();

    if (trimmed.length < 1) {
      throw new InvalidGreetingException("Message cannot be empty");
    }

    if (trimmed.length > 200) {
      throw new InvalidGreetingException(
        "Message cannot exceed 200 characters"
      );
    }

    return new Message(trimmed);
  }

  isEmpty(): boolean {
    return this.value.length === 0;
  }

  length(): number {
    return this.value.length;
  }

  contains(substring: string): boolean {
    return this.value.toLowerCase().includes(substring.toLowerCase());
  }

  equals(other: Message): boolean {
    return this.value === other.value;
  }
}
