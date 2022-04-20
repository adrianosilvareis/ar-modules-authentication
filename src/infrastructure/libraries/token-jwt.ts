import jwt, { JwtPayload } from 'jsonwebtoken';
import ms from 'ms';

import { Token } from '../../domain/libraries/token';

type TokenEnv = {
  secretOrPrivateKey: string;
  expiresIn: string;
}

export class TokenJwt extends Token {
  private static environments: TokenEnv;

  public static config(env: TokenEnv) {
    this.environments = env;
  }

  public static setToken(token: string): Token {
    const instance = new TokenJwt(token);
    instance.token = token;
    return instance;
  }

  public isValid(): boolean {
    if (this.isExpired()) {
      return false;
    }
    const decoded = jwt.verify(this.token, TokenJwt.environments.secretOrPrivateKey);
    return decoded !== undefined;
  }

  public getPayload<T = object>(): T {
    if (this.isExpired()) {
      throw new Error('Token is expired');
    }
    const { secretOrPrivateKey } = TokenJwt.environments;
    const decoded = jwt.verify(this.token, secretOrPrivateKey) as JwtPayload;

    return this.sanitization<T>(decoded);
  }

  private sanitization<T>(decoded: JwtPayload): T {
    const clone = { ...decoded };

    delete clone.iss;
    delete clone.sub;
    delete clone.aud;
    delete clone.exp;
    delete clone.nbf;
    delete clone.iat;
    delete clone.jti;

    return clone as T;
  }

  protected generateToken(payload: string | object): void {
    if (TokenJwt.environments === undefined) {
      throw new Error('Token.environments is not defined');
    }
    const key = TokenJwt.environments.secretOrPrivateKey;
    const options = { expiresIn: this.getExpirationTime() };
    const data = typeof payload === 'string' ? { payload } : ({ ...payload });
    this.token = jwt.sign(data, key, options);
  }

  protected getExpirationTime(): number {
    return ms(TokenJwt.environments.expiresIn);
  }
}
