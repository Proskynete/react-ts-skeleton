/**
 * Result Type (Functional Error Handling)
 *
 * @layer Shared/Types
 */

export type Result<T, E = Error> = Success<T> | Failure<E>;

export class Success<T> {
  readonly isSuccess = true;
  readonly isFailure = false;
  readonly value: T;

  constructor(value: T) {
    this.value = value;
  }

  map<U>(fn: (value: T) => U): Result<U, never> {
    return new Success(fn(this.value));
  }

  flatMap<U, E>(fn: (value: T) => Result<U, E>): Result<U, E> {
    return fn(this.value);
  }
}

export class Failure<E> {
  readonly isSuccess = false;
  readonly isFailure = true;
  readonly error: E;

  constructor(error: E) {
    this.error = error;
  }

  map<U>(_fn: (value: never) => U): Result<U, E> {
    return this as unknown as Result<U, E>;
  }

  flatMap<U>(_fn: (value: never) => Result<U, E>): Result<U, E> {
    return this as unknown as Result<U, E>;
  }
}

export const success = <T>(value: T): Result<T, never> => new Success(value);
export const failure = <E>(error: E): Result<never, E> => new Failure(error);
