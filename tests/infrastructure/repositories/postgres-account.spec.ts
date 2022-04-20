import { PostgresAccountRepository } from '../../../src/infrastructure/repositories/postgres-account';
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
      const data = {
        username: 'username',
        email: 'email@email.com',
        password: 'password',
        token: 'token',
      };

      prismaMockClient.accounts.create.mockRejectedValueOnce(new Error('Failed to save account'));

      const repo = new PostgresAccountRepository();

      const promise = repo.saveAccount(data);
      await expect(promise).rejects.toThrowError('Failed to save account');
    });
  });
});
