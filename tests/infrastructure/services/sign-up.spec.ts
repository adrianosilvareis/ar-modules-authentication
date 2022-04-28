import { Accounts } from '@prisma/client';

import { diContainer } from '../../../src/config/di-container';
import { Encrypt } from '../../../src/domain/libraries/encrypt';
import { AccountRepository } from '../../../src/domain/repositories/account';
import { TokenJwt } from '../../../src/infrastructure/libraries/token-jwt';
import { AuthSignUpService } from '../../../src/infrastructure/services/auth-sign-up';
import { AccountsBuilder } from '../../builders/accounts';
import { PostgresAccountsBuilder } from '../../builders/postgres-accounts';
import { prismaMockClient } from '../../setup';

describe('SignUpService', () => {
  beforeAll(() => {
    TokenJwt.config({
      secretOrPrivateKey: '92bf7dcd-5089-40a2-b623-af1f502a5e0e',
      expiresIn: '1h',
    });
  });

  it('should be return a accounts if username and email is available', async () => {
    mockAccountsDatabase();
    const account = new AccountsBuilder().build();
    const { signUpService } = makeSut();

    const token = await signUpService.signUp(account.username, account.email, account.password ?? '');
    expect(token.isValid()).toBeTruthy();
  });

  it('should be throw if username or email is used', async () => {
    const account = new PostgresAccountsBuilder().build();
    mockAccountsDatabase([account]);
    const { signUpService } = makeSut();
    const promise = signUpService.signUp(account.username, account.email, account.password);
    await expect(promise).rejects.toThrowError('Email or username is already in use');
  });

  it('should be throw if invalid email', async () => {
    const { signUpService } = makeSut();

    const promise = signUpService.signUp('username', 'email', 'password');
    await expect(promise).rejects.toThrowError('Invalid email');
  });
});

function mockAccountsDatabase(accounts: Accounts[] = []): void {
  prismaMockClient.accounts.findMany.mockResolvedValue(accounts);
}

function makeSut() {
  const signUpService = new AuthSignUpService(
    diContainer.get(Encrypt),
    diContainer.get(AccountRepository),
  );
  return { signUpService };
}
