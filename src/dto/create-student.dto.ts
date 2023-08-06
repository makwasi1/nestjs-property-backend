import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";

export class CreateStudentDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    readonly name: string;

    @IsNumber()
    @IsNotEmpty()
    readonly roleNumber: number;

    @IsNumber()
    @IsNotEmpty()
    readonly class: number;

    @IsString()
    @MaxLength(30)
    @IsNotEmpty()
    readonly gender: string;

    @IsNumber()
    @IsNotEmpty()
    readonly marks: number;
}