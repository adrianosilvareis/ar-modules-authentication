import { validate } from 'class-validator';

import { SignUpRequestBuilder } from '../../builders/sign-up-request';

describe('SignUpRequest', () => {
  it('should be report invalid values', async () => {
    const signUpRequest = new SignUpRequestBuilder()
      .with('email', 'invalidEmail')
      .build();
    const [error] = await validate(signUpRequest);
    expect(error.constraints).toEqual({ isEmail: 'email must be an email' });
  });

  it('should be validate a values', async () => {
    const signUpRequest = new SignUpRequestBuilder().build();
    const valid = await validate(signUpRequest);
    expect(valid).toHaveLength(0);
  });
});
