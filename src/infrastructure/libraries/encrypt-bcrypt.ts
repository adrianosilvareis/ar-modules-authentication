import bcrypt from 'bcrypt';
import { injectable } from 'inversify';

import { Encrypt } from '../../domain/libraries/encrypt';

@injectable()
export class EncryptBcrypt implements Encrypt {
  public encryptPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  public comparePassword(password: string, encryptedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, encryptedPassword);
  }
}
