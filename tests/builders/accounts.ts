import { Builder } from '@libs/entity-builder';

import { Accounts } from '../../src';

export class AccountsBuilder extends Builder<Accounts, AccountsBuilder> {
  public constructor() {
    super(AccountsBuilder);
  }

  protected buildDefault(): Accounts {
    return Accounts.create({
      username: 'username',
      email: 'email@email.com',
      password: 'password',
      token: 'token',
      isLoggedIn: true,
      lastAccess: new Date(),
    });
  }
}
