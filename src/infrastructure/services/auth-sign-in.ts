import { injectable, inject } from 'inversify';

import { Encrypt } from '../../domain/libraries/encrypt';
import { TokenJwt } from '../libraries/token-jwt';
import { Token } from '../../domain/libraries/token';
import { AccountRepository } from '../../domain/repositories/account';
import { SignInService } from '../../domain/services/sign-in';

@injectable()
export class AuthSignInService extends SignInService {
  public constructor(
    @inject(Encrypt) private readonly encrypt: Encrypt,
    @inject(AccountRepository) private readonly repo: AccountRepository,
  ) {
    super();
  }

  public async signIn(usernameOrEmail: string, password: string): Promise<Token> {
    const account = await this.repo.findAccountByEmailOrUsername(usernameOrEmail);
    const match = await this.encrypt.comparePassword(password, account.password ?? '');

    if (!match) {
      throw new Error('Invalid password');
    }
    // before create a new token verify if account is logged, throw if true
    const token = new TokenJwt({ ...account });
    account.token = token.getToken();

    // add isLoggedIn flag / add lastAccess data
    await this.repo.updateAccount(account);

    return token;
  }
}
