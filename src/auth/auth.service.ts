/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { UserService } from 'src/modules/users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  private generateToken(userId: unknown) {
    return this.jwtService.sign({ sub: userId });
  }
  async signup(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.userService.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return {
      token: this.generateToken(user._id),
      user,
    };
  }
  async login(logninDto: LoginDto) {
    const user = await this.userService.findByEmail(logninDto.email);
    const comaprePassword = await bcrypt.compare(
      logninDto.password,
      user.password,
    );
    if (!user || !comaprePassword) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return {
      token: this.generateToken(user._id),
      user,
    };
  }
}
