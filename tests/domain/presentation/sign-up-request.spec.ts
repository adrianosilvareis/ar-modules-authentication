import { validate } from 'class-validator';

import { SignUpRequest } from '../../../src';

describe('SignUpRequest', () => {
  it('should be report invalid values', async () => {
    const signUpRequest = new SignUpRequest({
      username: 'username',
      password: 'password',
      email: 'email',
    });
    const [error] = await validate(signUpRequest);
    expect(error.constraints).toEqual({ isEmail: 'email must be an email' });
  });

  it('should be validate a values', async () => {
    const signUpRequest = new SignUpRequest({
      username: 'username',
      password: 'password',
      email: 'email@email.com',
    });
    const valid = await validate(signUpRequest);
    expect(valid).toHaveLength(0);
  });
});
