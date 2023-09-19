import { IsDefined, IsEmail, IsNotEmpty, IsString, IsStrongPassword, MaxLength, MinLength } from "class-validator";


export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    @MaxLength(20)
    @IsStrongPassword()
    password: string;


    @IsDefined()
    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    @MaxLength(40)
    readonly firstName: string;

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    @MaxLength(40)
    readonly lastName: string;
} 