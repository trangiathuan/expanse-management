import { IsMongoId, IsNumber } from 'class-validator';

export class CreateTotalMoneyDto {
    @IsMongoId()
    userId: string; // Kiểu string cho ObjectId

    @IsNumber()
    total: number;
}
