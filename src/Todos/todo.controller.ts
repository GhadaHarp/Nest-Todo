import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { Todo } from './models/todo.model';
import { CreateTodoDto } from './dtos/create-todo.dto';
import { UpdateTodoDto } from './dtos/update-todo.dto';
interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}
@Controller('todos')
export class TodoController {
  constructor(private todoService: TodoService) {}

  @Post()
  async create(
    @Body() createTodoDto: CreateTodoDto,
  ): Promise<ApiResponse<Todo>> {
    return this.todoService.create(createTodoDto).then((todo) => ({
      status: true,
      message: 'Todo created successfully',
      data: todo,
    }));
  }
  @Get()
  async findAll(): Promise<ApiResponse<Todo[]>> {
    return this.todoService.findAll().then((todos) => ({
      status: true,
      message: 'Todos fetched successfully',
      data: todos,
    }));
  }
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse<Todo>> {
    const todo = await this.todoService.findOne(id);
    return {
      status: true,
      message: 'Todo fetched successfully',
      data: todo,
    };
  }
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ApiResponse<null>> {
    await this.todoService.remove(id);
    return {
      status: true,
      message: 'Todo deleted successfully',
      data: null,
    };
  }
  @Patch(':id')
  async updated(
    @Param('id') id: string,
    @Body() updatedTodoDto: UpdateTodoDto,
  ): Promise<ApiResponse<Todo>> {
    const todo = await this.todoService.update(id, updatedTodoDto);
    return {
      status: true,
      message: 'Todo updated successfully',
      data: todo,
    };
  }
}
