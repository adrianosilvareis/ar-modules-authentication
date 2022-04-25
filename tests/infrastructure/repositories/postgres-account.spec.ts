import { Uuid } from '@libs/uuid-lib';

import { PostgresAccountRepository } from '../../../src/infrastructure/repositories/postgres-account';
import { AccountsBuilder } from '../../builders/accounts';
import { prismaMockClient } from '../../setup';

describe('PostgresAccountRepository', () => {
  describe('isAvailableEmailOrUsername', () => {
    it('should throw if username or email already exists', async () => {
      const username = 'username';
      const email = 'email@email.com';

      prismaMockClient.accounts.findMany.mockResolvedValueOnce([{
        id: 'id',
        username,
        email,
        password: 'password',
        token: 'token',
        createdAt: new Date(),
        updatedAt: new Date(),
      }]);

      const repo = new PostgresAccountRepository();

      const promise = repo.isAvailableEmailOrUsername(username, email);
      await expect(promise).rejects.toThrow('Email or username is already taken');
    });
  });

  describe('saveAccount', () => {
    it('should throw if failed to save account', async () => {
      const account = new AccountsBuilder().build();

      prismaMockClient.accounts.create.mockRejectedValueOnce(new Error('Failed to save account'));

      const repo = new PostgresAccountRepository();

      const promise = repo.saveAccount(account.getData());
      await expect(promise).rejects.toThrowError('Failed to save account');
    });
  });

  describe('findAccountByEmailOrUsername', () => {
    it('should throw if account not found', async () => {
      const emailOrUsername = 'emailOrUsername';

      prismaMockClient.accounts.findMany.mockResolvedValueOnce([]);

      const repo = new PostgresAccountRepository();

      const promise = repo.findAccountByEmailOrUsername(emailOrUsername);
      await expect(promise).rejects.toThrowError('Account not found');
    });

    it('should return accounts with already exists', async () => {
      const emailOrUsername = 'emailOrUsername';
      const accountData = {
        id: Uuid.generate().toString(),
        username: emailOrUsername,
        email: 'email@email.com',
        password: 'password',
        token: 'token',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      prismaMockClient.accounts.findMany.mockResolvedValueOnce([accountData]);

      const repo = new PostgresAccountRepository();
      const account = await repo.findAccountByEmailOrUsername(emailOrUsername);
      expect(account.username).toBe(emailOrUsername);
    });
  });
});
