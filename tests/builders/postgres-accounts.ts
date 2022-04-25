import { Builder } from '@libs/entity-builder';
import { Uuid } from '@libs/uuid-lib';
import { Accounts } from '@prisma/client';

export class PostgresAccountsBuilder extends Builder<Accounts, PostgresAccountsBuilder> {
  public constructor() {
    super(PostgresAccountsBuilder);
  }

  protected buildDefault(): Accounts {
    return {
      id: Uuid.generate().toString(),
      username: 'username',
      email: 'email@email.com',
      password: 'password',
      token: 'token',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
