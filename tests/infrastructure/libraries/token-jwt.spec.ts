import mockdate from 'mockdate';

import { TokenJwt } from '../../../src/infrastructure/libraries/token-jwt';

describe('TokenJwt', () => {
  const payload = { payload: 'test' };

  it('should throw if environments not provided', async () => {
    expect(() => new TokenJwt(payload)).toThrowError('Token.environments is not defined');
  });

  it('should generate token when create a instance', async () => {
    TokenJwt.config({
      secretOrPrivateKey: 'secret',
      expiresIn: '1s',
    });
    const token = new TokenJwt(payload);

    expect(token.getToken()).toBeDefined();
    expect(token.isValid()).toBeTruthy();
  });

  it('should throw if token is expired', async () => {
    TokenJwt.config({
      secretOrPrivateKey: 'secret',
      expiresIn: '1s',
    });
    const token = new TokenJwt(payload);

    mockdate.set(Date.now() + 1100);

    expect(token.isValid()).toBeFalsy();
    expect(token.isExpired()).toBeTruthy();
    expect(() => token.getPayload()).toThrowError('Token is expired');
    expect(() => token.reloadToken()).toThrowError('Token is expired');
  });

  it('should reload token when call reloadToken', async () => {
    TokenJwt.config({
      secretOrPrivateKey: 'secret',
      expiresIn: '1h',
    });
    const token = new TokenJwt(payload);

    mockdate.set(Date.now() + 1000);
    const originalToken = token.getToken();

    expect(originalToken).toBeDefined();
    expect(token.isValid()).toBeTruthy();
    expect(token.isExpired()).toBeFalsy();
    expect(token.reloadToken()).not.toBe(originalToken);
  });

  it('should get payload when call getPayload', async () => {
    TokenJwt.config({
      secretOrPrivateKey: 'secret',
      expiresIn: '1h',
    });
    const token = new TokenJwt(payload);

    expect(token.getPayload()).toEqual(payload);
  });
});
