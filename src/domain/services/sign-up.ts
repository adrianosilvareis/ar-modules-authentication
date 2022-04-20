import { injectable } from 'inversify';

import { Token } from '../libraries/token';

@injectable()
export abstract class SignUpService {
  abstract signUp(username: string, email: string, password: string): Promise<Token>;
}
