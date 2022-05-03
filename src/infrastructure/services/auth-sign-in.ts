import { injectable, inject } from 'inversify';

import { Encrypt } from '../../domain/libraries/encrypt';
import { TokenJwt } from '../libraries/token-jwt';
import { Token } from '../../domain/libraries/token';
import { AccountRepository } from '../../domain/repositories/account';
import { SignInService } from '../../domain/services/sign-in';
import { InvalidPasswordError } from '../../domain/erros/invalid-password';
import { BadRequestError } from '../../domain/erros/bad-request';

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

    await this.comparePassword(password, account.password);

    if (account.isLoggedIn) {
      throw new BadRequestError('Account already logged in');
    }

    const token = account.makeLoggingIn(TokenJwt);

    await this.repo.updateAccount(account);

    return token;
  }

  private async comparePassword(password: string, passwordEncrypted: string = ''): Promise<void> {
    const match = await this.encrypt.comparePassword(password, passwordEncrypted);

    if (!match) {
      throw new InvalidPasswordError();
    }
  }
}
