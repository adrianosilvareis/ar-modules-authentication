import { diContainer } from '../../config/di-container';
import { SignUpService } from './sign-up';
import { TokenJwt } from '../libraries/token-jwt';
import { Token } from '../../domain/libraries/token';

export interface AuthConfigEnvironments {
  jwt: {
    secret: string;
    expirationTime: string;
  },
  cache?: {
    host: string;
    port: number;
    timeout: number;
  }
}

export class Auth {
  private static environments?: AuthConfigEnvironments;

  private static instance: Auth;

  private constructor() {
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
    Auth.instance = new Auth();
    return Auth.instance;
  }

  public signUp(username: string, email: string, password: string): Promise<Token> {
    const service = diContainer.get(SignUpService);
    const token = service.signUp(username, email, password);
    return token;
  }
}
