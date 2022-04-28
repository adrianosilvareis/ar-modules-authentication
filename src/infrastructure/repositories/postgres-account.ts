import { injectable } from 'inversify';

import { AccountParams, Accounts } from '../../domain/entities/accounts';
import { AccountRepository } from '../../domain/repositories/account';
import client from '../../config/database-client';
import { UnavailableRequestError, UnexpectedError, NotFoundError } from '../../domain/erros';

@injectable()
export class PostgresAccountRepository extends AccountRepository {
  public async isAvailableEmailOrUsername(username: string, email: string): Promise<void> {
    const found = await client.accounts.findMany({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (found.length !== 0) {
      throw new UnavailableRequestError('Email or username is already in use');
    }
  }

  public async saveAccount(data: Required<AccountParams>): Promise<void> {
    try {
      await client.accounts.create({ data });
    } catch (error) {
      throw new UnexpectedError('Failed to save account');
    }
  }

  public async updateAccount(data: Accounts): Promise<void> {
    try {
      await client.accounts.update({
        where: {
          id: data.id.toString(),
        },
        data: {
          ...data.getData(),
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      throw new UnexpectedError('Failed to save account');
    }
  }

  public async findAccountByEmailOrUsername(emailOrUsername: string):Promise<Accounts> {
    const found = await client.accounts.findMany({
      where: {
        OR: [{ username: emailOrUsername }, { email: emailOrUsername }],
      },
    });

    if (found.length === 0) {
      throw new NotFoundError('Account not found');
    }
    const account = found[0];
    return Accounts.create({
      username: account.username,
      email: account.email,
      password: account.password,
      token: account.token ?? '',
    }, account.id);
  }
}
