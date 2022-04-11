import { Token } from '../../../src';
import { EncryptBcrypt } from '../../../src/infrastructure/libraries/encrypt-bcrypt';
import { SignUpService } from '../../../src/infrastructure/services/sign-up';
import { prismaMockClient } from '../../setup';

describe('SignUpService', () => {
  beforeAll(() => {
    Token.environments = {
      secretOrPrivateKey: '92bf7dcd-5089-40a2-b623-af1f502a5e0e',
      expirationTime: '1h',
    };
  });
  it('should be return a accounts if username and email is available', async () => {
    prismaMockClient.accounts.findMany.mockResolvedValue([]);
    const signUpService = new SignUpService(new EncryptBcrypt());
    const username = 'username';
    const email = 'email@email.com';
    const password = 'password';

    const token = await signUpService.signUp(username, email, password);
    expect(Token.validate(token)).toBeTruthy();
  });

  it('should be throw if username or email is used', async () => {
    const account = {
      id: 'id',
      username: 'username',
      email: 'email@email.com',
      password: 'password',
      token: 'token',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prismaMockClient.accounts.findMany.mockResolvedValue([account]);

    const signUpService = new SignUpService(new EncryptBcrypt());

    const promise = signUpService.signUp(account.username, account.email, account.password);
    await expect(promise).rejects.toThrowError('Email or username is already taken');
  });

  it('should be throw if invalid email', async () => {
    const signUpService = new SignUpService(new EncryptBcrypt());

    const promise = signUpService.signUp('username', 'email', 'password');
    await expect(promise).rejects.toThrowError('Invalid email');
  });
});
