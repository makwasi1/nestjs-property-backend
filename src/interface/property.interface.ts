import { Document } from "mongoose";

export interface IProperty extends Document {
    readonly propertName: string;
    readonly plotNumber: string;
    readonly description: string;
    readonly propertyType: string;
    readonly userId: string;
    status: string;
    readonly createdAt: Date;
}