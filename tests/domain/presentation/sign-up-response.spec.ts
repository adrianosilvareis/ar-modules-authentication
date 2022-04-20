import { SignUpResponse, Token } from '../../../src';
import { TokenJwt } from '../../../src/infrastructure/libraries/token-jwt';

describe('SignUpResponse', () => {
  beforeAll(() => {
    TokenJwt.config({
      secretOrPrivateKey: 'secretOrPrivateKey',
      expiresIn: '1s',
    });
  });

  it('should parse response to text', () => {
    const token = new TokenJwt({
      username: 'username',
      email: 'email@email.com',
    });

    const response = new SignUpResponse(token);

    const textResponse = response.toPlan();
    expect(typeof textResponse).toBe('string');
    expect(TokenJwt.setToken(textResponse).isValid()).toBeTruthy();
  });

  it('should parse text to instance', () => {
    const payload = {
      username: 'username',
      email: 'email@email.com',
    };
    const token = new TokenJwt(payload);

    const response = new SignUpResponse(token);

    const textResponse = response.toPlan();

    const parsedResponse = SignUpResponse.fromPlan(textResponse);
    expect(parsedResponse).toBeInstanceOf(Token);
    expect(parsedResponse.getPayload()).toEqual(payload);
  });
});
