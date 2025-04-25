import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ExpenseDocument = Expense & Document;

@Schema()
export class Expense {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ type: String, enum: ['Đi chơi', 'Ăn uống', 'Giải trí', 'Mua sắm', 'Nhận tiền', 'Khác'], required: true })
    category: string;

    @Prop({ type: String, enum: ['Thu nhập', 'Chi tiêu'], required: true })
    type: string;

    @Prop({ required: true })
    amount: number;

    @Prop({ required: true })
    total: number;

    @Prop()
    description: string;

    @Prop({ type: Date, required: true })
    date: Date;

    @Prop({ default: () => new Date() })
    createdAt: Date;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);
