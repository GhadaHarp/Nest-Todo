import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().select('-password').populate('todos').exec();
  }

  async findOne(id: string): Promise<User> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    const user = await this.userModel
      .findById(id)
      .select('-password')
      .populate('todos')
      .exec();
    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    return user;
  }
  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel
      .findOne({ email })
      .populate('todos')
      .exec();
    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    return user;
  }

  async update(id: string, updateDto: UpdateUserDto): Promise<User> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    const user = await this.userModel.findByIdAndUpdate(id, updateDto, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    return user;
  }

  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    const result = await this.userModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException('User Not Found');
    }
  }
}
