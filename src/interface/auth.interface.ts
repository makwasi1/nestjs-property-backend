import { Document } from "mongoose";

export interface IUsers extends Document {
     email: string;
     name: number;
     password: number;
     createdAt: string;
}