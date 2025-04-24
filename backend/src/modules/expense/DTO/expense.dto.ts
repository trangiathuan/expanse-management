import { IsMongoId, IsNumber, IsString } from 'class-validator';
import { Date } from 'mongoose';

export class CreateExpenseDto {
    @IsMongoId()
    userId: string; // Kiểu string cho ObjectId

    @IsString()
    category: string;

    @IsString()
    type: string;

    @IsNumber()
    amount: number;

    @IsNumber()
    total: number;

    @IsString()
    description: string;

    @IsString()
    date: string;
}
