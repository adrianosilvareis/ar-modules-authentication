import { Accounts } from '@prisma/client';

import { diContainer } from '../../../src/config/di-container';
import { NotFoundError } from '../../../src/domain/erros';
import { BadRequestError } from '../../../src/domain/erros/bad-request';
import { InvalidPasswordError } from '../../../src/domain/erros/invalid-password';
import { Encrypt } from '../../../src/domain/libraries/encrypt';
import { AccountRepository } from '../../../src/domain/repositories/account';
import { TokenJwt } from '../../../src/infrastructure/libraries/token-jwt';
import { AuthSignInService } from '../../../src/infrastructure/services/auth-sign-in';
import { PostgresAccountsBuilder } from '../../builders/postgres-accounts';
import { prismaMockClient } from '../../setup';

describe('SignInService', () => {
  beforeAll(() => {
    TokenJwt.config({
      secretOrPrivateKey: '92bf7dcd-5089-40a2-b623-af1f502a5e0e',
      expiresIn: '1h',
    });
  });

  it('should be return a accounts if correct credentials', async () => {
    const email = 'email@email.com';
    const password = 'password';
    const accounts = new PostgresAccountsBuilder()
      .with('isLoggedIn', false)
      .with('email', email)
      .with('password', password)
      .buildMany(1);

    const { signInService } = makeSut(accounts);

    const token = await signInService.signIn(email, password);
    expect(token.isValid()).toBeTruthy();
  });

  it('should be throw if username or email not found', async () => {
    const { signInService } = makeSut([]);
    const promise = signInService.signIn('email@email.com', 'any_password');
    await expect(promise).rejects.toThrow(new NotFoundError('Account not found'));
  });

  it('should be throw if invalid email', async () => {
    const { signInService } = makeSut(undefined, mockEncrypt('', false));

    const promise = signInService.signIn('username', 'password');
    await expect(promise).rejects.toThrow(new InvalidPasswordError());
  });

  it('should be throw if user already logged', async () => {
    const { signInService } = makeSut();

    const promise = signInService.signIn('username', 'password');
    await expect(promise).rejects.toThrowError(new BadRequestError('Account already logged in'));
  });
});

function makeSut(accounts?:Accounts[], encrypt = mockEncrypt()) {
  if (accounts === undefined) {
    // eslint-disable-next-line no-param-reassign
    accounts = [new PostgresAccountsBuilder().build()];
  }
  prismaMockClient.accounts.findMany.mockResolvedValue(accounts);

  const signInService = new AuthSignInService(
    encrypt,
    diContainer.get(AccountRepository),
  );
  return { signInService, accounts };
}

function mockEncrypt(token: string = '', match: boolean = true): Encrypt {
  class MockEncrypt extends Encrypt {
    // eslint-disable-next-line no-unused-vars
    public encryptPassword(_password: string): Promise<string> {
      return Promise.resolve(token);
    }

    // eslint-disable-next-line no-unused-vars
    public comparePassword(_password: string, _encryptedPassword: string): Promise<boolean> {
      return Promise.resolve(match);
    }
  }

  return new MockEncrypt();
}
