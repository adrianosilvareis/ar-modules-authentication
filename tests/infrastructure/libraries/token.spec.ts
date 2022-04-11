import { Token } from '../../../src';

type payloadType = {
  value: string;
  refreshTime?:number
}

const payload: payloadType = { value: 'test' };

describe('Token', () => {
  beforeEach(() => {
    Token.environments = {
      secretOrPrivateKey: '92bf7dcd-5089-40a2-b623-af1f502a5e0e',
      expirationTime: '1h',
    };
  });

  it('should throw if environments not provided', async () => {
    // given
    Token.environments.secretOrPrivateKey = '';

    // when
    const promise = Token.encrypt(payload);

    // then
    await expect(promise).rejects.toThrowError('Token.environments is not defined');
  });

  it('should return a valid token when encrypt', async () => {
    // when
    const token = await Token.encrypt(payload);

    // then
    expect(token).toBeDefined();
    expect(token.split('.').length).toBe(3);
    expect(Token.validate(token)).toBeTruthy();
  });

  it('should be able refresh valid token', async () => {
    // given
    const token = await Token.encrypt(payload);

    // when
    const refreshedToken = await Token.refresh(token);

    // then
    expect(refreshedToken).not.toBe(token);
    expect(refreshedToken).toBeDefined();
    expect(refreshedToken.split('.').length).toBe(3);
    expect(Token.validate(refreshedToken)).toBeTruthy();
  });

  it('should be contain a refreshTime count', async () => {
    // given
    const token = await Token.encrypt(payload);

    // when
    const refreshedTokenFist = await Token.refresh(token);
    const refreshedToken = await Token.refresh(refreshedTokenFist);

    // then
    expect(refreshedToken).not.toBe(token);
    expect(refreshedToken).not.toBe(refreshedTokenFist);
    expect(refreshedToken).toBeDefined();
    expect(refreshedToken.split('.').length).toBe(3);
    expect(Token.validate(refreshedToken)).toBeTruthy();

    const decoded = await Token.decoded<payloadType>(refreshedToken);

    expect(decoded).toBeDefined();
    expect(decoded.refreshTime).toEqual(1);
  });

  it('should be able decoded a valid token', async () => {
    // given
    const token = await Token.encrypt(payload);

    // when
    const decoded = await Token.decoded<payloadType>(token);

    // then
    expect(decoded).toBeDefined();
    expect(decoded).toEqual(payload);
  });
});
