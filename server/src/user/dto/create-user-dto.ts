import { Prop } from '@nestjs/mongoose';
import { IsIn, IsNotEmpty, IsString, Matches, Validate } from 'class-validator';
import { PasswordComplexityValidator } from './password.validator';

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

export class CreateDto {
  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @IsNotEmpty()
  @Validate(PasswordComplexityValidator)
  password: string;

  @IsNotEmpty()
  confirmPassword: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  phoneNumber: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  dob: string;

  @Prop({ type: String })
  confirmationToken: string;
  
}
