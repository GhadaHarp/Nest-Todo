import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name is required.' })
  @IsString()
  username: string;
  @IsNotEmpty({ message: 'Email is required.' })
  @IsEmail({}, { message: 'Invalid Email Format.' })
  email: string;
  @IsNotEmpty()
  @IsString()
  password: string;
}
