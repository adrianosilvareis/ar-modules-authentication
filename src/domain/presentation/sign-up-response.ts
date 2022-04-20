import { TokenJwt } from '../../infrastructure/libraries/token-jwt';
import { Token } from '../libraries/token';

export class SignUpResponse {
  public readonly token: Token;

  public constructor(token:Token) {
    this.token = token;
  }

  public toPlan(): string {
    return this.token.getToken();
  }

  public static fromPlan(plan: string): Token {
    return TokenJwt.setToken(plan);
  }
}
