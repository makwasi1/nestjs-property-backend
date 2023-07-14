import { Document } from "mongoose";

export interface IUsers extends Document {
     email: string;
     name: string;
     password: string;
     createdAt: string;
}