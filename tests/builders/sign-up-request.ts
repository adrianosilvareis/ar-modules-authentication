import { Builder } from '@libs/entity-builder';

import { SignUpRequest } from '../../src';

export class SignUpRequestBuilder extends Builder<SignUpRequest, SignUpRequestBuilder> {
  public constructor() {
    super(SignUpRequestBuilder);
  }

  protected buildDefault(): SignUpRequest {
    return new SignUpRequest({
      username: 'username',
      email: 'email@email.com',
      password: '12345678',
    });
  }
}
