import { IsString, MinLength } from 'class-validator';

export class RegisterDto {
    @IsString()
    fullName: string;

    @IsString()
    username: string;

    @IsString()
    @MinLength(6)
    password: string;
}