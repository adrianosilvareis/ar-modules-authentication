import { injectable } from 'inversify';

@injectable()
export abstract class Encrypt {
  public abstract encryptPassword(_password: string): Promise<string>;

  public abstract comparePassword(_password: string, _encryptedPassword: string): Promise<boolean>;
}
