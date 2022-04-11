import { Accounts } from '../entities/accounts';

export class SignUpResponse {
  public readonly id: string;

  public readonly email: string;

  public readonly username: string;

  public readonly token: string;

  public constructor(account:Accounts) {
    this.id = account.id.toString();
    this.email = account.email;
    this.username = account.username;
    this.token = account.token ?? '';
  }

  public toPlan(): string {
    return JSON.stringify({
      id: this.id,
      email: this.email,
      username: this.username,
      token: this.token,
    });
  }

  public static fromPlan(plan: string): SignUpResponse {
    const {
      id, email, username, token,
    } = JSON.parse(plan);
    return new SignUpResponse(Accounts.create({
      email,
      username,
      token,
    }, id));
  }
}
