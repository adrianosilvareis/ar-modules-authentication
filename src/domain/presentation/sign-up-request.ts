import { IsEmail, Length } from 'class-validator';

export class SignUpRequest {
  @Length(6, 15)
  public username!: string;

  @IsEmail()
  public email!: string;

  @Length(8, 20)
  public password!: string;

  public constructor(init?: Partial<SignUpRequest>) {
    Object.assign(this, init);
  }
}
