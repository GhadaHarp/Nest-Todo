import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/role.decorator';

interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ApiResponse<User>> {
    const user = await this.userService.create(createUserDto);
    return {
      status: true,
      message: 'User created successfully',
      data: user,
    };
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  async findAll(): Promise<ApiResponse<User[]>> {
    const users = await this.userService.findAll();
    return {
      status: true,
      message: 'Users fetched successfully',
      data: users,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse<User>> {
    const user = await this.userService.findOne(id);
    return {
      status: true,
      message: 'User fetched successfully',
      data: user,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<ApiResponse<User>> {
    const user = await this.userService.update(id, dto);
    return {
      status: true,
      message: 'User updated successfully',
      data: user,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ApiResponse<null>> {
    await this.userService.remove(id);
    return {
      status: true,
      message: 'User deleted successfully',
      data: null,
    };
  }
}
