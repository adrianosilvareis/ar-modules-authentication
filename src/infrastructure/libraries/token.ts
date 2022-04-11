import { isEmpty } from 'lodash';
import jwt, { JwtPayload } from 'jsonwebtoken';

export interface TokenEnv {
  secretOrPrivateKey: string;
  expirationTime: string;
}

export class Token {
  public static environments: TokenEnv = {
    secretOrPrivateKey: '',
    expirationTime: '',
  };

  public static async encrypt(payload: string | object | Buffer): Promise<string> {
    Token.checkEnvironments();

    const token = await jwt.sign(payload, Token.environments.secretOrPrivateKey, {
      expiresIn: Token.environments.expirationTime,
    });

    return token;
  }

  private static checkEnvironments() {
    if (isEmpty(Token.environments.secretOrPrivateKey)) {
      throw new Error('Token.environments is not defined');
    }
  }

  public static decoded<T>(value: string):T {
    Token.checkEnvironments();

    const decoded = jwt.verify(value, Token.environments.secretOrPrivateKey) as JwtPayload;

    delete decoded.iss;
    delete decoded.sub;
    delete decoded.aud;
    delete decoded.exp;
    delete decoded.nbf;
    delete decoded.iat;
    delete decoded.jti;

    return decoded as T;
  }

  public static validate(value: string): boolean {
    Token.checkEnvironments();

    const decoded = jwt.verify(value, Token.environments.secretOrPrivateKey);
    return decoded !== undefined;
  }

  public static async refresh(token: string): Promise<string> {
    Token.checkEnvironments();

    const payload = await jwt.verify(token, Token.environments.secretOrPrivateKey) as JwtPayload;
    delete payload.iat;
    delete payload.exp;
    const jwtSignOptions = {
      expiresIn: Token.environments.expirationTime,
    };
    payload.refreshTime = payload.refreshTime === undefined ? 0 : payload.refreshTime + 1;

    return jwt.sign(payload, Token.environments.secretOrPrivateKey, jwtSignOptions);
  }
}
