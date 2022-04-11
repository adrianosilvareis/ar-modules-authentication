import { Container } from 'inversify';

import { Encrypt } from '../domain/libraries/encrypt';
import { EncryptBcrypt } from '../infrastructure/libraries/encrypt-bcrypt';
import { SignUpService } from '../infrastructure/services/sign-up';

export const diContainer = new Container();

diContainer.bind(SignUpService).toSelf();
diContainer.bind(Encrypt).to(EncryptBcrypt);
