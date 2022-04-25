import { Auth } from '../../../src';
import { diContainer } from '../../../src/config/di-container';
import { SignUpService } from '../../../src/domain/services/sign-up';
import { prismaMockClient } from '../../setup';

describe('Auth', () => {
  beforeEach(() => {
    Auth.config({
      jwt: {
        secret: 'test',
        expirationTime: '1h',
      },
    });
  });

  it('should throw if not configured before create instance', () => {
    Auth.config(undefined);
    expect(() => new Auth(diContainer.get(SignUpService))).toThrow();
  });

  it('should be create account when signUp', async () => {
    prismaMockClient.accounts.findMany.mockResolvedValue([]);
    const token = await new Auth(diContainer.get(SignUpService)).signUp('username', 'email@email.com', 'password');
    expect(token.isValid()).toBeTruthy();
  });
});
