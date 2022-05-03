import { Entity } from '@libs/entity-lib';

import { Payload, Token } from '../libraries/token';

export type AccountParams = {
  username: string;
  email: string;
  password?: string;
  token?: string;
  isLoggedIn?: boolean;
  lastAccess?: Date;
}
export const AccountId = Symbol('AccountId');
export class Accounts extends Entity<AccountParams> {
  public readonly username!: string;

  public readonly email!: string;

  public readonly password?: string;

  public isLoggedIn?: boolean;

  public lastAccess?: Date;

  public token?: string;

  public static create(params: AccountParams, id?: string): Accounts {
    return new Accounts(params, id, AccountId);
  }

  public makeLoggingIn(TokenInner: (new (payload: Payload) => Token)): Token {
    const token = new TokenInner({
      username: this.username,
      email: this.email,
    });
    this.token = token.getToken();
    this.isLoggedIn = true;
    this.lastAccess = new Date();
    return token;
  }

  // lastAccess, isLoggedIn, isActive
  public getData(): Required<AccountParams> {
    return {
      username: this.username,
      email: this.email,
      password: this.password ?? '',
      token: this.token ?? '',
      isLoggedIn: this.isLoggedIn ?? false,
      lastAccess: this.lastAccess ?? new Date(),
    };
  }
}
