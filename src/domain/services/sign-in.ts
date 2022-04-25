import { injectable } from 'inversify';

import { Token } from '../libraries/token';

@injectable()
export abstract class SignInService {
  abstract signIn(usernameOrEmail: string, password: string): Promise<Token>;
}
