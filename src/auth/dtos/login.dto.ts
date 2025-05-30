/* eslint-disable prettier/prettier */
import { IsEmail, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Invalid Email Format.' })
  email: string;

  @MinLength(6, { message: 'Password must have at least 6 characters.' })
  password: string;
}
