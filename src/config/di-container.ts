import { Container } from 'inversify';

import { Encrypt } from '../domain/libraries/encrypt';
import { AccountRepository } from '../domain/repositories/account';
import { SignUpService } from '../domain/services/sign-up';
import { EncryptBcrypt } from '../infrastructure/libraries/encrypt-bcrypt';
import { PostgresAccountRepository } from '../infrastructure/repositories/postgres-account';
import { AuthSignUpService } from '../infrastructure/services/auth-sign-up';

export const diContainer = new Container();

diContainer.bind(SignUpService).to(AuthSignUpService);
diContainer.bind(Encrypt).to(EncryptBcrypt);
diContainer.bind(AccountRepository).to(PostgresAccountRepository);
