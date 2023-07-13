import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MaxLength,
    MinLength,} from 'class-validator';

    export class LoginDto {
        @IsEmail()
        @IsNotEmpty()
        email: string;
    
        @IsString()
        @MinLength(6)
        @MaxLength(30)
        @IsNotEmpty()
        password: string;
    }