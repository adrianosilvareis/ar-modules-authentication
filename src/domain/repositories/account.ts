import { injectable } from 'inversify';

import { AccountParams, Accounts } from '../entities/accounts';

@injectable()
export abstract class AccountRepository {
  public abstract isAvailableEmailOrUsername(username: string, email: string): Promise<void>;

  public abstract saveAccount(data: Required<AccountParams>): Promise<void>;

  public abstract updateAccount(data: Accounts): Promise<void>;

  public abstract findAccountByEmailOrUsername(emailOrUsername: string):Promise<Accounts>;
}
