import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import mongoose, { Document, Schema as MongooseSchema } from 'mongoose';
export type UserDocument = User & Document;

@Schema()
export class User extends Document {

 
  @Prop({ required: true })
  lastName: string;

  @Prop()
  password: string;


  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  confirmPassword: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  dob: string;

  @Prop({ type: String })
  confirmationToken: string;

  @Prop({ default: false }) 
  isConfirmed: boolean;

}
export interface Users {
  id: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  dob: string;

}

export const UserSchema = SchemaFactory.createForClass(User);
