import { inject } from 'inversify';

import { diContainer } from '../../config/di-container';
import { TokenJwt } from '../libraries/token-jwt';
import { Token } from '../../domain/libraries/token';
import { SignUpService } from '../../domain/services/sign-up';

export interface AuthConfigEnvironments {
  jwt: {
    secret: string;
    expirationTime: string;
  }
}

export class Auth {
  private static environments?: AuthConfigEnvironments;

  private static instance: Auth;

  private constructor(
    @inject(SignUpService) private readonly service: SignUpService = diContainer.get(SignUpService),
  ) {
    if (!Auth.environments) {
      throw new Error('Auth.config is not defined');
    }
    TokenJwt.config({
      secretOrPrivateKey: Auth.environments.jwt.secret,
      expiresIn: Auth.environments.jwt.expirationTime ?? '1h',
    });
  }

  public static config(config?: AuthConfigEnvironments): void {
    Auth.environments = config;
  }

  public static get(): Auth {
    if (Auth.instance === undefined) {
      Auth.instance = new Auth();
    }
    return Auth.instance;
  }

  public signUp(username: string, email: string, password: string): Promise<Token> {
    const token = this.service.signUp(username, email, password);
    return token;
  }
}
