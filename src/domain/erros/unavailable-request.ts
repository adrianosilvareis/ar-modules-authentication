export class UnavailableRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnavailableRequestError';
  }
}
