 import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { User } from 'src/modules/users/entities/user.entity';
interface ApiResponse<T> {
  status: boolean;
  message: string;
  token: string;
  data: T;
}
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signup')
  async signUp(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ApiResponse<User>> {
    const res = await this.authService.signup(createUserDto);
    return {
      status: true,
      message: 'success',
      token: res.token,
      data: res.user,
    };
  }
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<ApiResponse<User>> {
    const res = await this.authService.login(loginDto);
    return {
      status: true,
      message: 'success',
      token: res.token,
      data: res.user,
    };
  }
}
