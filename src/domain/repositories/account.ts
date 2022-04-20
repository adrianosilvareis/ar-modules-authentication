import { injectable } from 'inversify';

import { AccountParams } from '../entities/accounts';

@injectable()
export abstract class AccountRepository {
  public abstract isAvailableEmailOrUsername(username: string, email: string): Promise<void>;

  public abstract saveAccount(data: Required<AccountParams>): Promise<void>;
}
