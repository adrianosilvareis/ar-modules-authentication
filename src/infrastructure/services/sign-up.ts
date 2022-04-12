import validator from 'email-validator';
import { injectable, inject } from 'inversify';

import { Accounts } from '../../domain/entities/accounts';
import { Encrypt } from '../../domain/libraries/encrypt';
import { TokenJwt } from '../libraries/token-jwt';
import client from '../../config/database-client';
import { Token } from '../../domain/libraries/token';

@injectable()
export class SignUpService {
  public constructor(
    @inject(Encrypt) private readonly encrypt: Encrypt,
  ) {}

  public async signUp(username: string, email: string, password: string): Promise<Token> {
    if (!this.validateEmail(email)) {
      throw new Error('Invalid email');
    }
    const isAvailable = await this.isAvailableEmailOrUsername(username, email);
    if (!isAvailable) {
      throw new Error('Email or username is already taken');
    }
    const encryptedPassword = await this.encrypt.encryptPassword(password);

    const account = Accounts.create({ username, email, password: encryptedPassword });

    const token = new TokenJwt({ ...account });

    account.token = token.getToken();

    await client.accounts.create({
      data: account.getData(),
    });

    return token;
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
