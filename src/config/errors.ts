export class ConnectionError extends Error {
  constructor() {
    super("It seems that we couldn't establish a connection, please try again later",);
  }
}

export class ResponseError extends Error {
  constructor(public message: string, public code: number) {
    super(message);
  }
}

export class UnexpectedError extends Error {
  constructor(public innerError: Error | unknown) {
    super('Something went wrong, please try again later');
    this.name = 'Unexpected error';

    //add inner error stack to the current stack
    if (innerError instanceof Error && innerError.stack) {
      this.stack += `\nCaused by: ${innerError.stack}`;
    }
  }
}
