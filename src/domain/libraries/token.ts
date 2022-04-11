type Payload = string | object | Buffer

abstract class Token {
  private token!: string;

  private createdAt!: Date;

  constructor(payload: Payload) {
    this.generateToken(payload);
  }

  public abstract verifyToken(token: string): Promise<boolean>;

  public abstract getPayload(token: string): Promise<Payload>;

  public async reloadToken(): Promise<string> {
    if (this.isExpired()) {
      throw new Error('Token is expired');
    }
    this.createdAt = new Date();

    const payload = await this.getPayload(this.token);
    await this.generateToken(payload);

    return this.token;
  }

  protected abstract generateToken(payload: Payload): Promise<void>;

  protected abstract getExpirationTime(): number;

  public getToken(): string {
    return this.token;
  }

  public isExpired(): boolean {
    return this.createdAt.getTime() + this.getExpirationTime() < new Date().getTime();
  }
}
