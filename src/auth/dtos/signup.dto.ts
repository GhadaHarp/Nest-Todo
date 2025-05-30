/* eslint-disable prettier/prettier */
import { IsEmail, IsEmpty, MinLength } from 'class-validator';

export class SignupDto {
  @IsEmpty({ message: 'Username is required.' })
  username: string;
  @IsEmpty({ message: 'Email is required.' })
  @IsEmail({}, { message: 'Invalid Email Format.' })
  email: string;

  @IsEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must have at least 6 characters.' })
  password: string;
}
