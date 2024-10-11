export class FalconShieldError extends Error {
  constructor(public message: string, public details: string) {
    super(message);
    this.name = 'FalconShieldError';
  }
}