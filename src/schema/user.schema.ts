import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import { IsEmail } from 'class-validator';

@Schema()
export class User {
    @Prop()
    name: string;

    @Prop()
    email: string;

    @Prop()
    password: string;

    @Prop()
    created_at: string;

 
}

export const UsersSchema = SchemaFactory.createForClass(User)