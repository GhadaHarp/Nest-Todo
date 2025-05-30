import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Todo } from './models/todo.model';
import { CreateTodoDto } from './dtos/create-todo.dto';
import { UpdateTodoDto } from './dtos/update-todo.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class TodoService {
  constructor(
    @InjectModel(Todo.name) private readonly todoModel: Model<Todo>,
  ) {}
  async create(createTodoDto: CreateTodoDto) {
    const createdTodo = new this.todoModel({
      ...createTodoDto,
      user: createTodoDto.user,
    });
    return createdTodo.save();
  }

  async findAll(): Promise<Todo[]> {
    return this.todoModel.find().populate('user').exec();
  }

  async findOne(id: string): Promise<Todo> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    const todo = await this.todoModel.findById(id).populate('user').exec();
    if (!todo) {
      throw new NotFoundException('Todo Not Found');
    }

    return todo;
  }
  async update(id: string, updateDto: UpdateTodoDto): Promise<Todo> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    const todo = await this.todoModel
      .findByIdAndUpdate(id, updateDto, {
        new: true,
        runValidators: true,
      })
      .populate('user')
      .exec();
    if (!todo) throw new NotFoundException('Todo Not Found');
    return todo;
  }

  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    const result = await this.todoModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Todo Not Found');
  }
}
