import { Accounts, SignUpResponse } from '../../../src';

describe('SignUpResponse', () => {
  it('should parse response to text', () => {
    const account = Accounts.create({
      username: 'username',
      email: 'email@email.com',
    });

    const response = new SignUpResponse(account);

    const textResponse = response.toPlan();
    expect(typeof textResponse).toBe('string');
    expect(textResponse.includes('username')).toBeTruthy();
    expect(textResponse.includes('email')).toBeTruthy();
  });

  it('should parse text to instance', () => {
    const account = Accounts.create({
      username: 'username',
      email: 'email@email.com',
    });

    const response = new SignUpResponse(account);

    const textResponse = response.toPlan();

    const parsedResponse = SignUpResponse.fromPlan(textResponse);
    expect(parsedResponse).toBeInstanceOf(SignUpResponse);
    expect(parsedResponse.username).toBe(account.username);
    expect(parsedResponse.email).toBe(account.email);
  });
});
