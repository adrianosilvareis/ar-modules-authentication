import { inject, injectable } from 'inversify';
import { isEmpty, isNil } from 'lodash';

import { TokenJwt } from '../libraries/token-jwt';
import { Token } from '../../domain/libraries/token';
import { SignUpService } from '../../domain/services/sign-up';

export interface AuthConfigEnvironments {
  jwt: {
    secret: string;
    expirationTime: string;
  }
}

@injectable()
export class Auth {
  private static environments?: AuthConfigEnvironments;

  public constructor(
    @inject(SignUpService) private readonly service: SignUpService,
  ) {
    if (isNil(Auth.environments) || isEmpty(Auth.environments)) {
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

  public signUp(username: string, email: string, password: string): Promise<Token> {
    const token = this.service.signUp(username, email, password);
    return token;
  }
}
