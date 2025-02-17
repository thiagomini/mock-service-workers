export class Result<T, E extends Error | undefined = Error> {
  public readonly value: T | undefined;
  public readonly error: E | undefined;

  private constructor(value: T | undefined, error: E | undefined) {
    this.value = value;
    this.error = error;
  }

  static ok<T>(value: T): Result<T, undefined> {
    return new Result(value, undefined);
  }

  static fail<E extends Error>(error: E): Result<undefined, E> {
    return new Result(undefined, error);
  }

  isOk(): this is Result<T, undefined> {
    return this.value !== undefined;
  }

  isError(): this is Result<undefined, E> {
    return this.error !== undefined;
  }

  unwrap(): T {
    if (this.isOk()) {
      return this.value;
    }
    throw this.error;
  }
}
