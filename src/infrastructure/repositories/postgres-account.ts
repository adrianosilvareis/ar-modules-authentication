import { injectable } from 'inversify';

import { AccountParams } from '../../domain/entities/accounts';
import { AccountRepository } from '../../domain/repositories/account';
import client from '../../config/database-client';

@injectable()
export class PostgresAccountRepository extends AccountRepository {
  public async isAvailableEmailOrUsername(username: string, email: string): Promise<void> {
    const found = await client.accounts.findMany({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (found.length !== 0) {
      throw new Error('Email or username is already taken');
    }
  }

  public async saveAccount(data: Required<AccountParams>): Promise<void> {
    try {
      await client.accounts.create({ data });
    } catch (error) {
      throw new Error('Failed to save account');
    }
  }
}
