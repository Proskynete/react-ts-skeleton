# Domain Layer Guide

This guide explains how to implement the domain layer in your application following hexagonal architecture principles.

## Table of Contents

- [Overview](#overview)
- [Directory Structure](#directory-structure)
- [Domain Exceptions](#domain-exceptions)
- [Entities](#entities)
- [Value Objects](#value-objects)
- [Best Practices](#best-practices)

## Overview

The domain layer contains the core business logic of your application. It should be:

- **Independent**: No dependencies on external frameworks or libraries
- **Pure**: Contains only business rules and logic
- **Testable**: Easy to test in isolation
- **Expressive**: Uses ubiquitous language from your domain

## Directory Structure

```
src/@contexts/
└── [bounded-context]/
    └── domain/
        ├── entities/        # Business entities
        ├── value-objects/   # Immutable value objects
        └── exceptions/      # Domain-specific exceptions
```

## Domain Exceptions

Domain exceptions represent business rule violations. They should extend a base `DomainException` class.

### Implementation Example

**1. Create base exception (`src/@shared/domain/exceptions/DomainException.ts`):**

```typescript
/**
 * DomainException (Base)
 *
 * @layer Shared/Domain
 */

export abstract class DomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DomainException";
    Object.setPrototypeOf(this, DomainException.prototype);
  }
}
```

**2. Create specific exceptions:**

```typescript
/**
 * InvalidUserException
 *
 * @layer Domain
 * @context Users
 */

import { DomainException } from "@shared/domain/exceptions/DomainException";

export class InvalidUserException extends DomainException {
  constructor(message: string) {
    super(message);
    this.name = "InvalidUserException";
    Object.setPrototypeOf(this, InvalidUserException.prototype);
  }
}
```

**3. Usage in domain logic:**

```typescript
export class User {
  static create(email: string): User {
    if (!email || !email.includes("@")) {
      throw new InvalidUserException("Invalid email address");
    }
    return new User(email);
  }
}
```

## Entities

Entities are objects with a unique identity that persists over time.

### Characteristics

- Have a unique identifier (id)
- Mutable state
- Equality based on identity, not attributes
- Encapsulate business logic

### Implementation Example

```typescript
/**
 * User Entity
 *
 * @layer Domain
 * @context Users
 */

import { Email } from "../value-objects/Email";
import { InvalidUserException } from "../exceptions/InvalidUserException";

export class User {
  readonly id: string;
  readonly email: Email;
  readonly createdAt: Date;

  private constructor(id: string, email: Email, createdAt: Date) {
    this.id = id;
    this.email = email;
    this.createdAt = createdAt;
  }

  static create(id: string, email: string): User {
    if (!id || id.trim().length === 0) {
      throw new InvalidUserException("User ID cannot be empty");
    }
    return new User(id, Email.create(email), new Date());
  }

  static fromDto(dto: { id: string; email: string; createdAt: string }): User {
    return new User(
      dto.id,
      Email.create(dto.email),
      new Date(dto.createdAt)
    );
  }

  // Business logic methods
  changeEmail(newEmail: string): User {
    return new User(this.id, Email.create(newEmail), this.createdAt);
  }

  equals(other: User): boolean {
    return this.id === other.id;
  }
}
```

## Value Objects

Value objects are immutable objects defined by their attributes, not identity.

### Characteristics

- Immutable
- No unique identifier
- Equality based on all attributes
- Encapsulate validation logic

### Implementation Example

```typescript
/**
 * Email Value Object
 *
 * @layer Domain
 * @context Users
 */

import { InvalidUserException } from "../exceptions/InvalidUserException";

export class Email {
  readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): Email {
    const trimmed = value.trim().toLowerCase();

    if (!trimmed.includes("@")) {
      throw new InvalidUserException("Invalid email format");
    }

    if (trimmed.length > 255) {
      throw new InvalidUserException("Email too long");
    }

    return new Email(trimmed);
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}
```

## Best Practices

### 1. Use Private Constructors

Always use private constructors with static factory methods:

```typescript
// ✅ Good
class User {
  private constructor(/* ... */) {}
  static create(/* ... */): User {}
}

// ❌ Bad
class User {
  constructor(public email: string) {}
}
```

### 2. Validate in Factory Methods

Perform all validation in static factory methods:

```typescript
static create(email: string): Email {
  // Validate
  if (!email.includes("@")) {
    throw new InvalidUserException("Invalid email");
  }
  return new Email(email);
}
```

### 3. Make Entities and Value Objects Immutable

Use `readonly` for all properties:

```typescript
export class User {
  readonly id: string;
  readonly email: Email;
}
```

### 4. Use Value Objects for Validation

Encapsulate validation logic in value objects:

```typescript
// ✅ Good
export class User {
  readonly email: Email; // Email handles validation
}

// ❌ Bad
export class User {
  readonly email: string; // No validation
}
```

### 5. Follow Single Responsibility

Each entity/value object should have one reason to change:

```typescript
// ✅ Good
export class User {
  changeEmail(newEmail: string): User {}
}

export class UserNotifier {
  notify(user: User): void {}
}

// ❌ Bad
export class User {
  changeEmail(newEmail: string): User {}
  sendNotification(): void {} // Mixed responsibilities
}
```

### 6. Use TypeScript Strict Mode

Enable strict type checking in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "verbatimModuleSyntax": true,
    "erasableSyntaxOnly": true
  }
}
```

### 7. Avoid Parameter Properties

Declare fields explicitly instead of using parameter properties:

```typescript
// ✅ Good
export class User {
  readonly id: string;
  readonly email: Email;

  private constructor(id: string, email: Email) {
    this.id = id;
    this.email = email;
  }
}

// ❌ Bad (won't work with erasableSyntaxOnly)
export class User {
  private constructor(
    readonly id: string,
    readonly email: Email
  ) {}
}
```

## Example: Complete Domain Layer

```
src/@contexts/users/
└── domain/
    ├── entities/
    │   └── User.ts
    ├── value-objects/
    │   ├── Email.ts
    │   └── Username.ts
    └── exceptions/
        └── InvalidUserException.ts
```

This structure keeps your domain logic clean, testable, and framework-independent.
