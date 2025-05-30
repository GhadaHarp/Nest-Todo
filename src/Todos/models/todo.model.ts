import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { User } from 'src/modules/users/entities/user.entity';

@Schema()
export class Todo extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ default: false })
  isCompleted: boolean;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user?: Types.ObjectId;
}
export const TodoScema = SchemaFactory.createForClass(Todo);
