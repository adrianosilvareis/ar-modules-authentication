import validator from 'email-validator';
import { injectable, inject } from 'inversify';

import { Accounts } from '../../domain/entities/accounts';
import { Encrypt } from '../../domain/libraries/encrypt';
import { Token } from '../libraries/token';
import client from '../../config/database-client';

@injectable()
export class SignUpService {
  public constructor(
    @inject(Encrypt) private readonly encrypt: Encrypt,
  ) {}

  public async signUp(username: string, email: string, password: string): Promise<string> {
    if (!this.validateEmail(email)) {
      throw new Error('Invalid email');
    }
    const isAvailable = await this.isAvailableEmailOrUsername(username, email);
    if (!isAvailable) {
      throw new Error('Email or username is already taken');
    }
    const encryptedPassword = await this.encrypt.encryptPassword(password);

    const account = Accounts.create({ username, email, password: encryptedPassword });

    account.token = await Token.encrypt({ ...account });

    await client.accounts.create({
      data: account.getData(),
    });

    return account.token;
  }

  private validateEmail(email: string): boolean {
    return validator.validate(email);
  }

  private async isAvailableEmailOrUsername(username: string, email: string): Promise<boolean> {
    const found = await client.accounts.findMany({
      where: {
        OR: [{ username }, { email }],
      },
    });

    return found.length === 0;
  }
}
