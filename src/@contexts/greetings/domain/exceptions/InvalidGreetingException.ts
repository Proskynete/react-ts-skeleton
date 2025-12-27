/**
 * InvalidGreetingException
 *
 * @layer Domain
 * @context Greetings
 */

import { DomainException } from "@shared/domain/exceptions/DomainException";

export class InvalidGreetingException extends DomainException {
  constructor(message: string) {
    super(message);
    this.name = "InvalidGreetingException";
  }
}
