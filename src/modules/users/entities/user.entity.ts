import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
export enum UserRole {
  User = 'user',
  ADMIN = 'admin',
}
@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform(doc, ret) {
      delete ret.id;
    },
  },
  toObject: { virtuals: true },
})
export class User extends Document {
  @Prop({ required: true })
  username: string;
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: UserRole.User })
  role: UserRole;
}
const UserSchema = SchemaFactory.createForClass(User);
UserSchema.virtual('todos', {
  ref: 'Todo',
  localField: '_id',
  foreignField: 'user',
});
export { UserSchema };
