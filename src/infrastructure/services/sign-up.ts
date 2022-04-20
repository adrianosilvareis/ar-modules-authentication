import validator from 'email-validator';
import { injectable, inject } from 'inversify';

import { AccountParams, Accounts } from '../../domain/entities/accounts';
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
    this.validateEmail(email);

    await this.isAvailableEmailOrUsername(username, email);

    const [account, token] = await this.toAccountDomain({ username, email, password });

    await this.saveAccount(account.getData());

    return token;
  }

  private validateEmail(email: string): void {
    if (!validator.validate(email)) {
      throw new Error('Invalid email');
    }
  }

  private async isAvailableEmailOrUsername(username: string, email: string): Promise<void> {
    const found = await client.accounts.findMany({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (found.length !== 0) {
      throw new Error('Email or username is already taken');
    }
  }

  private async toAccountDomain(params: Required<Omit<AccountParams, 'token'>>): Promise<[Accounts, Token]> {
    const { username, email, password } = params;

    const encryptedPassword = await this.encrypt.encryptPassword(password);

    const account = Accounts.create({ username, email, password: encryptedPassword });

    const token = new TokenJwt({ ...account });

    account.token = token.getToken();

    return [account, token];
  }

  private async saveAccount(data: Required<AccountParams>): Promise<void> {
    await client.accounts.create({ data });
  }
}
