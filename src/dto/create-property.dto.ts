import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";

export class CreatePropertyDto {
    @IsString()
    @IsNotEmpty()
    readonly propertyName: string;

    @IsString()
    readonly plotNumber: string;

    @IsString()
    readonly description: string;

    @IsString()
    status: string;

    @IsString()
    readonly propertyType: string;

    @IsString()
    readonly userId: string;

    @IsString()
    readonly createdAt: Date;
}