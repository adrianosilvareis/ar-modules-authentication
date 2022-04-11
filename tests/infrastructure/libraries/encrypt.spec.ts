import { EncryptBcrypt } from '../../../src/infrastructure/libraries/encrypt-bcrypt';

describe('Encrypt', () => {
  it('should encrypt a password and compare', async () => {
    const encrypt = new EncryptBcrypt();

    const password = 'password';
    const encryptedPassword = await encrypt.encryptPassword(password);
    expect(encryptedPassword).toBeDefined();
    expect(encryptedPassword).not.toBe(password);

    const match = await encrypt.comparePassword(password, encryptedPassword);
    expect(match).toBeTruthy();
  });
});
