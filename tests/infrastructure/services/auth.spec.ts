import { Auth } from '../../../src';
import { prismaMockClient } from '../../setup';

describe('Auth', () => {
  beforeEach(() => {
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

    prismaMockClient.accounts.findMany.mockResolvedValue([]);
  });

  it('should throw if config is not defined', async () => {
    Auth.config();
    expect(Auth.get).toThrowError('Auth.config is not defined');
  });

  it('should be create a instance of auth with params', () => {
    expect(Auth.get()).toBeDefined();
  });

  it('should be create account when signUp', async () => {
    const token = await Auth.get().signUp('username', 'email@email.com', 'password');
    expect(token.isValid()).toBeTruthy();
  });
});
