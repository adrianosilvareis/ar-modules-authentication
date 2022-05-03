import validator from 'email-validator';
import { injectable, inject } from 'inversify';

import { AccountParams, Accounts } from '../../domain/entities/accounts';
import { Encrypt } from '../../domain/libraries/encrypt';
import { TokenJwt } from '../libraries/token-jwt';
import { Token } from '../../domain/libraries/token';
import { SignUpService } from '../../domain/services/sign-up';
import { AccountRepository } from '../../domain/repositories/account';
import { InvalidEmailError } from '../../domain/erros';

@injectable()
export class AuthSignUpService extends SignUpService {
  public constructor(
    @inject(Encrypt) private readonly encrypt: Encrypt,
    @inject(AccountRepository) private readonly repo: AccountRepository,
  ) {
    super();
  }

  public async signUp(username: string, email: string, password: string): Promise<Token> {
    this.validateEmail(email);

    await this.repo.isAvailableEmailOrUsername(username, email);

    const [account, token] = await this.toAccountDomain({ username, email, password });

    await this.repo.saveAccount(account.getData());

    return token;
  }

  private validateEmail(email: string): void {
    if (!validator.validate(email)) {
      throw new InvalidEmailError(email);
    }
  }

  private async toAccountDomain(params: Required<Omit<AccountParams, 'token' | 'isLoggedIn' | 'lastAccess'>>): Promise<[Accounts, Token]> {
    const { username, email, password } = params;

    const encryptedPassword = await this.encrypt.encryptPassword(password);

    const account = Accounts.create({ username, email, password: encryptedPassword });

    const token = new TokenJwt({ ...account });

    account.token = token.getToken();

    return [account, token];
  }
}
