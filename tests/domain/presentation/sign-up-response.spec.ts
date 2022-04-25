import { SignUpResponse, Token } from '../../../src';
import { TokenJwt } from '../../../src/infrastructure/libraries/token-jwt';
import { SignUpRequestBuilder } from '../../builders/sign-up-request';

describe('SignUpResponse', () => {
  beforeAll(() => {
    TokenJwt.config({
      secretOrPrivateKey: 'secretOrPrivateKey',
      expiresIn: '1s',
    });
  });

  it('should parse response to text', () => {
    const payload = new SignUpRequestBuilder().build();
    const token = new TokenJwt(payload);

    const response = new SignUpResponse(token);

    const textResponse = response.toPlan();
    expect(typeof textResponse).toBe('string');
    expect(TokenJwt.setToken(textResponse).isValid()).toBeTruthy();
  });

  it('should parse text to instance', () => {
    const payload = new SignUpRequestBuilder().build();
    const token = new TokenJwt(payload);

    const response = new SignUpResponse(token);

    const textResponse = response.toPlan();

    const parsedResponse = SignUpResponse.fromPlan(textResponse);
    expect(parsedResponse).toBeInstanceOf(Token);
    expect(parsedResponse.getPayload()).toEqual(payload);
  });
});
