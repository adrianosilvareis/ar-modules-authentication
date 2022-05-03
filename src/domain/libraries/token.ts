export type Payload = string | object | Buffer

export abstract class Token {
  protected token!: string;

  private createdAt!: Date;

  constructor(payload: Payload) {
    this.generateToken(payload);
    this.createdAt = new Date();
  }

  public reloadToken(): string {
    if (this.isExpired()) {
      throw new Error('Token is expired');
    }
    this.createdAt = new Date();

    const payload = this.getPayload();
    this.generateToken(payload);

    return this.token;
  }

  public getToken(): string {
    return this.token;
  }

  public isExpired(): boolean {
    return this.createdAt.getTime() + this.getExpirationTime() < new Date().getTime();
  }

  public abstract isValid(): boolean;

  public abstract getPayload(): Payload;

  protected abstract generateToken(payload: Payload): void;

  protected abstract getExpirationTime(): number;
}
