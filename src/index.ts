import 'reflect-metadata';

export { diContainer as diAuthContainer } from './config/di-container';

// entity
export { Accounts } from './domain/entities/accounts';

// presentation
export { SignUpRequest } from './domain/presentation/sign-up-request';
export { SignUpResponse } from './domain/presentation/sign-up-response';

// interfaces
export { SignUpService } from './domain/services/sign-up';
export { SignInService } from './domain/services/sign-in';

// implementations
export { TokenJwt as Token } from './infrastructure/libraries/token-jwt';
export { Auth } from './infrastructure/services/auth';

export * as Error from './domain/erros';
