import { Auth, Token } from '../../../src';
import { prismaMockClient } from '../../setup';

describe('Auth', () => {
  beforeEach(() => {
    prismaMockClient.accounts.findMany.mockResolvedValue([]);
  });

  it('should be create a instance of auth with params', () => {
    Auth.config({
      jwt: {
        secret: 'test',
        expirationTime: '1h',
      },
      cache: {
        timeout: 10000,
        host: 'localhost',
        port: 6379,
      },
    });

    expect(Auth.get()).toBeDefined();
  });

  it('should be create account when signUp', async () => {
    Auth.config({
      jwt: {
        secret: 'test',
        expirationTime: '1h',
      },
      cache: {
        timeout: 10000,
        host: 'localhost',
        port: 6379,
      },
    });
    const token = await Auth.get().signUp('username', 'email@email.com', 'password');
    expect(Token.validate(token)).toBeTruthy();
  });
});
