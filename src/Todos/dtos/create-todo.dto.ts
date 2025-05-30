import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateTodoDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsString()
  @IsNotEmpty()
  @IsMongoId({ message: 'Invalid user ID.' })
  user: string;
}
