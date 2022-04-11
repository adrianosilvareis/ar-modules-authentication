import { diContainer } from '../../config/di-container';
import { SignUpService } from './sign-up';
import { Token } from '../libraries/token';

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
  private static environments: AuthConfigEnvironments;

  private static instance: Auth;

  private constructor() {
    if (!Auth.environments) {
      throw new Error('Auth.config is not defined');
    }
    Token.environments = {
      secretOrPrivateKey: Auth.environments.jwt.secret,
      expirationTime: Auth.environments.jwt.expirationTime,
    };
  }

  public static config(config: AuthConfigEnvironments): void {
    Auth.environments = config;
    Auth.instance = new Auth();
  }

  public static get(): Auth {
    return Auth.instance;
  }

  public signUp(username: string, email: string, password: string): Promise<string> {
    const service = diContainer.get(SignUpService);
    const token = service.signUp(username, email, password);
    return token;
  }
}
