import { Entity } from '@libs/entity-lib';

export type AccountParams = {
  username: string;
  email: string;
  password?: string;
  token?: string;
}
export const AccountId = Symbol('AccountId');
export class Accounts extends Entity<AccountParams> {
  public readonly username!: string;

  public readonly email!: string;

  private readonly password?: string;

  public token?: string;

  public static create(params: AccountParams, id?: string): Accounts {
    return new Accounts(params, id, AccountId);
  }

  public getData(): Required<AccountParams> {
    return {
      username: this.username,
      email: this.email,
      password: this.password ?? '',
      token: this.token ?? '',
    };
  }
}
